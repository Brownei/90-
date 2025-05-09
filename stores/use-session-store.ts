import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  session: string | null
  setSession: (session: string | null) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session: string | null) => set(() => ({
        session
      }))
    }),
    { name: 'session' },
  ),
)
