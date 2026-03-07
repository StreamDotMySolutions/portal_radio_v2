'use client'

import Carousel from '@/components/Carousel'
import ProgrammeBanner from '@/components/ProgrammeBanner'
import VideoGrid from '@/components/VideoGrid'

export default function Home() {
  return (
    <div>
      {/* Carousel */}
      <Carousel />

      {/* Programme Channels */}
      <ProgrammeBanner />

      {/* Video Section */}
      <div style={{ backgroundColor: '#0047ab' }} className="py-5">
        <div className="container">
          <VideoGrid />
        </div>
      </div>
    </div>
  )
}
