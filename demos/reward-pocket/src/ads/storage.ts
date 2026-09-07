import { updateSessions } from './session'
import type { AdEvent, AdSession } from './session'

export const STORAGE_KEY = 'reward-pocket:sessions:v1'
type SessionStorage = Pick<Storage, 'getItem' | 'setItem'>

function isSession(value: unknown): value is AdSession {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  if (typeof s.requestId !== 'string' || !s.requestId.trim()
    || !Number.isSafeInteger(s.startedAt) || (s.startedAt as number) < 0
    || typeof s.automatic !== 'boolean') return false
  return ((s.ad === 'playing' || s.ad === 'cancelled' || s.ad === 'failed') && s.reward === 'none')
    || ((s.ad === 'completed' || s.ad === 'timeout') && (s.reward === 'pending' || s.reward === 'granted'))
}

export function readSessions(storage: SessionStorage): AdSession[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []
  const data: unknown = JSON.parse(raw)
  if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1
    || !('sessions' in data) || !Array.isArray(data.sessions) || !data.sessions.every(isSession)
    || new Set(data.sessions.map(s => s.requestId)).size !== data.sessions.length) {
    throw new Error('저장된 참여 기록 형식을 확인할 수 없습니다.')
  }
  return data.sessions
}

export type CommitResult = { sessions: AdSession[]; applied: boolean }

export function commitEvent(storage: SessionStorage, event: AdEvent): CommitResult {
  const sessions = readSessions(storage)
  if (event.type === 'start' && sessions.some(s => s.ad === 'playing' || s.reward === 'pending')) return { sessions, applied: false }
  const next = updateSessions(sessions, event)
  const applied = next.length !== sessions.length || next.some((s, index) => s !== sessions[index])
  if (applied) {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sessions: next }))
  }
  return { sessions: next, applied }
}
