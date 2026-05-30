import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ─── Floating petals background ──────────────────────────────────────────────
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  emoji: ['🌸', '🌷', '✿', '❀'][i % 4],
  style: {
    left: `${(i * 7.3) % 100}%`,
    top: `${(i * 11.9) % 100}%`,
    fontSize: `${14 + (i % 4) * 6}px`,
  },
  dur: 4 + (i % 4),
  delay: (i % 5) * 0.7,
}))

function FloatingPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PETALS.map(p => (
        <motion.span
          key={p.id}
          className="absolute select-none opacity-[0.18]"
          style={p.style}
          animate={{ y: [-12, 12, -12], rotate: [-6, 6, -6], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-nude/40">
      <motion.div
        className="h-full bg-gradient-to-r from-blush via-rose to-warm rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}

// ─── Music toggle ────────────────────────────────────────────────────────────
// Uses a free royalty-free piano loop hosted on Pixabay (no account needed)
const MUSIC_URL = 'https://www.bensound.com/bensound-music/bensound-romantic.mp3'

function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL)
      audioRef.current.loop = true
      audioRef.current.volume = 0.25
    }
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setPlaying(p => !p)
  }, [playing])

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-white/80 backdrop-blur border border-nude/60 shadow-md flex items-center justify-center text-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={playing ? 'Pause music' : 'Play music'}
    >
      {playing ? '🔊' : '🔇'}
    </motion.button>
  )
}

