import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { ritual } from './chain'

export const wagmiConfig = createConfig({
  chains: [ritual],
  connectors: [injected({ shimDisconnect: true })],
  transports: { [ritual.id]: http() },
})
