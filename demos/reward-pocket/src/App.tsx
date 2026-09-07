import { useCallback, useEffect, useState } from 'react'
import {
  Badge, Box, Button, Callout, Card, Code, Container, Flex,
  Grid, Heading, Link, Separator, Spinner, Tabs, Text,
} from '@radix-ui/themes'
import { initialSession, nextAutomaticEvent } from './ads/session'
import { useAppBridge } from './bridge/useAppBridge'
import { useStoredSessions } from './ads/useStoredSessions'
import type { AdAction, AdEvent, AdSession } from './ads/session'

const POINTS = 10
const query = new URLSearchParams(window.location.search)
const bridgeSession = query.get('webview') === '1' ? query.get('bridgeSession') : null
const adLabels = {
  idle: '참여 전', playing: '영상 재생 중', completed: '영상 시청 완료',
  cancelled: '참여 취소', failed: '광고 로드 실패', timeout: '광고 응답 대기 종료',
}
const rewardLabels = { none: '미지급', pending: '보상 확인 중', granted: '지급 완료' }
const events: { type: AdAction; label: string }[] = [
  { type: 'complete', label: '완료 콜백' },
  { type: 'cancel', label: '중도 종료' },
  { type: 'fail', label: '로드 실패' },
  { type: 'timeout', label: '콜백 타임아웃' },
  { type: 'grant', label: '모의 지급 확정' },
]

function SessionStatus({ session }: { session: AdSession }) {
  return (
    <Flex gap="2" wrap="wrap" role="status" aria-live="polite">
      <Badge color="gray">{adLabels[session.ad]}</Badge>
      <Badge color={session.reward === 'granted' ? 'teal' : 'orange'}>
        {rewardLabels[session.reward]}
      </Badge>
    </Flex>
  )
}