// ─── Page 1: Welcome ──────────────────────────────────────────────────────────
function WelcomePage({ onYes }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [noCount, setNoCount] = useState(0)
  const noBtnRef = useRef(null)

  const noPhrases = [
    'No', 'Nope 🙅', 'Try again', 'Still no 😂', 'Not a chance', "FINE… just kidding 😏",
  ]

  const dodge = useCallback(() => {
    setNoCount(c => c + 1)
    const vw = window.innerWidth
    const vh = window.innerHeight
    const maxX = Math.min(vw * 0.35, 180)
    const maxY = Math.min(vh * 0.28, 140)
    setNoPos({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2,
    })
  }, [])

  const label = noPhrases[Math.min(noCount, noPhrases.length - 1)]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <FloatingPetals />
      <div className="absolute top-16 right-8 w-52 h-52 rounded-full bg-blush/25 blur-3xl" />
      <div className="absolute bottom-16 left-8 w-64 h-64 rounded-full bg-petal/40 blur-3xl" />

      <motion.div
        className="relative z-10 text-center max-w-sm w-full"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated envelope */}
        <motion.div
          className="text-7xl mb-8 select-none"
          animate={{ scale: [1, 1.09, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          💌
        </motion.div>

        <motion.h1
          className="font-display text-[2.6rem] md:text-5xl text-espresso font-light leading-tight mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Will you go on a
          <br />
          <em className="text-rose not-italic">date</em> with me?
        </motion.h1>

        <motion.div
          className="h-px w-20 bg-gradient-to-r from-transparent via-rose to-transparent mx-auto mb-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        />

        <motion.p
          className="text-warm font-body text-sm tracking-[0.2em] uppercase mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          I promise it'll be worth it ✨
        </motion.p>

        {/* Buttons */}
        <div className="flex gap-5 justify-center items-center">
          <motion.button
            onClick={onYes}
            className="px-10 py-3.5 bg-espresso text-cream font-body text-sm tracking-[0.18em] uppercase rounded-full shadow-lg"
            whileHover={{ scale: 1.06, backgroundColor: '#3a2616' }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85 }}
          >
            Yes 🩷
          </motion.button>

          <motion.button
            ref={noBtnRef}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            onClick={dodge}
            className="px-8 py-3.5 border border-nude text-warm font-body text-sm tracking-[0.18em] uppercase rounded-full select-none cursor-pointer"
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            {label}
          </motion.button>
        </div>

        <AnimatePresence>
          {noCount > 2 && (
            <motion.p
              className="text-warm/55 text-xs font-body italic mt-7"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              that button has a mind of its own 😏
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── Page 2: Pick a date & time ───────────────────────────────────────────────
const TIMES = [
  { value: '5:00 PM', label: '5 PM', sub: 'we eating with the retirees 👴' },
  { value: '6:00 PM', label: '6 PM', sub: 'this is the right answer tbh ✨' },
  { value: '7:00 PM', label: '7 PM', sub: "you're making me hungry already 😅" },
  { value: '8:00 PM', label: '8 PM', sub: 'dinner or breakfast at this point?' },
  { value: '9:00 PM', label: '9 PM', sub: 'this is supper already 😂' },
]

function DatePage({ booking, setBooking, onNext }) {
  const today = new Date().toISOString().split('T')[0]
  const canContinue = booking.date && booking.time

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-20 overflow-hidden">
      <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-petal/50 blur-3xl" />
      <div className="absolute bottom-10 right-8 w-64 h-64 rounded-full bg-blush/25 blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-warm font-body text-xs tracking-[0.2em] uppercase mb-3">Step 1 of 3</p>
          <h2 className="font-display text-[2.4rem] md:text-5xl text-espresso font-light italic leading-tight">
            so… when are you free?
          </h2>
          <div className="h-px w-14 bg-rose mx-auto mt-5" />
        </div>

        {/* Date picker */}
        <div className="mb-8">
          <label className="block text-espresso/65 font-body text-xs tracking-[0.18em] uppercase mb-3 font-medium">
            📅 Pick a Day
          </label>
          <input
            type="date"
            min={today}
            value={booking.date}
            onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}
            className="w-full bg-white/75 backdrop-blur-sm border border-nude/70 text-espresso font-body text-base px-5 py-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose/50 transition-all cursor-pointer"
          />
        </div>

        {/* Time picker */}
        <div className="mb-10">
          <label className="block text-espresso/65 font-body text-xs tracking-[0.18em] uppercase mb-3 font-medium">
            🕒 What time?
          </label>
          <div className="space-y-2.5">
            {TIMES.map((t, i) => {
              const active = booking.time === t.value
              return (
                <motion.button
                  key={t.value}
                  onClick={() => setBooking(b => ({ ...b, time: t.value }))}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border flex items-center justify-between transition-all font-body ${
                    active
                      ? 'bg-espresso text-cream border-espresso shadow-md'
                      : 'bg-white/75 text-espresso border-nude/70 hover:border-rose/50 hover:bg-petal/40'
                  }`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-semibold text-sm tracking-wide">{t.label}</span>
                  <span className={`text-xs italic ${active ? 'text-cream/70' : 'text-warm'}`}>{t.sub}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full py-4 rounded-full font-body text-sm tracking-[0.18em] uppercase bg-espresso text-cream shadow-lg transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
          whileHover={{ scale: canContinue ? 1.02 : 1 }}
          whileTap={{ scale: 0.97 }}
        >
          Next →
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Page 3: Food preferences ─────────────────────────────────────────────────
const CUISINES = [
  { id: 'japanese', label: 'Japanese', icon: '🍣' },
  { id: 'korean',   label: 'Korean',   icon: '🍗' },
  { id: 'italian',  label: 'Italian',  icon: '🍝' },
  { id: 'steak',    label: 'Steak',    icon: '🥩' },
  { id: 'cafe',     label: 'Cafe & Dessert', icon: '☕' },
  { id: 'chinese',  label: 'Chinese',  icon: '🥟' },
  { id: 'surprise', label: 'Surprise Me', icon: '🎲', wide: true },
]

function FoodPage({ booking, setBooking, onNext }) {
  const selected = booking.foods || []

  const toggle = id =>
    setBooking(b => {
      const cur = b.foods || []
      return { ...b, foods: cur.includes(id) ? cur.filter(f => f !== id) : [...cur, id] }
    })

  const canContinue = selected.length > 0

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blush/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-petal/35 blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-10">
          <p className="text-warm font-body text-xs tracking-[0.2em] uppercase mb-3">Step 2 of 3</p>
          <h2 className="font-display text-[2.4rem] md:text-5xl text-espresso font-light italic leading-tight">
            What are you feeling?
          </h2>
          <p className="text-warm font-body text-sm mt-3">you can pick more than one tbh</p>
          <div className="h-px w-14 bg-rose mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {CUISINES.map((c, i) => {
            const active = selected.includes(c.id)
            return (
              <motion.button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`relative p-5 rounded-2xl border text-left transition-all font-body ${
                  c.wide ? 'col-span-2' : ''
                } ${
                  active
                    ? 'bg-espresso text-cream border-espresso shadow-lg'
                    : 'bg-white/75 text-espresso border-nude/70 hover:border-rose/50 hover:bg-petal/35'
                }`}
                initial={{ opacity: 0, scale: 0.91 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.055 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className={`text-sm font-medium ${active ? 'text-cream' : 'text-espresso'}`}>{c.label}</div>
                <AnimatePresence>
                  {active && (
                    <motion.div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full py-4 rounded-full font-body text-sm tracking-[0.18em] uppercase bg-espresso text-cream shadow-lg transition-opacity disabled:opacity-35 disabled:cursor-not-allowed"
          whileHover={{ scale: canContinue ? 1.02 : 1 }}
          whileTap={{ scale: 0.97 }}
        >
          Next →
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Final page: confirmed ────────────────────────────────────────────────────
const CUISINE_LABELS = {
  japanese: 'Japanese 🍣',
  korean:   'Korean 🍗',
  italian:  'Italian 🍝',
  steak:    'Steak 🥩',
  cafe:     'Cafe & Dessert ☕',
  chinese:  'Chinese 🥟',
  surprise: 'Surprise Me 🎲',
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function fireConfetti() {
  const colors = ['#F2C4CE', '#E8A0B0', '#EDE0D4', '#FDF8F3', '#C9A99A', '#4A3728']
  const base = { spread: 70, colors, ticks: 120 }
  confetti({ ...base, particleCount: 80, origin: { x: 0.3, y: 0.6 } })
  confetti({ ...base, particleCount: 80, origin: { x: 0.7, y: 0.6 } })
}

function ConfirmedPage({ booking }) {
  const foodList = (booking.foods || []).map(f => CUISINE_LABELS[f]).join(', ') || '—'
  const dateStr  = formatDate(booking.date)
  const timeStr  = booking.time || '—'

  const summary = `💌 It's a date!\n\n📅 ${dateStr}\n🕒 ${timeStr}\n🍴 ${foodList}\n\nSee you soon 😊`

  const [copied, setCopied] = useState(false)

  const share = () => {
    navigator.clipboard.writeText(summary).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank')
  }

  useEffect(() => {
    const t1 = setTimeout(fireConfetti, 400)
    const t2 = setTimeout(fireConfetti, 1200)
    const t3 = setTimeout(fireConfetti, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-petal/45 via-cream to-blush/20" />
      <FloatingPetals />

      <motion.div
        className="relative z-10 w-full max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="text-7xl mb-6 select-none"
          animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          💌
        </motion.div>

        <motion.h2
          className="font-display text-5xl md:text-6xl text-espresso font-light italic leading-tight"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          It's a date!
        </motion.h2>

        <motion.div
          className="h-px w-16 bg-rose mx-auto my-7"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45 }}
        />

        {/* Summary card */}
        <motion.div
          className="bg-white/82 backdrop-blur-md border border-nude/50 rounded-3xl p-7 shadow-2xl text-left mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {[
            { icon: '📅', label: 'Date',       value: dateStr },
            { icon: '🕒', label: 'Time',       value: timeStr },
            { icon: '🍴', label: 'Food Vibes', value: foodList },
          ].map((row, i) => (
            <div key={row.label}>
              {i > 0 && <div className="h-px bg-nude/40 my-4" />}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 shrink-0">{row.icon}</span>
                <div className="min-w-0">
                  <p className="text-warm font-body text-[10px] tracking-[0.2em] uppercase mb-0.5">{row.label}</p>
                  <p className="text-espresso font-body text-sm font-medium leading-snug break-words">{row.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.p
          className="font-display text-2xl text-rose italic mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          See you soon 😊
        </motion.p>

        <motion.button
          onClick={share}
          className="w-full py-4 rounded-full bg-espresso text-cream font-body text-sm tracking-[0.18em] uppercase shadow-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {copied ? '✓ Copied!' : '💬 Copy plan & text me'}
        </motion.button>

        <motion.p
          className="text-warm/50 font-body text-[11px] italic mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          copies to clipboard & opens WhatsApp
        </motion.p>
      </motion.div>
    </div>
  )
}

// ─── Page transition variants ─────────────────────────────────────────────────
const slideIn = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, x: -50, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
}

// ─── Root app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState({ date: '', time: '', foods: [] })

  const TOTAL = 3

  return (
    <div className="min-h-screen bg-cream relative">
      {step > 0 && step < TOTAL + 1 && <ProgressBar step={step} total={TOTAL} />}
      <MusicToggle />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" {...slideIn}>
            <WelcomePage onYes={() => setStep(1)} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="date" {...slideIn}>
            <DatePage booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="food" {...slideIn}>
            <FoodPage booking={booking} setBooking={setBooking} onNext={() => setStep(3)} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="confirmed" {...slideIn}>
            <ConfirmedPage booking={booking} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
