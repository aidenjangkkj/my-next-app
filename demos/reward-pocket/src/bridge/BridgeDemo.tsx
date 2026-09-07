import { useEffect, useRef, useState } from 'react'
import { Badge, Box, Button, Callout, Card, Code, Container, Flex, Grid, Heading, Link, Text } from '@radix-ui/themes'
import { makeMessage, parseMessage } from './protocol'
import type { BridgeBody, BridgeMessage } from './protocol'

type Log = { id: string; at: number; direction: string; message: BridgeMessage; detail: string }

export default function BridgeDemo() {
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const [connected, setConnected] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [delayed, setDelayed] = useState(false)
  const iframe = useRef<HTMLIFrameElement>(null)
  const current = useRef({ sessionId, enabled: true, readyId: '' })
  const previous = useRef<BridgeMessage | null>(null)
  const lastResponse = useRef<BridgeMessage | null>(null)
  const delayTimer = useRef<number | undefined>(undefined)

  const log = (direction: string, message: BridgeMessage, detail: string) => {
    setLogs(items => [{ id: crypto.randomUUID(), at: Date.now(), direction, message, detail }, ...items].slice(0, 60))
  }
  const transmit = (message: BridgeMessage) => {
    iframe.current?.contentWindow?.postMessage(message, window.location.origin)
    log('앱 → 웹 · 송신', message, '웹의 처리 회신을 기다립니다.')
  }
  const send = (body: BridgeBody) => {
    const message = makeMessage(current.current.sessionId, body)
    transmit(message)
    if (body.type === 'host.ad.result' || body.type === 'host.reward.grant') lastResponse.current = message
  }

  useEffect(() => {
    const seen = new Set<string>()
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return
      const m = parseMessage(event.data)
      if (!m || !m.type.startsWith('web.') || m.sessionId !== current.current.sessionId || seen.has(m.id)) return
      seen.add(m.id)
      log('웹 → 앱 · 수신', m, m.type === 'web.receipt' ? `${m.status} · ${m.detail}` : '앱이 메시지를 받았습니다.')
      if (m.type === 'web.ready' && current.current.enabled) {
        if (current.current.readyId && current.current.readyId !== m.id) { reconnect(); return }
        current.current.readyId = m.id
        setConnected(true)
        transmit(makeMessage(current.current.sessionId, { type: 'host.connected' }))
      }
      if (m.type === 'web.ad.request' && current.current.enabled) setRequestId(m.requestId)
    }
    window.addEventListener('message', receive)
    return () => { window.removeEventListener('message', receive); window.clearTimeout(delayTimer.current) }
  }, [])

  const reconnect = () => {
    window.clearTimeout(delayTimer.current)
    setDelayed(false)
    previous.current = lastResponse.current
    lastResponse.current = null
    const next = crypto.randomUUID()
    current.current = { sessionId: next, enabled: true, readyId: '' }
    setConnected(false); setRequestId(''); setSessionId(next)
  }
  const disconnect = () => {
    window.clearTimeout(delayTimer.current)
    setDelayed(false)
    send({ type: 'host.disconnect' })
    current.current.enabled = false
    setConnected(false)
  }
  const delayResponse = () => {
    const message = makeMessage(sessionId, { type: 'host.ad.result', requestId, result: 'complete' })
    setDelayed(true)
    log('앱 · 시나리오', message, '10초 뒤 전송 예약. 웹의 광고 대기는 8초입니다.')
    delayTimer.current = window.setTimeout(() => {
      transmit(message); lastResponse.current = message; setDelayed(false)
    }, 10000)
  }

  return <Container size="4" p={{ initial: '3', sm: '5' }}>
    <Flex justify="between" align="center" gap="3" wrap="wrap" mb="5">
      <Box><Text color="teal" size="2" weight="bold">REWARD POCKET · BRIDGE LAB</Text><Heading as="h1" size="7" mt="2">앱과 웹 사이, 오가는 요청.</Heading></Box>
      <Link href={`${import.meta.env.BASE_URL}index.html`}>독립 데모로 돌아가기 →</Link>
    </Flex>
    <Callout.Root mb="5"><Callout.Text>브라우저 기반 모의 앱입니다. 웹 화면에서 광고를 시작한 뒤 앱 패널에서 응답을 보내세요. 실제 네이티브 SDK와 연결되지 않습니다.</Callout.Text></Callout.Root>
    <Grid columns={{ initial: '1', md: '2' }} gap="5" align="start">
      <Flex direction="column" gap="4">
        <Card size="3"><Flex direction="column" gap="4">
          <Flex justify="between" align="center"><Heading as="h2" size="5">모의 앱 호스트</Heading><Badge color={connected ? 'teal' : 'gray'}>{connected ? '연결됨' : '연결 종료 / 대기'}</Badge></Flex>
          <Text size="1" color="gray">연결 세션 <Code className="request-id">{sessionId}</Code></Text>
          <Flex gap="2" wrap="wrap"><Button onClick={reconnect}>새 앱 세션 시작</Button><Button variant="soft" color="gray" disabled={!connected} onClick={disconnect}>세션 종료</Button><Button variant="soft" disabled={!connected} onClick={() => send({ type: 'host.resume' })}>앱 복귀 보내기</Button></Flex>
          <Text size="2">현재 광고 요청 <Code className="request-id">{requestId || '웹에서 광고를 시작해 주세요.'}</Code></Text>
          <Flex gap="2" wrap="wrap">
            <Button disabled={!connected || !requestId} onClick={() => send({ type: 'host.ad.result', requestId, result: 'complete' })}>시청 완료 보내기</Button>
            <Button variant="soft" disabled={!connected || !requestId} onClick={() => send({ type: 'host.reward.grant', requestId })}>모의 지급 확정 보내기</Button>
            <Button variant="soft" color="gray" disabled={!connected || !requestId} onClick={() => send({ type: 'host.ad.result', requestId, result: 'fail' })}>광고 실패 보내기</Button>
          </Flex>
          <Text size="2" color="gray">완료 응답을 보낸 뒤 ‘광고 결과 저장 완료’ 회신을 확인하고 모의 지급을 확정하세요. 8초 동안 응답하지 않으면 웹은 대기를 종료합니다.</Text>
          <Flex gap="2" wrap="wrap">
            <Button variant="outline" disabled={!connected || !requestId || delayed} onClick={delayResponse}>{delayed ? '지연 응답 예약됨' : '10초 지연 응답'}</Button>
            <Button variant="outline" disabled={!connected || !lastResponse.current} onClick={() => lastResponse.current && transmit(lastResponse.current)}>마지막 응답 중복 전송</Button>
            <Button variant="outline" disabled={!connected || !previous.current} onClick={() => previous.current && transmit(previous.current)}>이전 세션 응답 보내기</Button>
          </Flex>
          <Text size="1" color="gray">새 세션은 연결만 교체합니다. 참여 기록은 유지되며, 이전 세션 응답은 새 연결에서 무시됩니다.</Text>
        </Flex></Card>
        <Card size="3"><Heading as="h2" size="4" mb="3">통신 타임라인 · 최근 60개</Heading>
          <Text as="p" size="1" color="gray" mb="3">송신은 발송 기록입니다. web.receipt가 실제 웹의 수신·처리 결과를 알려줍니다. 새로고침 시 이 로그는 초기화됩니다.</Text>
          <Box className="bridge-timeline" role="log" aria-label="브릿지 통신 기록" aria-live="polite">
            {logs.length === 0 ? <Text color="gray">연결을 기다리고 있어요.</Text> : logs.map(item => <Box key={item.id} className="bridge-log-row">
              <Flex justify="between" gap="2"><Text size="1" weight="bold">{item.direction}</Text><Text size="1" color="gray">{new Date(item.at).toLocaleTimeString('ko-KR', { hour12: false })}</Text></Flex>
              <Text as="p" size="2" weight="medium" mt="1">{item.message.type}</Text>
              <Text as="p" size="2" color={item.message.type === 'web.receipt' && item.message.status !== 'applied' ? 'orange' : 'gray'}>{item.detail}</Text>
              <details><summary>메시지 상세</summary><pre>{JSON.stringify(item.message, null, 2)}</pre></details>
            </Box>)}
          </Box>
        </Card>
      </Flex>
      <Box><Flex justify="between" align="center" mb="3"><Heading as="h2" size="4">리워드 웹뷰</Heading><Badge variant="outline">실제 iframe 메시지 통신</Badge></Flex>
        <iframe ref={iframe} key={sessionId} title="리워드 웹뷰 데모" src={`${import.meta.env.BASE_URL}index.html?webview=1&bridgeSession=${sessionId}`} className="bridge-frame" />
      </Box>
    </Grid>
  </Container>
}
