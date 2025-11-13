import React from 'react'
import Spline from '@splinetool/react-spline'

const Hero = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/XuAg4PYWfzmy0iW1/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
      <div className="pointer-events-none absolute -inset-x-10 top-0 h-40 bg-gradient-to-b from-[#ff2d55]/40 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -inset-x-10 bottom-0 h-40 bg-gradient-to-t from-sky-500/40 to-transparent blur-3xl opacity-70" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-fuchsia-500 to-sky-500">
            Animal Story Flip Book
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base max-w-xl text-slate-700">
            A colorful, playful, and modern tale brought to life with a vibrant 3D hero and interactive page flips.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
