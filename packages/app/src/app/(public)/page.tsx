import { SigninButton } from '@/components/signin-button'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'CloudFeed',
  description:
    'CloudFeed is a simple RSS reader Powered by Cloudflare Worker AI',
}

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-xl'>CloudFeed </h1>
        <p className='mt-4'>CloudFeed is a simple RSS reader</p>
        <p className='mt-4'>The app suggest related feed entries to you.</p>
        <p className='mt-4'>Powered by Cloudflare Worker AI</p>
        <div className='mt-8'>
          <SigninButton>Get Started</SigninButton>
        </div>
      </div>
    </main>
  )
}
