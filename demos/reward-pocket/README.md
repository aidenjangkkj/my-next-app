# Reward Pocket — App–Web Bridge Lab

광고 실행 요청과 응답을 추적하고, 연결 세션이 바뀌거나 응답이 늦게 도착하는 상황을 재현하는 브라우저 데모입니다. React·TypeScript·Radix Themes를 사용합니다.

## 실행

Node.js 22.12 이상, pnpm 10.20.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

개발 서버에서 `http://127.0.0.1:5173/index.html?host=1`을 엽니다.

## 체험

1. 웹뷰에서 광고를 시작합니다. 앱 패널에 `web.ad.request`가 도착합니다.
2. 앱에서 **시청 완료 보내기**를 누르면 웹이 광고 상태를 저장하고 `web.receipt`로 회신합니다.
3. **모의 지급 확정 보내기**를 누르면 보상 상태와 10 P가 저장됩니다.
4. 마지막 응답을 중복 전송하면 `ignored`가 회신됩니다.
5. 새 앱 세션을 시작하고 이전 세션 응답을 보내면 세션 불일치로 거절됩니다.
6. 새 참여에서 10초 지연 응답을 보내면 8초 타임아웃 뒤 늦은 완료가 무시됩니다. 이후 모의 지급은 별도로 확인할 수 있습니다.

## 설계

부모 화면은 모의 앱 호스트, iframe은 웹뷰입니다. 실제 `postMessage`로 통신하며 origin·발신 창·버전·메시지 타입·세션·참여 ID를 확인합니다. 메시지는 순서대로 처리하고 동일 메시지 ID를 중복 처리하지 않습니다.

연결 세션과 참여 기록은 별개입니다. 웹뷰 재로드는 새 연결을 만들고, 참여 기록은 같은 origin의 localStorage에서 복원합니다. 상태 갱신은 Web Locks 안에서 최신 기록을 읽고 저장하며, 실제 적용 여부를 회신합니다. 저장이 실패하면 잔액을 확정하지 않고 웹에서 같은 이벤트를 재시도할 수 있습니다. 손상 기록은 자동 삭제하지 않습니다.

- `src/bridge/protocol.ts`: 메시지 계약과 검증
- `src/bridge/useAppBridge.ts`: 웹 수신·직렬 처리·요청·타임아웃
- `src/bridge/BridgeDemo.tsx`: 모의 호스트와 최근 60개 통신 로그
- `src/ads/session.ts`: 광고·보상 상태 전이
- `src/ads/storage.ts`: 저장 문서 검증과 적용 여부
- `src/ads/useStoredSessions.ts`: 저장 실패 재시도·탭 간 동기화

## 확인한 범위

46개 단위 테스트와 브라우저에서 정상 지급, 연속 완료/지급, 중복·이전 세션 응답, 타임아웃, 재로드, 저장 실패 재시도, 탭 간 취소 경합을 확인했습니다. 테스트 수는 이후 변경에 따라 달라질 수 있으며 `pnpm test`로 확인할 수 있습니다.

브라우저 시뮬레이션이며 실제 네이티브 WebView·광고 SDK·서버 지급 보증을 구현한 것은 아닙니다. 포인트는 현금 가치가 없고 저장 값을 사용자가 바꿀 수 있습니다. 같은 브라우저의 동일 origin에서만 기록이 유지됩니다. HTTPS 또는 localhost에서 Web Locks를 지원하는 브라우저가 필요합니다.

## 포트폴리오 정적 배포

저장소 루트에서:

```sh
pnpm --dir demos/reward-pocket install --frozen-lockfile
npm run test:demo
npm run build:demo
```

`public/demos/reward-pocket`은 위 명령의 생성물입니다. `/demos/reward-pocket/index.html?host=1`을 사용합니다. CI는 원본 소스 테스트와 빌드 결과의 동기화를 확인합니다. 배포 중 별도 서버나 추가 환경변수는 필요하지 않습니다.
