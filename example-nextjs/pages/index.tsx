import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const Videocall = dynamic(() => import('./videocall'), { ssr: false });

const Home: NextPage = () => {
  return (
    <div style={{display: 'flex', flex: 1, height: '100vh'}}>
      <Head>
        <title>Next - Agora UIKit </title>
        <meta name="description" content="Agora Web UIKit demo in Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{display: 'flex', flex: 1}}>
        <Videocall />
      </main>
    </div>
  )
}

export default Home
