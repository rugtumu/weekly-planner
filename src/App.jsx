import React, { useState, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import eventsData from './events.json'

const LINKEDIN_BANNER = {
  width: 1584,
  height: 396
}

const START_HOUR = 8
const END_HOUR = 24
const SLOT_HOURS = 2
const HOUR_HEIGHT = 40
const SLOT_HEIGHT = HOUR_HEIGHT * SLOT_HOURS

export default function App() {
  const [events, setEvents] = useState([])
  const [view, setView] = useState('planner')

  const [banner, setBanner] = useState({
    name: 'Umut Gür',
    title: 'Data Scientist | AI Tutor',
    subtitle: 'Machine Learning, Market Analysis, Python',
    accent: '#f59e0b'
  })

  const plannerRef = useRef(null)
  const plannerPreviewRef = useRef(null)
  const bannerRef = useRef(null)

  useEffect(() => {
    setEvents(eventsData)
  }, [])

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
  const slotStarts = Array.from(
    { length: (END_HOUR - START_HOUR) / SLOT_HOURS },
    (_, i) => START_HOUR + i * SLOT_HOURS
  )

  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number)
    return (h - START_HOUR) * 60 + m
  }

  const getEventPosition = (startTime, endTime) => {
    const start = timeToMinutes(startTime)
    const end = timeToMinutes(endTime)
    const top = (start / 60) * HOUR_HEIGHT
    const height = ((end - start) / 60) * HOUR_HEIGHT
    return { top, height }
  }

  const downloadDataUrl = (dataUrl, fileName) => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  }

  const exportPlannerPNG = async () => {
    const html2canvas = (await import('html2canvas')).default
    const element = plannerPreviewRef.current
    if (!element) return

    if (document.fonts?.ready) {
      await document.fonts.ready
    }

    const rect = element.getBoundingClientRect()

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2,
      logging: false,
      useCORS: true,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    })

    downloadDataUrl(
      canvas.toDataURL('image/png'),
      `weekly-planner-${new Date().toISOString().split('T')[0]}.png`
    )
  }

  const exportBannerPNG = async () => {
    const html2canvas = (await import('html2canvas')).default
    const element = bannerRef.current
    if (!element) return

    const rawCanvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2,
      logging: false
    })

    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = LINKEDIN_BANNER.width
    finalCanvas.height = LINKEDIN_BANNER.height

    const ctx = finalCanvas.getContext('2d')
    // Ensure exported PNG is fully opaque to avoid white edges in some viewers.
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
    ctx.drawImage(rawCanvas, 0, 0, finalCanvas.width, finalCanvas.height)

    downloadDataUrl(
      finalCanvas.toDataURL('image/png'),
      `linkedin-banner-${new Date().toISOString().split('T')[0]}.png`
    )
  }

  const exportBannerJPG = async () => {
    const html2canvas = (await import('html2canvas')).default
    const element = bannerRef.current
    if (!element) return

    const rawCanvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2,
      logging: false
    })

    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = LINKEDIN_BANNER.width
    finalCanvas.height = LINKEDIN_BANNER.height

    const ctx = finalCanvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
    ctx.drawImage(rawCanvas, 0, 0, finalCanvas.width, finalCanvas.height)

    downloadDataUrl(
      finalCanvas.toDataURL('image/jpeg', 0.92),
      `linkedin-banner-${new Date().toISOString().split('T')[0]}.jpg`
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-3xl font-light tracking-tight">Weekly Planner + Banner Studio</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('planner')}
                className={`px-3 py-2 rounded border transition-colors ${
                  view === 'planner'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-gray-200 hover:bg-zinc-800'
                }`}
              >
                Planner
              </button>
              <button
                onClick={() => setView('banner')}
                className={`px-3 py-2 rounded border transition-colors ${
                  view === 'banner'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-gray-200 hover:bg-zinc-800'
                }`}
              >
                LinkedIn Banner
              </button>

              <button
                onClick={view === 'planner' ? exportPlannerPNG : exportBannerPNG}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors border border-zinc-700"
              >
                <Download size={18} />
                {view === 'planner' ? 'Planner PNG' : 'Banner PNG'}
              </button>
              {view === 'banner' ? (
                <button
                  onClick={exportBannerJPG}
                  className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors border border-zinc-700"
                >
                  <Download size={18} />
                  Banner JPG
                </button>
              ) : null}
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Banner export size: {LINKEDIN_BANNER.width}x{LINKEDIN_BANNER.height}px
          </p>
          <div className="h-px bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent mt-3" />
        </div>

        {view === 'planner' ? (
          <div ref={plannerPreviewRef}>
            <div ref={plannerRef} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-8 border-b border-zinc-800">
              <div className="p-4 border-r border-zinc-800">
                <span className="text-xs text-gray-600 uppercase tracking-wider">Saat</span>
              </div>
              {days.map((day) => (
                <div key={day} className="p-4 border-r border-zinc-800 last:border-r-0">
                  <span className="text-sm font-medium">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-8 relative">
              <div className="border-r border-zinc-800">
                {slotStarts.map((hour) => (
                  <div key={hour} className="border-b border-zinc-800 px-3 py-2" style={{ height: `${SLOT_HEIGHT}px` }}>
                    <span className="text-xs text-gray-600">
                      {String(hour).padStart(2, '0')}:00 - {String(hour + SLOT_HOURS).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {days.map((day) => (
                <div key={day} className="relative border-r border-zinc-800 last:border-r-0">
                  {slotStarts.map((hour) => (
                    <div key={hour} className="border-b border-zinc-800" style={{ height: `${SLOT_HEIGHT}px` }} />
                  ))}

                  <div className="absolute inset-0 pointer-events-none">
                    {events
                      .filter((event) => event.day === day)
                      .map((event) => {
                        const { top, height } = getEventPosition(event.startTime, event.endTime)
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 rounded overflow-hidden pointer-events-auto"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              backgroundColor: event.color,
                              opacity: 0.9
                            }}
                          >
                            <div className="p-2 h-full text-black overflow-hidden relative">
                              <span className="absolute top-2 left-2 right-2 text-xs font-medium leading-tight">
                                {event.name}
                              </span>
                              <span className="absolute left-2 right-2 bottom-2 text-[10px] leading-tight opacity-75">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-5 items-start">
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
              <h2 className="text-lg font-medium">Banner Settings</h2>

              <label className="block">
                <span className="text-sm text-gray-400">Name</span>
                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 outline-none focus:border-amber-500/60"
                  value={banner.name}
                  onChange={(e) => setBanner((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Title</span>
                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 outline-none focus:border-amber-500/60"
                  value={banner.title}
                  onChange={(e) => setBanner((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Subtitle</span>
                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 outline-none focus:border-amber-500/60"
                  value={banner.subtitle}
                  onChange={(e) => setBanner((prev) => ({ ...prev, subtitle: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-400">Accent Color</span>
                <input
                  type="color"
                  className="mt-1 h-10 w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1"
                  value={banner.accent}
                  onChange={(e) => setBanner((prev) => ({ ...prev, accent: e.target.value }))}
                />
              </label>

            </section>

            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-auto">
              <div
                ref={bannerRef}
                className="relative mx-auto w-full max-w-[1200px] aspect-[4/1] overflow-hidden border border-zinc-900"
                style={{
                  background:
                    'radial-gradient(circle at 10% 10%, #1f1f1f 0%, #0b0b0b 45%, #000 100%)'
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      `linear-gradient(115deg, ${banner.accent}22 0%, transparent 35%, transparent 100%)`
                  }}
                />

                <div className="relative h-full px-[6%] py-[5%] flex items-center justify-between gap-6">
                  <div className="w-[clamp(84px,11vw,148px)] h-[clamp(84px,11vw,148px)]" aria-hidden />

                  <div className="ml-auto pr-[3%] flex items-stretch gap-[clamp(10px,1.8vw,22px)]">
                    <div className="max-w-[84%] text-right self-stretch mr-[clamp(6px,1vw,12px)]">
                      <h2 className="text-[clamp(22px,3.2vw,42px)] leading-[1.08] font-semibold text-white">
                        {banner.name}
                      </h2>
                      <p className="mt-1 text-[clamp(12px,1.35vw,19px)] text-zinc-200">{banner.title}</p>
                      <p className="mt-1 text-[clamp(10px,1.05vw,14px)] text-zinc-400">{banner.subtitle}</p>
                    </div>
                    <div className="flex flex-col items-center justify-between self-stretch gap-[clamp(2px,0.5vw,6px)]">
                      <img
                        src="/image1.png"
                        alt="Logo 1"
                        className="w-[clamp(20px,2.8vw,38px)] h-[clamp(20px,2.8vw,38px)] object-contain"
                      />
                      <img
                        src="/image2.png"
                        alt="xAI logo"
                        className="w-[clamp(20px,2.8vw,38px)] h-[clamp(20px,2.8vw,38px)] object-contain"
                      />
                      <img
                        src="/image3.png"
                        alt="Boğaziçi Üniversitesi logo"
                        className="w-[clamp(20px,2.8vw,38px)] h-[clamp(20px,2.8vw,38px)] object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