export default function App() {
  const [tab, setTab] = useState('discover')
  const { sessions: storedSessions, error, saving, send: persist, retry, refresh } = useStoredSessions()
  const sessions = storedSessions ?? []
  const blocked = saving || !!error
  const [logs, setLogs] = useState<AdEvent[]>([])
  const session = sessions[0] ?? initialSession
  const balance = sessions.filter(s => s.reward === 'granted').length * POINTS
  const pending = sessions.filter(s => s.reward === 'pending').length
  const bridge = useAppBridge(bridgeSession, session, blocked, !!error, persist, refresh)
  const startBlocked = blocked || (!!bridgeSession && !bridge.connected)

  const send = useCallback((event: AdEvent) => {
    void persist(event)
    setLogs(current => [event, ...current].slice(0, 30))
  }, [persist])

  const start = (automatic: boolean) => {
    const requestId = crypto.randomUUID()
    send({ type: 'start', requestId, startedAt: Date.now(), automatic: bridgeSession ? false : automatic })
  }

  useEffect(() => {
    if (blocked) return
    const next = nextAutomaticEvent(session, Date.now())
    if (!next) return
    const timer = window.setTimeout(() => send({ type: next.type, requestId: session.requestId }), next.delay)
    return () => window.clearTimeout(timer)
  }, [session, blocked, send])

  return (
    <Container size="3" px={{ initial: '4', sm: '6' }} py={bridgeSession ? '4' : '6'}>
      <Flex asChild justify="between" align="center" mb={bridgeSession ? '4' : '8'} gap="3" wrap="wrap">
        <header>
          <Flex align="center" gap="3">
            <Box className="brand-mark" aria-hidden="true">r.</Box>
            <Text weight="bold" size="5">reward pocket</Text>
          </Flex>
          <Flex gap="3" align="center" wrap="wrap"><Badge size="2" variant="outline">{bridgeSession ? 'APP WEBVIEW DEMO' : 'INTERACTIVE DEMO'}</Badge>{!bridgeSession && <Link href={`${import.meta.env.BASE_URL}index.html?host=1`}>앱 브릿지 데모 →</Link>}</Flex>
        </header>
      </Flex>

      <main>
        {bridgeSession && <Callout.Root color={bridge.connected ? 'teal' : 'orange'} mb="4"><Callout.Text>{bridge.notice}</Callout.Text></Callout.Root>}
        {error && <Callout.Root color="red" role="alert" mb="5">
          <Callout.Text>{error}</Callout.Text>
          <Button variant="soft" color="red" disabled={saving} onClick={retry}>저장소 다시 시도</Button>
        </Callout.Root>}
        <Grid columns={bridgeSession ? '1' : { initial: '1', sm: '2' }} gap="6" align="center" mb="5">
          {!bridgeSession && <Box>
            <Text as="p" color="teal" size="2" weight="medium" mb="3">작은 참여, 분명한 보상</Text>
            <Heading as="h1" size={{ initial: '8', sm: '9' }} mb="4">
              참여의 끝까지,<br />보이는 리워드.
            </Heading>
            <Text as="p" size="3" color="gray">광고를 고르고, 참여하고, 보상을 확인하세요.<br />기다리는 순간도 놓치지 않도록.</Text>
          </Box>}
          <Card size={bridgeSession ? '3' : '4'} variant="surface">
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Text color="gray" size="2">내 데모 포인트</Text>
                <Badge color="teal">POCKET</Badge>
              </Flex>
              <Heading as="h2" size={bridgeSession ? '7' : '9'} aria-label={storedSessions === null ? '데모 잔액 확인 불가' : `데모 잔액 ${balance} 포인트`}>{storedSessions === null ? '—' : balance.toLocaleString('ko-KR')} <Text size="5" color="gray">P</Text></Heading>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text size="2" color="gray">{storedSessions === null ? '저장 기록 확인 필요' : `확인 중인 보상 ${pending}건`}</Text>
                <Button variant="ghost" onClick={() => setTab('wallet')}>내역 보기 →</Button>
              </Flex>
            </Flex>
          </Card>
        </Grid>

        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List size="2" aria-label="리워드 포켓 메뉴">
            <Tabs.Trigger value="discover">광고 둘러보기</Tabs.Trigger>
            <Tabs.Trigger value="wallet">포인트 내역</Tabs.Trigger>
            {!bridgeSession && <Tabs.Trigger value="lab">개발자 검증</Tabs.Trigger>}
          </Tabs.List>
          <Box pt="6">
            <Tabs.Content value="discover">
              <Grid columns={{ initial: '1', sm: '2' }} gap="5">
                <Card size="4">
                  <Flex direction="column" gap="4">
                    <Flex justify="between"><Badge>보상형 영상</Badge><Text color="gray" size="2">데모 캠페인 01</Text></Flex>
                    {!bridgeSession && <Box className="campaign-art" aria-hidden="true"><span>한 번의 쉼.</span><strong>+10 P</strong></Box>}
                    <Heading as="h2" size="5">잠깐의 쉼을 포인트로</Heading>
                    <Text as="p" color="gray" size="2">{bridgeSession ? '광고 실행을 앱에 요청합니다. 앱 패널에서 시청 완료와 모의 지급 응답을 각각 보내 주세요.' : '3초 분량의 모의 영상을 끝까지 보면 데모 포인트를 받을 수 있어요. 도중에 닫으면 지급되지 않아요.'}</Text>
                    <Button size="3" disabled={startBlocked || session.ad === 'playing' || session.reward === 'pending'} onClick={() => start(true)}>
                      {session.ad === 'playing' ? '참여 중이에요' : session.reward === 'pending' ? '보상을 확인하고 있어요' : '영상 보고 10 P 받기'}
                    </Button>
                  </Flex>
                </Card>
                <Card size="4">
                  <Flex direction="column" gap="5">
                    <Text color="gray" size="2">PARTICIPATION</Text>
                    <Heading as="h2" size="5">이번 참여</Heading>
                    <SessionStatus session={session} />
                    {session.ad === 'idle' && <Text color="gray">마음에 드는 광고에 참여하면 진행 상황을 여기에서 확인할 수 있어요.</Text>}
                    {session.ad === 'playing' && <Flex direction="column" gap="4">
                      <Flex gap="3" align="center"><Spinner /><Text>{bridgeSession ? '앱의 광고 완료 응답을 기다리고 있어요.' : '모의 영상이 재생되고 있어요.'}</Text></Flex>
                      <Button variant="soft" color="gray" disabled={blocked} onClick={() => send({ type: 'cancel', requestId: session.requestId })}>영상 닫기</Button>
                    </Flex>}
                    {session.reward === 'pending' && (bridgeSession ? <Text color="gray">앱 패널의 ‘모의 지급 확정 보내기’로 보상을 확인해 주세요.</Text> : session.automatic && session.ad === 'completed'
                      ? <Text color="gray">시청 결과를 확인하고 있어요. 저장이 끝나면 내역에 반영돼요.</Text>
                      : <Flex direction="column" gap="3"><Text color="gray">수동 확인이 필요한 데모 참여예요. 개발자 검증에서 모의 지급 결과를 확인할 수 있어요.</Text><Button variant="soft" onClick={() => setTab('lab')}>검증 화면에서 확인</Button></Flex>)}
                    {session.reward === 'granted' && <Callout.Root><Callout.Text>데모 포인트 10 P가 적립됐어요.</Callout.Text></Callout.Root>}
                    {session.ad === 'cancelled' && <Text color="gray">영상을 끝까지 보지 않아 포인트가 지급되지 않았어요. 다시 참여할 수 있어요.</Text>}
                    {session.ad === 'failed' && <Text color="gray">광고를 불러오지 못했어요. 다시 참여해 주세요.</Text>}
                    <Separator size="4" />
                    <Text size="2" color="gray">시청 완료 → 보상 확인 → 적립 완료</Text>
                  </Flex>
                </Card>
              </Grid>
            </Tabs.Content>

            <Tabs.Content value="wallet">
              <Flex direction="column" gap="4">
                <Heading as="h2" size="5">참여와 보상 내역</Heading>
                {storedSessions !== null && sessions.length === 0 && <Card size="4"><Text color="gray">아직 참여 내역이 없어요. 첫 광고를 둘러보세요.</Text></Card>}
                {sessions.map((item, index) => <Card size="3" key={item.requestId}>
                  <Flex justify="between" align="center" gap="4" wrap="wrap">
                    <Flex direction="column" gap="2">
                      <Text weight="medium">잠깐의 쉼을 포인트로 · 참여 {sessions.length - index}</Text>
                      <Text size="1" color="gray">{new Date(item.startedAt).toLocaleString('ko-KR')} · {item.automatic ? '자동 참여' : '수동 검증'}</Text>
                      <SessionStatus session={item} />
                    </Flex>
                    <Text size="5" weight="bold" color={item.reward === 'granted' ? 'teal' : 'gray'}>
                      {item.reward === 'granted' ? '+10 P' : item.reward === 'pending' ? '확인 중' : '0 P'}
                    </Text>
                  </Flex>
                </Card>)}
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="lab">
              <Flex direction="column" gap="5">
                <Box><Heading as="h2" size="5" mb="2">광고 실행 검증</Heading><Text color="gray" size="2">사용자 화면과 같은 상태 전이에 모의 이벤트를 전달합니다.</Text></Box>
                <Callout.Root color="orange"><Callout.Text>브라우저 시뮬레이션입니다. 실제 SDK·보상 서버와 연결되지 않았습니다. 아래에서 수동 참여를 시작한 후 이벤트를 순서대로 눌러보세요.</Callout.Text></Callout.Root>
                <Card size="3">
                  <Flex direction="column" gap="4">
                    <Flex gap="3" wrap="wrap" align="center">
                      <Button disabled={startBlocked || session.ad === 'playing' || session.reward === 'pending'} onClick={() => start(false)}>수동 참여 시작</Button>
                      <SessionStatus session={session} />
                    </Flex>
                    <Text size="2" color="gray">현재 요청: <Code className="request-id">{session.requestId || '없음'}</Code></Text>
                    <Flex gap="2" wrap="wrap">
                      {events.map(event => <Button key={event.type} variant="soft" disabled={blocked || !session.requestId}
                        onClick={() => send({ type: event.type, requestId: session.requestId })}>{event.label}</Button>)}
                      <Button color="gray" variant="soft" disabled={blocked || !session.requestId}
                        onClick={() => send({ type: 'complete', requestId: 'unknown-request' })}>다른 요청의 콜백</Button>
                    </Flex>
                    <Text size="2" color="gray">완료 → 지급 → 지급 재전송: 잔액이 한 번만 증가합니다. 타임아웃 → 완료: 실행 상태가 되돌아가지 않습니다. 이후 모의 지급 확정은 별도로 반영됩니다.</Text>
                  </Flex>
                </Card>
                <Box><Heading as="h3" size="3" mb="3">이번 방문에서 전달한 이벤트 · 최근 30개</Heading>
                  {logs.length === 0 ? <Text color="gray" size="2">아직 이벤트가 없어요.</Text> : <Flex asChild direction="column" gap="2"><ol className="event-log">
                    {logs.map((log, index) => <li key={logs.length - index}><Code>{log.type}</Code> <Text size="1" color="gray" className="request-id">{log.requestId}</Text></li>)}
                  </ol></Flex>}
                </Box>
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </main>
      <Box asChild mt="8" pt="5"><footer><Separator size="4" mb="4" /><Text as="p" size="1" color="gray">개발 데모 · 포인트는 현금 가치가 없으며, 참여 내역은 이 브라우저에 저장됩니다. 브라우저 데이터를 삭제하면 내역도 삭제되며, 다른 기기와 공유되지 않습니다.</Text><Text as="p" size="1" color="gray" mt="2">Reward Pocket · Built with Radix Themes</Text></footer></Box>
    </Container>
  )
}
