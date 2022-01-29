import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AnimateSharedLayout, AnimatePresence } from "framer-motion"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AnimatePresence>
      <Component {...pageProps} />
    </AnimatePresence>
  )
}

export default MyApp
