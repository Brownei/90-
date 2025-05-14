import { IProvider } from '@web3auth/base'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProviderState {
  provider: IProvider | null
  setProvider: (provider: IProvider | null) => void
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set) => ({
      provider: null,
      setProvider: (provider: IProvider | null) => set(() => ({
        provider
      }))
    }),
    { name: 'provider-store' },
  ),
)

