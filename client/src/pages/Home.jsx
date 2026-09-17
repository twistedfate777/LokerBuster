import Faq from '@/components/Faq'
import Hero from '@/components/Hero'
import ScanNow from '@/components/ScanNow'
import Works from '@/components/Works'

import React from 'react'

function Home() {
  return (
    <div className="overflow-hidden ">
      <Hero/>
      <Works/>
      <Faq/>
      <ScanNow/>
    </div>
  )
}

export default Home