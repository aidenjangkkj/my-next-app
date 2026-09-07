export type AdState = 'idle' | 'playing' | 'completed' | 'cancelled' | 'failed' | 'timeout'
export type RewardState = 'none' | 'pending' | 'granted'
export type AdAction = 'complete' | 'cancel' | 'fail' | 'timeout' | 'grant'
export type AdEvent = {
  requestId: string
  type: AdAction
} | {
  requestId: string
  type: 'start'
  startedAt: number
  automatic: boolean
}
export type AdSession = { requestId: string; ad: AdState; reward: RewardState; startedAt: number; automatic: boolean }
export const initialSession: AdSession = { requestId: '', ad: 'idle', reward: 'none', startedAt: 0, automatic: false }

export function transition(state: AdSession, event: AdEvent): AdSession {
  if (event.type === 'start') {
    return state.ad === 'idle' && event.requestId.trim() && Number.isSafeInteger(event.startedAt) && event.startedAt >= 0 && typeof event.automatic === 'boolean'
      ? { requestId: event.requestId, ad: 'playing', reward: 'none', startedAt: event.startedAt, automatic: event.automatic }
      : state
  }
  if (state.requestId !== event.requestId) return state
  // grant is a mock verified result, not an ad callback. The server owns this in production.
  if (event.type === 'grant') {
    return state.reward === 'pending' ? { ...state, reward: 'granted' } : state
  }
  if (state.ad !== 'playing') return state
  switch (event.type) {
    case 'complete': return { ...state, ad: 'completed', reward: 'pending' }
    case 'timeout': return { ...state, ad: 'timeout', reward: 'pending' }
    case 'cancel': return { ...state, ad: 'cancelled' }
    case 'fail': return { ...state, ad: 'failed' }
  }
}

export function updateSessions(sessions: AdSession[], event: AdEvent): AdSession[] {
  if (event.type === 'start' && !sessions.some(s => s.requestId === event.requestId)) {
    const next = transition(initialSession, event)
    return next === initialSession ? sessions : [next, ...sessions]
  }
  return sessions.map(session => transition(session, event))
}

export function nextAutomaticEvent(session: AdSession, now: number): { type: AdAction; delay: number } | null {
  if (!session.automatic) return null
  const type = session.ad === 'playing' ? 'complete'
    : session.ad === 'completed' && session.reward === 'pending' ? 'grant' : null
  if (!type) return null
  const duration = type === 'complete' ? 3000 : 3900
  return { type, delay: Math.max(0, Math.min(duration, session.startedAt + duration - now)) }
}
