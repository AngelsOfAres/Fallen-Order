import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider, useInitializeProviders, PROVIDER_ID } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import Toaster from 'components/Toaster'
import { NODE_NETWORK, NODE_PORT, NODE_TOKEN, NODE_URL } from 'constants/env'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import 'styles/globals.css'
import "@fontsource/orbitron"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const walletProviders = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
      { id: PROVIDER_ID.EXODUS }
    ],
    nodeConfig: {
      network: NODE_NETWORK,
      nodeServer: NODE_URL,
      nodePort: NODE_PORT,
      nodeToken: NODE_TOKEN
    },
    algosdkStatic: algosdk,
    debug: true
  })

  const theme = extendTheme({
    styles: {
      global: (props: any) => ({
        'body': {
          background: props.colorMode === 'dark' ? 'black' : 'black',
        }
      }),
    },
  });

  return (
    <>
      <ChakraProvider theme={theme}>
      <WalletProvider value={walletProviders}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster />
        </QueryClientProvider>
      </WalletProvider>
      </ChakraProvider>
    </>
  )
}
