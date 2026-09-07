export type BridgeBody =
  | { type: 'web.ready' | 'host.connected' | 'host.resume' | 'host.disconnect' }
  | { type: 'web.ad.request' | 'host.reward.grant'; requestId: string }
  | { type: 'host.ad.result'; requestId: string; result: 'complete' | 'cancel' | 'fail' }
  | { type: 'web.receipt'; replyTo: string; status: 'applied' | 'ignored' | 'error'; detail: string }
export type BridgeMessage = BridgeBody & { channel: 'reward-pocket-bridge'; version: 1; id: string; sessionId: string }

const identifier = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= 128
export function makeMessage(sessionId: string, body: BridgeBody): BridgeMessage {
  return { ...body, channel: 'reward-pocket-bridge', version: 1, id: crypto.randomUUID(), sessionId }
}
export function parseMessage(value: unknown): BridgeMessage | null {
  if (!value || typeof value !== 'object') return null
  const m = value as Record<string, unknown>
  if (m.channel !== 'reward-pocket-bridge' || m.version !== 1 || !identifier(m.id) || !identifier(m.sessionId)) return null
  switch (m.type) {
    case 'web.ready': case 'host.connected': case 'host.resume': case 'host.disconnect': break
    case 'web.ad.request': case 'host.reward.grant': if (!identifier(m.requestId)) return null; break
    case 'host.ad.result':
      if (!identifier(m.requestId) || typeof m.result !== 'string' || !['complete', 'cancel', 'fail'].includes(m.result)) return null
      break
    case 'web.receipt':
      if (!identifier(m.replyTo) || typeof m.status !== 'string' || !['applied', 'ignored', 'error'].includes(m.status)
        || typeof m.detail !== 'string' || m.detail.length > 200) return null
      break
    default: return null
  }
  return value as BridgeMessage
}
export function rejectionReason(value: unknown, originMatches: boolean, sourceMatches: boolean, sessionId: string, requestId: string, seen: Set<string>): string | null {
  if (!originMatches) return '출처 불일치'
  if (!sourceMatches) return '발신 창 불일치'
  const m = parseMessage(value)
  if (!m) return '메시지 형식 오류'
  if (m.sessionId !== sessionId) return '이전 또는 다른 연결 세션'
  if ('requestId' in m && m.requestId !== requestId) return '다른 참여 요청'
  if (seen.has(m.id)) return '중복 메시지'
  return null
}
