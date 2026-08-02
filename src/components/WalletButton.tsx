import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { ritual } from '../lib/chain'
import { shortenAddress } from '../lib/format'

export function WalletButton() {
 const { address, isConnected, chainId } = useAccount(); const { connectors, connect, isPending } = useConnect(); const { disconnect } = useDisconnect(); const { switchChain, isPending: switching } = useSwitchChain()
 if (!isConnected) return <button className="wallet-button" onClick={() => connectors[0] && connect({ connector: connectors[0] })} disabled={isPending}>{isPending ? 'Opening wallet…' : 'Connect wallet'}</button>
 if (chainId !== ritual.id) return <button className="wallet-button wrong" onClick={() => switchChain({ chainId: ritual.id })} disabled={switching}>{switching ? 'Switching…' : 'Switch to Ritual'}</button>
 return <button className="wallet-button connected" onClick={() => disconnect()} title="Disconnect wallet"><span className="status-dot" />{shortenAddress(address)}</button>
}
