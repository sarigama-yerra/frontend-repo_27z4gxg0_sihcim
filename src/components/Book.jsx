import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, Play, Pause, BookOpen } from 'lucide-react'
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
          <div className="text-6xl sm:text-7xl mb-4 drop-shadow-sm" aria-hidden>
            {page.emoji}
          </div>
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

const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

const Book = () => {
  const [index, setIndex] = useState(0)
  const [sound, setSound] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [autoRead, setAutoRead] = useState(false)
  const [rate, setRate] = useState(1)

  const containerRef = useRef(null)
  const touch = useRef({ x: 0, y: 0 })
  const utterRef = useRef(null)

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

  // Speech helpers
  const cancelSpeech = () => {
    if (!supportsSpeech()) return
    try {
      window.speechSynthesis.cancel()
    } catch {}
    utterRef.current = null
    setSpeaking(false)
  }

  const speakCurrent = () => {
    if (!supportsSpeech()) return
    cancelSpeech()
    const page = pages[index]
    const text = `${page.title}. ${page.subtitle}. ${page.description}`
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = rate
    utter.onend = () => {
      setSpeaking(false)
      // advance to next if autoRead enabled
      if (autoRead) {
        if (index < pages.length - 1) {
          setIndex(i => i + 1)
        } else {
          setAutoRead(false)
        }
      }
    }
    utter.onerror = () => setSpeaking(false)
    utterRef.current = utter
    setSpeaking(true)
    try {
      window.speechSynthesis.speak(utter)
    } catch {
      setSpeaking(false)
    }
  }

  // If page changes while auto-reading, start the next page
  useEffect(() => {
    if (autoRead) {
      // small delay to allow animation to settle
      const t = setTimeout(() => speakCurrent(), 350)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoRead])

  // Stop speech when unmounting
  useEffect(() => {
    return () => cancelSpeech()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTogglePlay = () => {
    if (!supportsSpeech()) return
    if (speaking) {
      cancelSpeech()
    } else {
      speakCurrent()
    }
  }

  const onToggleAutoRead = () => {
    if (!supportsSpeech()) return
    const nextState = !autoRead
    setAutoRead(nextState)
    if (nextState) {
      // start from current page
      speakCurrent()
    } else {
      cancelSpeech()
    }
  }

  return (
    <section className="relative py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSound(s => !s)}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full bg-white px-3 py-1.5 shadow hover:shadow-md transition"
            >
              {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {sound ? 'Flip sound on' : 'Flip sound off'}
            </button>

            {supportsSpeech() && (
              <>
                <button
                  onClick={onTogglePlay}
                  className="inline-flex items-center gap-2 text-sm font-medium rounded-full bg-white px-3 py-1.5 shadow hover:shadow-md transition"
                >
                  {speaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {speaking ? 'Pause voice' : 'Read page'}
                </button>
                <button
                  onClick={onToggleAutoRead}
                  className={`inline-flex items-center gap-2 text-sm font-medium rounded-full px-3 py-1.5 shadow hover:shadow-md transition ${autoRead ? 'bg-sky-600 text-white' : 'bg-white'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  {autoRead ? 'Auto-read on' : 'Read all'}
                </button>
                <div className="flex items-center gap-2 text-sm bg-white rounded-full px-3 py-1.5 shadow">
                  <span className="text-slate-600">Rate</span>
                  <input
                    type="range"
                    min="0.8"
                    max="1.4"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="accent-sky-600"
                    aria-label="Voice rate"
                  />
                </div>
              </>
            )}

            {!supportsSpeech() && (
              <div className="text-sm text-slate-500">
                Voice over not supported in this browser
              </div>
            )}
          </div>
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
