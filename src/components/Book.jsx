import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { pages } from '../animalsData'

const Page = ({ page, index, currentIndex }) => {
  const isActive = index === currentIndex
  return (
    <motion.div
      key={page.id}
      initial={{ rotateY: -180, opacity: 0 }}
      animate={{ rotateY: isActive ? 0 : -15, opacity: isActive ? 1 : 0.25 }}
      exit={{ rotateY: 180, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${page.bg}`}
    >
      <div className={`absolute inset-0 ${page.accent} p-6 sm:p-10 flex flex-col justify-between`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-white">
            <Sparkles className="w-4 h-4" />
            Page {index + 1}
          </span>
        </div>
        <div className="text-center">
          <div className="text-6xl sm:text-7xl mb-4 drop-shadow-sm">{page.emoji}</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            {page.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base opacity-90">{page.subtitle}</p>
          <p className="mt-4 text-sm sm:text-base max-w-md mx-auto opacity-90">{page.description}</p>
        </div>
        <div className="text-xs opacity-80">
          Tip: Use the arrows or swipe to flip pages
        </div>
      </div>
    </motion.div>
  )
}

const Book = () => {
  const [index, setIndex] = useState(0)
  const [sound, setSound] = useState(true)
  const containerRef = useRef(null)

  const flipSound = () => {
    if (!sound) return
    const audio = new Audio(
      'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQAA'
    )
    try { audio.play() } catch {}
  }

  const next = () => {
    if (index < pages.length - 1) {
      setIndex(i => i + 1)
      flipSound()
    }
  }
  const prev = () => {
    if (index > 0) {
      setIndex(i => i - 1)
      flipSound()
    }
  }

  // Basic swipe handling
  const touch = useRef({ x: 0, y: 0 })
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev()
    }
  }

  return (
    <section className="relative py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:shadow-md transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:shadow-md transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-sm text-slate-600 font-medium">
              {index + 1} / {pages.length}
            </div>
          </div>
          <button
            onClick={() => setSound(s => !s)}
            className="inline-flex items-center gap-2 text-sm font-medium rounded-full bg-white px-3 py-1.5 shadow hover:shadow-md transition"
          >
            {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {sound ? 'Sound on' : 'Sound off'}
          </button>
        </div>

        <div
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative h-[420px] sm:h-[520px] lg:h-[580px] rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/60 shadow-xl overflow-hidden"
          style={{ perspective: 1600 }}
        >
          <AnimatePresence mode="popLayout">
            <Page key={pages[index].id} page={pages[index]} index={index} currentIndex={index} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Book
