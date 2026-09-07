import { useEffect, useRef, useState } from 'react'
import type { AdEvent, AdSession } from '../ads/session'
import type { CommitResult } from '../ads/storage'
import { makeMessage, parseMessage, rejectionReason } from './protocol'
import type { BridgeBody } from './protocol'

export function useAppBridge(sessionId: string | null, session: AdSession, blocked: boolean, storageError: boolean,
  persist: (event: AdEvent) => Promise<CommitResult | undefined>, refresh: () => void) {
  const [readyId] = useState(() => crypto.randomUUID())
  const [connected, setConnected] = useState(false)
  const [notice, setNotice] = useState('앱 연결을 기다리고 있어요.')
  const current = useRef({ session, storageError, persist, refresh })
  current.current = { session, storageError, persist, refresh }
  const announced = useRef('')

  useEffect(() => {
    if (!sessionId || window.parent === window) return
    let active = true
    let linked = false
    let queue = Promise.resolve()
    const seen = new Set<string>()
    const post = (body: BridgeBody) => window.parent.postMessage(makeMessage(sessionId, body), window.location.origin)
    const receive = (event: MessageEvent) => {
      // Untrusted windows are not entitled to a response.
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const m = parseMessage(event.data)
      if (!m || !m.type.startsWith('host.')) return
      queue = queue.then(async () => {
        if (!active) return
        const receipt = (status: 'applied' | 'ignored' | 'error', detail: string) => {
          if (active) { post({ type: 'web.receipt', replyTo: m.id, status, detail }); setNotice(detail) }
        }
        const reason = rejectionReason(m, true, true, sessionId, current.current.session.requestId, seen)
        if (reason) { receipt('ignored', reason); return }
        if (m.type === 'host.connected') {
          linked = true; setConnected(true); seen.add(m.id); receipt('applied', '앱 브릿지 연결 완료'); return
        }
        if (!linked) { receipt('ignored', '종료된 연결'); return }
        if (m.type === 'host.disconnect') {
          linked = false; setConnected(false); seen.add(m.id); receipt('applied', '앱 연결이 종료됐어요. 기록은 유지됩니다.'); return
        }
        if (m.type === 'host.resume') {
          current.current.refresh(); seen.add(m.id); receipt('applied', '앱 복귀: 저장 기록 재조회'); return
        }
        if (m.type !== 'host.ad.result' && m.type !== 'host.reward.grant') return
        if (current.current.storageError) { receipt('error', '저장소 확인 또는 재시도가 필요해요.'); return }
        const action: AdEvent = { type: m.type === 'host.ad.result' ? m.result : 'grant', requestId: m.requestId }
        try {
          const result = await current.current.persist(action)
          if (!active) return
          if (!result) { receipt('error', '저장 실패: 웹 화면에서 재시도해 주세요.'); return }
          seen.add(m.id)
          if (!result.applied) { receipt('ignored', '이미 종료됐거나 현재 상태에서 처리할 수 없는 응답'); return }
          receipt('applied', action.type === 'grant' ? '모의 지급 기록 저장 완료' : '광고 결과 저장 완료')
        } catch { receipt('error', '저장 기록을 읽지 못했어요.'); current.current.refresh() }
      })
    }
    window.addEventListener('message', receive)
    window.parent.postMessage({ ...makeMessage(sessionId, { type: 'web.ready' }), id: readyId }, window.location.origin)
    return () => { active = false; window.removeEventListener('message', receive) }
  }, [sessionId, readyId])

  useEffect(() => {
    if (!sessionId || !connected || blocked || session.automatic || !session.requestId) return
    if (session.ad !== 'playing' && session.reward !== 'pending') return
    if (announced.current !== session.requestId) {
      announced.current = session.requestId
      window.parent.postMessage(makeMessage(sessionId, { type: 'web.ad.request', requestId: session.requestId }), window.location.origin)
      setNotice('광고 요청을 앱에 보냈어요. 앱 패널에서 응답을 보내 주세요.')
    }
    if (session.ad !== 'playing') return
    const timer = window.setTimeout(() => {
      void persist({ type: 'timeout', requestId: session.requestId })
      setNotice('8초 동안 완료 응답이 없어 광고 대기를 종료했어요. 보상은 별도로 확인합니다.')
    }, Math.max(0, Math.min(8000, session.startedAt + 8000 - Date.now())))
    return () => window.clearTimeout(timer)
  }, [sessionId, connected, session, blocked, persist])

  return { connected, notice }
}
