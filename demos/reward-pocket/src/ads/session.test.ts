import { describe, expect, it } from 'vitest'
import { initialSession, transition, updateSessions, nextAutomaticEvent } from './session'

const start = () => transition(initialSession, { requestId: 'a', type: 'start', startedAt: 1000, automatic: true })

describe('광고 실행과 모의 보상 상태', () => {
  it('광고를 시작해도 보상은 지급하지 않는다', () => {
    expect(start()).toMatchObject({ requestId: 'a', ad: 'playing', reward: 'none' })
  })
  it('광고 완료는 지급이 아닌 보상 확인 중으로 전환한다', () => {
    expect(transition(start(), { requestId: 'a', type: 'complete' }))
      .toMatchObject({ requestId: 'a', ad: 'completed', reward: 'pending' })
  })
  it('다른 요청의 콜백을 무시한다', () => {
    const state = start()
    expect(transition(state, { requestId: 'b', type: 'complete' })).toBe(state)
  })
  it('중복 완료·지급 이벤트가 결과를 다시 바꾸지 않는다', () => {
    const completed = transition(start(), { requestId: 'a', type: 'complete' })
    const granted = transition(completed, { requestId: 'a', type: 'grant' })
    expect(granted.reward).toBe('granted')
    expect(transition(completed, { requestId: 'a', type: 'complete' })).toBe(completed)
    expect(transition(granted, { requestId: 'a', type: 'grant' })).toBe(granted)
    expect(transition(granted, { requestId: 'a', type: 'complete' })).toBe(granted)
  })
  it('타임아웃 후 늦은 완료 콜백은 무시하지만 모의 지급 결과는 반영한다', () => {
    const timedOut = transition(start(), { requestId: 'a', type: 'timeout' })
    expect(timedOut).toMatchObject({ requestId: 'a', ad: 'timeout', reward: 'pending' })
    expect(transition(timedOut, { requestId: 'a', type: 'complete' })).toBe(timedOut)
    expect(transition(timedOut, { requestId: 'a', type: 'grant' }))
      .toMatchObject({ requestId: 'a', ad: 'timeout', reward: 'granted' })
  })
  it('완료 확인 전에는 모의 지급 이벤트도 수락하지 않는다', () => {
    const state = start()
    expect(transition(state, { requestId: 'a', type: 'grant' })).toBe(state)
  })
  it.each(['cancel', 'fail'] as const)('%s 이후에는 완료와 지급을 무시한다', (type) => {
    const ended = transition(start(), { requestId: 'a', type })
    expect(ended.ad).toBe(type === 'cancel' ? 'cancelled' : 'failed')
    expect(transition(ended, { requestId: 'a', type: 'complete' })).toBe(ended)
    expect(transition(ended, { requestId: 'a', type: 'grant' })).toBe(ended)
  })
  it('이미 시작한 세션을 중복 start로 초기화하지 않는다', () => {
    const state = start()
    expect(transition(state, { requestId: 'a', type: 'start', startedAt: 1000, automatic: true })).toBe(state)
    expect(transition(state, { requestId: 'b', type: 'start', startedAt: 1000, automatic: true })).toBe(state)
  })
})

describe('모의 참여 기록', () => {
  it('중복 시작과 지급에도 한 참여의 지급 건수는 하나다', () => {
    let sessions = updateSessions([], { requestId: 'a', type: 'start', startedAt: 1000, automatic: true })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'start', startedAt: 1000, automatic: true })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'complete' })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'grant' })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'grant' })
    expect(sessions).toHaveLength(1)
    expect(sessions.filter(s => s.reward === 'granted')).toHaveLength(1)
  })
  it('이전 참여의 늦은 지급은 해당 기록만 갱신한다', () => {
    let sessions = updateSessions([], { requestId: 'a', type: 'start', startedAt: 1000, automatic: true })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'timeout' })
    sessions = updateSessions(sessions, { requestId: 'b', type: 'start', startedAt: 1000, automatic: true })
    sessions = updateSessions(sessions, { requestId: 'a', type: 'grant' })
    expect(sessions[0]).toMatchObject({ requestId: 'b', ad: 'playing', reward: 'none' })
    expect(sessions[1]).toMatchObject({ requestId: 'a', ad: 'timeout', reward: 'granted' })
  })
})


describe('저장된 시작 시각 기준 자동 실행', () => {
  it('참여에 시작 시각과 실행 모드를 보존한다', () => {
    expect(start()).toMatchObject({ startedAt: 1000, automatic: true })
  })
  it('재진입 시 남은 시간만 기다린다', () => {
    expect(nextAutomaticEvent(start(), 2500)).toEqual({ type: 'complete', delay: 1500 })
  })
  it('종료 시각이 지난 참여는 즉시 다음 단계로 진행한다', () => {
    const completed = transition(start(), { requestId: 'a', type: 'complete' })
    expect(nextAutomaticEvent(start(), 6000)).toEqual({ type: 'complete', delay: 0 })
    expect(nextAutomaticEvent(completed, 6000)).toEqual({ type: 'grant', delay: 0 })
  })
  it('복원한 수동 시연과 타임아웃에는 자동 지급을 예약하지 않는다', () => {
    expect(nextAutomaticEvent({ ...start(), automatic: false }, 6000)).toBeNull()
    const timedOut = transition(start(), { requestId: 'a', type: 'timeout' })
    expect(nextAutomaticEvent(timedOut, 6000)).toBeNull()
  })
})
