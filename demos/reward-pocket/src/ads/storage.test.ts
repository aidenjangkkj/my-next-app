import { describe, expect, it } from 'vitest'
import { commitEvent, readSessions, STORAGE_KEY } from './storage'
import type { AdEvent } from './session'

function memoryStorage(initial: string | null = null) {
  let raw = initial
  return { getItem: (_key: string) => raw, setItem: (_key: string, value: string) => { raw = value } }
}
const start: AdEvent = { requestId: 'a', type: 'start', startedAt: 1000, automatic: true }
const completed = { requestId: 'a', ad: 'completed', reward: 'pending', startedAt: 1000, automatic: true }
const document = (sessions: unknown[], version = 1) => JSON.stringify({ version, sessions })

describe('브라우저 참여 저장소', () => {
  it('적용 여부는 최신 저장 기록을 갱신한 결과로 반환한다', () => {
    const storage = memoryStorage()
    expect(commitEvent(storage, start).applied).toBe(true)
    expect(commitEvent(storage, { requestId: 'a', type: 'cancel' }).applied).toBe(true)
    expect(commitEvent(storage, { requestId: 'a', type: 'complete' }).applied).toBe(false)
    expect(readSessions(storage)[0].ad).toBe('cancelled')
  })
  it('기록이 없으면 빈 목록을 반환한다', () => {
    expect(readSessions(memoryStorage())).toEqual([])
  })
  it('시작 시각·모드·참여 결과를 새 저장소 읽기에서도 복원한다', () => {
    const storage = memoryStorage()
    const result = commitEvent(storage, start).sessions
    expect(result).toEqual([{ requestId: 'a', ad: 'playing', reward: 'none', startedAt: 1000, automatic: true }])
    expect(readSessions(storage)).toEqual(result)
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toEqual({ version: 1, sessions: result })
  })
  it('새로고침 후 같은 참여에 지급을 재전송해도 기록은 하나다', () => {
    const storage = memoryStorage(document([completed]))
    commitEvent(storage, { requestId: 'a', type: 'grant' })
    const restored = memoryStorage(storage.getItem(STORAGE_KEY))
    commitEvent(restored, { requestId: 'a', type: 'grant' })
    expect(readSessions(restored)).toEqual([{ ...completed, reward: 'granted' }])
  })
  it('새 참여 시작은 기존 지급 내역을 보존한다', () => {
    const storage = memoryStorage(document([{ ...completed, reward: 'granted' }]))
    const result = commitEvent(storage, { ...start, requestId: 'b' }).sessions
    expect(result).toHaveLength(2)
    expect(result[1].reward).toBe('granted')
  })
  it('다른 탭에 진행 중인 참여가 있으면 새 참여를 만들지 않는다', () => {
    const storage = memoryStorage()
    commitEvent(storage, start)
    expect(commitEvent(storage, { ...start, requestId: 'b' }).sessions).toHaveLength(1)
  })
  it.each([
    '{broken',
    document([completed], 2),
    document([completed, completed]),
    document([{ ...completed, reward: 'unknown' }]),
    document([{ ...completed, startedAt: 'yesterday' }]),
    document([{ ...completed, startedAt: -1 }]),
    document([{ ...completed, ad: 'cancelled', reward: 'granted' }]),
  ])('손상되거나 미지원인 기록은 읽기·쓰기를 거부하고 원본을 보존한다 (%#)', raw => {
    const storage = memoryStorage(raw)
    expect(() => readSessions(storage)).toThrow()
    expect(() => commitEvent(storage, start)).toThrow()
    expect(storage.getItem(STORAGE_KEY)).toBe(raw)
  })
  it('저장이 실패하면 지급을 확정하지 않고 같은 이벤트로 재시도한다', () => {
    const storage = memoryStorage(document([completed]))
    const blocked = { ...storage, setItem: () => { throw new Error('quota exceeded') } }
    const grant: AdEvent = { requestId: 'a', type: 'grant' }
    expect(() => commitEvent(blocked, grant)).toThrow()
    expect(readSessions(storage)[0].reward).toBe('pending')
    expect(commitEvent(storage, grant).sessions[0].reward).toBe('granted')
  })
  it('저장소 읽기가 차단되면 빈 기록으로 간주하지 않는다', () => {
    const storage = { getItem: () => { throw new Error('denied') }, setItem: () => {} }
    expect(() => readSessions(storage)).toThrow()
  })
})
