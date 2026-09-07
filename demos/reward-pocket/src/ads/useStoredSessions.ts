import { useCallback, useEffect, useRef, useState } from 'react'
import type { AdEvent, AdSession } from './session'
import { commitEvent, readSessions, STORAGE_KEY } from './storage'

type StoredState = { sessions: AdSession[] | null; error: string | null; failedEvent?: AdEvent }
const readError = '참여 기록을 읽지 못했어요. 브라우저 저장소 접근과 저장 데이터 형식을 확인한 뒤 다시 시도해 주세요. 기존 기록은 덮어쓰지 않습니다.'

function load(): StoredState {
  try { return { sessions: readSessions(window.localStorage), error: null } }
  catch { return { sessions: null, error: readError } }
}

export function useStoredSessions() {
  const [state, setState] = useState<StoredState>(load)
  const [saving, setSaving] = useState(false)
  const inFlight = useRef(false)

  const refresh = useCallback(() => {
    const loaded = load()
    setState(current => ({
      sessions: loaded.sessions ?? current.sessions,
      error: current.failedEvent ? current.error : loaded.error,
      failedEvent: current.failedEvent,
    }))
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) refresh()
    }
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  const send = useCallback(async (event: AdEvent) => {
    if (inFlight.current) return
    inFlight.current = true
    setSaving(true)
    try {
      if (!navigator.locks) throw new Error('Web Locks unavailable')
      const result = await navigator.locks.request(STORAGE_KEY, () => commitEvent(window.localStorage, event))
      setState({ sessions: result.sessions, error: null })
      return result
    } catch {
      setState(current => ({ ...current, failedEvent: event,
        error: '변경 내용을 저장하지 못했어요. 포인트는 저장 성공 후 반영됩니다. 저장 공간·접근 권한을 확인하고 HTTPS 또는 localhost의 최신 브라우저에서 다시 시도해 주세요.',
      }))
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }, [])

  const retry = () => state.failedEvent ? void send(state.failedEvent) : refresh()
  return { ...state, saving, send, retry, refresh }
}
