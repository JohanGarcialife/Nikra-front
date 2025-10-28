'use client'
import React, { useState } from 'react'
import FirstStep from './_components/FirstStep'

export default function page() {
const [activeStep, setActiveStep] = useState(0)
  return (
    <div className='w-full max-w-full min-h-screen pt-20'>
{activeStep === 0 && <FirstStep setActiveStep={setActiveStep} />}
{/* {activeStep === 0 && <FirstStep setActiveStep={setActiveStep} />}
{activeStep === 0 && <FirstStep setActiveStep={setActiveStep} />} */}
    </div>
  )
}
