import { Navbar, Sidebar } from "@/components/navbar";
import "@/styles/globals.css";

import { configureChains, WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export default function App({ Component, pageProps }) {
    const hyperspace = {
        id: 3_141,
        name: "Hyperspace",
        network: "Hyperspace",
        nativeCurrency: {
            decimals: 18,
            name: "Filecoin",
            symbol: "tFIL",
        },
        rpcUrls: {
            default: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v0",
        },
    };

    const { chains, provider } = configureChains(
        [hyperspace, polygonMumbai],
        [
            jsonRpcProvider({
                rpc: (chain) => ({
                    http: `https://filecoin-hyperspace.chainstacklabs.com/rpc/v0`,
                }),
            }),
        ]
    );

    const client = createClient({
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({ chains }),
            new CoinbaseWalletConnector({
                chains,
                options: {
                    appName: "ThePeerDao",
                },
            }),
            // new WalletConnectConnector({
            //   chains,
            //   options: {
            //     qrcode: true,
            //   },
            // }),
        ],
        provider,
    });

    return (
        <div>
            <WagmiConfig client={client}>
                <ConnectKitProvider debugMode>
                    <div>
                        {/* <Navbar /> */}
                        <Component {...pageProps} />
                    </div>
                </ConnectKitProvider>
            </WagmiConfig>
        </div>
    );
}
