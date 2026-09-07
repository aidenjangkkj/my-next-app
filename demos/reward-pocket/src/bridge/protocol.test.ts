import { describe, expect, it } from 'vitest'
import { parseMessage, rejectionReason } from './protocol'

const message = { channel: 'reward-pocket-bridge', version: 1, id: 'message-1', sessionId: 'session-1', type: 'host.ad.result', requestId: 'ad-1', result: 'complete' }

describe('bridge boundary', () => {
  it('accepts the supported result contract', () => expect(parseMessage(message)).toEqual(message))
  it.each([null, {}, { ...message, version: 2 }, { ...message, type: 'eval' }, { ...message, requestId: '' }, { ...message, result: 'grant' }, { ...message, result: ['complete'] }, { ...message, type: 'web.receipt', replyTo: 'reply', status: ['applied'], detail: 'test' }, { ...message, id: 42 }])('rejects malformed input %j', value => expect(parseMessage(value)).toBeNull())
  it('accepts the expected window, origin, session and request', () => expect(rejectionReason(message, true, true, 'session-1', 'ad-1', new Set())).toBeNull())
  it('rejects a different origin', () => expect(rejectionReason(message, false, true, 'session-1', 'ad-1', new Set())).toBe('출처 불일치'))
  it('rejects a different source window', () => expect(rejectionReason(message, true, false, 'session-1', 'ad-1', new Set())).toBe('발신 창 불일치'))
  it('rejects the previous connection session', () => expect(rejectionReason(message, true, true, 'session-2', 'ad-1', new Set())).toBe('이전 또는 다른 연결 세션'))
  it('rejects another participation', () => expect(rejectionReason(message, true, true, 'session-1', 'ad-2', new Set())).toBe('다른 참여 요청'))
  it('rejects a duplicate envelope', () => expect(rejectionReason(message, true, true, 'session-1', 'ad-1', new Set(['message-1']))).toBe('중복 메시지'))
})
