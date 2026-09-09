'use client'

import Image from 'next/image'
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'

type FlightScrollSectionProps = {
  children: ReactNode
  id?: string
  nextBackground?: string
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function easeBetween(value: number, start: number, end: number) {
  const t = clamp((value - start) / (end - start))

  return t * t * (3 - 2 * t)
}

function Cloud({
  className,
  style,
  mirrored = false,
}: {
  className: string
  style?: CSSProperties
  mirrored?: boolean
}) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <Image
        src="/assets/flight-cloud.png"
        alt=""
        width={1536}
        height={1024}
        sizes="(max-width: 767px) 100vw, 900px"
        loading="eager"
        draggable={false}
        className={`block h-auto w-full select-none ${
          mirrored ? '-scale-x-100' : ''
        }`}
      />
    </div>
  )
}

export function FlightScrollSection({
  children,
  id = 'boldtrip-flight',
  nextBackground = '#17082f',
}: FlightScrollSectionProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const runwayRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const runway = runwayRef.current
    const stage = stageRef.current
    const next = nextRef.current

    if (!host || !runway || !stage || !next) return

    const motionQuery = window.matchMedia(
      '(prefers-reduced-motion: no-preference) and (min-height: 540px)',
    )

    const previousValues = new Map<string, string>()

    let enabled = false
    let nearby = true
    let frame = 0
    let lastProgress = -1

    let width = 1
    let height = 1
    let scrollDistance = 1

    const apply = (values: Record<string, number | string>) => {
      for (const [key, rawValue] of Object.entries(values)) {
        const value = String(rawValue)

        if (previousValues.get(key) === value) continue

        host.style.setProperty(key, value)
        previousValues.set(key, value)
      }
    }

    const draw = () => {
      frame = 0

      if (!enabled) return

      const progress = clamp(
        -runway.getBoundingClientRect().top / scrollDistance,
      )

      if (Math.abs(progress - lastProgress) < 0.0001) return

      lastProgress = progress

      // Beat 1: clouds and mist enter from both sides.
      const gather = easeBetween(progress, 0.025, 0.27)

      // Beat 2: the plane travels through the cloud corridor.
      const flight = easeBetween(progress, 0.27, 0.79)
      const flightArc = Math.sin(flight * Math.PI)

      // Foreground clouds separate as the plane approaches.
      const open = easeBetween(progress, 0.43, 0.76)

      // Beat 3: a final veil of mist bridges into the next section.
      const washIn = easeBetween(progress, 0.69, 0.84)
      const washOut = easeBetween(progress, 0.85, 1)

      const reveal = easeBetween(progress, 0.78, 1)
      const sceneExit = easeBetween(progress, 0.83, 1)

      const planeOpacity =
        easeBetween(progress, 0.255, 0.35) *
        (1 - easeBetween(progress, 0.745, 0.83))

      const planeX = width * (-0.95 + flight * 2.05)
      const planeY =
        height * (0.25 - flight * 0.56 - flightArc * 0.06)

      const planeScale =
        0.38 +
        flightArc * 0.91 +
        easeBetween(flight, 0.55, 1) * 0.15

      const mistOpacity =
        gather *
        (1 - easeBetween(progress, 0.44, 0.73)) *
        0.7

      const letterbox =
        easeBetween(progress, 0, 0.13) *
        (1 - easeBetween(progress, 0.78, 0.98))

      apply({
        '--flight-progress': progress.toFixed(4),
        '--scene-opacity': (1 - sceneExit).toFixed(4),
        '--next-opacity': reveal.toFixed(4),

        '--intro-opacity': (
          1 - easeBetween(progress, 0.18, 0.35)
        ).toFixed(4),
        '--intro-y': `${
          -easeBetween(progress, 0.12, 0.35) * 28
        }px`,

        '--closing-opacity': (
          easeBetween(progress, 0.64, 0.73) *
          (1 - easeBetween(progress, 0.8, 0.92))
        ).toFixed(4),

        '--sky-light': (
          0.1 + easeBetween(progress, 0.4, 0.79) * 0.75
        ).toFixed(4),

        '--bars-scale': letterbox.toFixed(4),

        '--plane-x': `${planeX.toFixed(2)}px`,
        '--plane-y': `${planeY.toFixed(2)}px`,
        '--plane-opacity': planeOpacity.toFixed(4),
        '--plane-scale': planeScale.toFixed(4),
        '--plane-bank': `${(-12 + flightArc * 25).toFixed(2)}deg`,
        '--plane-turn': `${(-18 + flight * 36).toFixed(2)}deg`,

        '--back-left-x': `${
          width * (-0.32 + gather * 0.29 - flight * 0.12)
        }px`,
        '--back-right-x': `${
          width * (0.32 - gather * 0.29 + flight * 0.12)
        }px`,
        '--back-y': `${-flight * height * 0.08}px`,

        '--front-left-x': `${
          width * (-0.72 + gather * 0.76 - open * 0.82)
        }px`,
        '--front-right-x': `${
          width * (0.72 - gather * 0.76 + open * 0.82)
        }px`,
        '--front-y': `${open * height * 0.09}px`,
        '--front-scale': (0.86 + gather * 0.24 + open * 0.2)
          .toFixed(4),

        '--mist-left-x': `${-72 + gather * 75 - open * 65}%`,
        '--mist-right-x': `${72 - gather * 75 + open * 65}%`,
        '--mist-opacity': mistOpacity.toFixed(4),

        '--wash-opacity': (
          washIn *
          (1 - washOut) *
          0.9
        ).toFixed(4),
        '--wash-y': `${(1 - washIn) * 32}%`,

        '--flare-opacity': (
          flightArc *
          planeOpacity *
          0.5
        ).toFixed(4),
      })

      // Invisible next-section controls must not receive keyboard focus.
      next.inert = progress < 0.78
    }

    const measure = () => {
      if (!enabled) return

      width = stage.clientWidth
      height = stage.clientHeight
      scrollDistance = Math.max(1, runway.offsetHeight - height)
      lastProgress = -1

      draw()
    }

    const schedule = () => {
      if (!enabled || !nearby || frame || document.hidden) return

      frame = window.requestAnimationFrame(draw)
    }

    const syncMotion = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      enabled = motionQuery.matches

      if (enabled) {
        host.dataset.motion = 'on'
        measure()
      } else {
        delete host.dataset.motion

        for (const key of previousValues.keys()) {
          host.style.removeProperty(key)
        }

        previousValues.clear()
        lastProgress = -1
        next.inert = false
      }
    }

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              nearby = Boolean(entry?.isIntersecting)

              window.cancelAnimationFrame(frame)
              frame = 0

              /*
               * Also settle the final state after large scroll jumps
               * or anchor navigation past the scene.
               */
              draw()
            },
            { rootMargin: '200px 0px' },
          )
        : null

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(measure)
        : null

    const onVisibilityChange = () => {
      if (!document.hidden) measure()
    }

    syncMotion()

    observer?.observe(runway)
    resizeObserver?.observe(runway)
    resizeObserver?.observe(stage)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', syncMotion)

    return () => {
      window.cancelAnimationFrame(frame)

      observer?.disconnect()
      resizeObserver?.disconnect()

      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange,
      )
      motionQuery.removeEventListener('change', syncMotion)

      delete host.dataset.motion
      next.inert = false

      for (const key of previousValues.keys()) {
        host.style.removeProperty(key)
      }
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="group/film relative isolate"
      style={{ backgroundColor: nextBackground }}
    >
      <section
        ref={runwayRef}
        id={id}
        aria-labelledby={`${id}-heading`}
        className="relative z-0 group-data-[motion=on]/film:h-[280svh] md:group-data-[motion=on]/film:h-[320svh]"
      >
        <div
          ref={stageRef}
          className="relative h-[100svh] min-h-[36rem] overflow-hidden text-white group-data-[motion=on]/film:sticky group-data-[motion=on]/film:top-0 group-data-[motion=on]/film:min-h-0"
        >
          <div
            className="absolute inset-0"
            style={{ opacity: 'var(--scene-opacity, 1)' }}
          >
            {/* Night-to-dawn sky. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_62%_45%,#66508a_0%,#302244_40%,#110c20_85%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_38%,#ffe4bb_0%,#a998c6_27%,#5b477d_53%,#1c102e_88%)]"
              style={{ opacity: 'var(--sky-light, 0.4)' }}
            />

            {/* Static atmospheric lighting: no animated blur filters. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-[20%] left-[48%] h-[125%] w-[20%] -rotate-[27deg] bg-[linear-gradient(90deg,transparent,rgba(255,232,195,0.1),transparent)]"
            />

            {/* Opening text leaves the frame before the fly-through. */}
            <div
              className="pointer-events-none absolute inset-x-6 top-[26%] z-40 text-center"
              style={{
                opacity: 'var(--intro-opacity, 1)',
                transform:
                  'translate3d(0, var(--intro-y, 0px), 0)',
              }}
            >
              <p className="mb-4 text-[10px] font-semibold tracking-[0.35em] text-[#ead9b9] sm:text-xs">
                BOLDTRIP — YOUR NEXT CHAPTER
              </p>

              <h2
                id={`${id}-heading`}
                className="text-[clamp(2.2rem,6vw,5.6rem)] font-black leading-[1.35] text-white"
              >
                از میان ابرها،
                <span className="block text-[#ffe3a2]">
                  به سمت یک شروع تازه.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-white/80 sm:text-base">
                گاهی برای دیدن مسیر بعدی، باید کمی جلوتر رفت.
              </p>
            </div>

            {/* The flight world has three depth layers. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 select-none [perspective:1100px]"
            >
              {/* Far clouds: slow entrance, small displacement. */}
              <Cloud
                className="-left-[30%] top-[24%] z-10 w-[120%] opacity-65 md:-left-[20%] md:top-[16%] md:w-[85%]"
                style={{
                  transform:
                    'translate3d(var(--back-left-x, -6vw), var(--back-y, 0px), 0)',
                }}
              />

              <Cloud
                mirrored
                className="-right-[30%] top-[38%] z-10 w-[120%] opacity-65 md:-right-[20%] md:top-[29%] md:w-[85%]"
                style={{
                  transform:
                    'translate3d(var(--back-right-x, 6vw), var(--back-y, 0px), 0)',
                }}
              />

              {/* A restrained anamorphic light streak. */}
              <div
                className="absolute top-[51%] left-[8%] z-10 h-px w-[84%] bg-linear-to-r from-transparent via-[#fff0cb] to-transparent"
                style={{
                  opacity: 'var(--flare-opacity, 0)',
                }}
              />

              {/* Plane: behind the near clouds, in front of far clouds. */}
              <div
                className="absolute top-[61%] left-1/2 z-20 w-[min(90vw,78svh,760px)]"
                style={{
                  opacity: 'var(--plane-opacity, 1)',
                  transform: [
                    'translate3d(',
                    'calc(-50% + var(--plane-x, 0px)),',
                    'calc(-50% + var(--plane-y, 0px)),',
                    '0)',
                    'scale(var(--plane-scale, 0.88))',
                    'rotateX(8deg)',
                    'rotateY(var(--plane-turn, -5deg))',
                    'rotateZ(var(--plane-bank, -6deg))',
                  ].join(' '),
                  transformOrigin: '50% 50%',
                }}
              >
                <Image
                  src="/assets/flight-plane.png"
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 767px) 90vw, 760px"
                  loading="eager"
                  draggable={false}
                  className="block h-auto w-full"
                />
              </div>

              {/* Near clouds close across the center, then separate. */}
              <Cloud
                className="-left-[42%] top-[29%] z-30 w-[145%] md:-left-[35%] md:top-[13%] md:w-[110%]"
                style={{
                  transform:
                    'translate3d(var(--front-left-x, -26vw), var(--front-y, 0px), 0) scale(var(--front-scale, 1))',
                }}
              />

              <Cloud
                mirrored
                className="-right-[42%] top-[39%] z-30 w-[145%] md:-right-[35%] md:top-[27%] md:w-[110%]"
                style={{
                  transform:
                    'translate3d(var(--front-right-x, 26vw), var(--front-y, 0px), 0) scale(var(--front-scale, 1))',
                }}
              />

              {/* Left-to-center mist curtain. */}
              <div
                className="absolute -left-[25%] top-[15%] z-30 h-[82%] w-[105%] bg-[radial-gradient(ellipse_at_65%_50%,rgba(244,236,252,0.95)_0%,rgba(221,211,237,0.55)_32%,transparent_70%)]"
                style={{
                  opacity: 'var(--mist-opacity, 0)',
                  transform:
                    'translate3d(var(--mist-left-x, -70%), 0, 0)',
                }}
              />

              {/* Right-to-center mist curtain. */}
              <div
                className="absolute -right-[25%] top-[24%] z-30 h-[82%] w-[105%] bg-[radial-gradient(ellipse_at_35%_50%,rgba(244,236,252,0.95)_0%,rgba(221,211,237,0.55)_32%,transparent_70%)]"
                style={{
                  opacity: 'var(--mist-opacity, 0)',
                  transform:
                    'translate3d(var(--mist-right-x, 70%), 0, 0)',
                }}
              />

              {/* Final mist wash softens the handoff to real content. */}
              <div
                className="absolute -inset-x-[15%] -bottom-[15%] z-30 h-[115%] bg-[radial-gradient(ellipse_at_50%_65%,rgba(237,225,247,0.95)_0%,rgba(192,169,216,0.65)_35%,transparent_72%)]"
                style={{
                  opacity: 'var(--wash-opacity, 0)',
                  transform:
                    'translate3d(0, var(--wash-y, 30%), 0)',
                }}
              />
            </div>

            {/* Cinematic vignette. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-35 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,5,19,0.28)_73%,rgba(9,5,19,0.8)_100%)]"
            />

            {/* Static fine texture, avoiding a live noise filter. */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-35 h-full w-full opacity-[0.075]"
            >
              <defs>
                <pattern
                  id={`${id}-texture`}
                  x="0"
                  y="0"
                  width="53"
                  height="47"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="3" cy="8" r="0.6" fill="white" />
                  <circle cx="18" cy="31" r="0.5" fill="white" />
                  <circle cx="39" cy="13" r="0.7" fill="white" />
                  <circle cx="47" cy="41" r="0.5" fill="white" />
                  <circle cx="27" cy="44" r="0.6" fill="black" />
                  <circle cx="13" cy="19" r="0.5" fill="black" />
                </pattern>
              </defs>

              <rect
                width="100%"
                height="100%"
                fill={`url(#${id}-texture)`}
              />
            </svg>

            {/* Closing caption appears once the plane clears the scene. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-[32%] z-40 text-center"
              style={{
                opacity: 'var(--closing-opacity, 0)',
              }}
            >
              <p className="text-xs font-bold text-[#ffe3a2] sm:text-sm">
                آن‌سوی تردید، یک مسیر تازه هست.
              </p>

              <p className="mt-4 text-[clamp(2.3rem,6vw,5rem)] font-black leading-[1.4] text-white">
                حالا، نوبتِ توست.
              </p>
            </div>

            {/* Scroll-controlled cinema bars. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[6svh] max-h-16 origin-top bg-[#08060e]"
              style={{
                transform: 'scaleY(var(--bars-scale, 0.5))',
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[6svh] max-h-16 origin-bottom bg-[#08060e]"
              style={{
                transform: 'scaleY(var(--bars-scale, 0.5))',
              }}
            />

            {/* Controls remain above the visual effects. */}
            <div className="absolute inset-x-6 top-28 z-50 flex items-center justify-between gap-4 sm:inset-x-10 sm:top-32">
              <span
                dir="ltr"
                className="text-[10px] font-medium tracking-[0.24em] text-white/75 sm:text-xs"
              >
                A BOLDTRIP JOURNEY
              </span>

              <a
                href={`#${id}-next`}
                onClick={(event) => {
                  const next = nextRef.current

                  if (!next) return

                  event.preventDefault()

                  next.inert = false
                  hostRef.current?.style.setProperty(
                    '--next-opacity',
                    '1',
                  )

                  next.scrollIntoView({
                    behavior: 'instant',
                    block: 'start',
                  })

                  next.focus({ preventScroll: true })
                }}
                className="rounded-full border border-white/25 bg-black/20 px-4 py-2 text-xs text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                ادامه صفحه ↓
              </a>
            </div>

            <div className="pointer-events-none absolute inset-x-6 bottom-[10%] z-40 text-center">
              <p className="hidden text-xs font-medium text-white/80 group-data-[motion=on]/film:block">
                آرام اسکرول کن؛ پرواز با حرکت تو پیش می‌رود.
              </p>

              <div
                aria-hidden="true"
                className="mx-auto mt-4 hidden h-px w-28 overflow-hidden bg-white/20 group-data-[motion=on]/film:block"
              >
                <div
                  className="h-full origin-right bg-[#ffe3a2]"
                  style={{
                    transform:
                      'scaleX(var(--flight-progress, 0))',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
       * The next real section overlaps the last screen of the runway.
       * Normal page scrolling brings it upward as the scene dissolves.
       */}
      <div
        ref={nextRef}
        id={`${id}-next`}
        tabIndex={-1}
        className="relative z-20 flow-root scroll-mt-24 outline-none group-data-[motion=on]/film:-mt-[100svh]"
        style={{
          opacity: 'var(--next-opacity, 1)',
          backgroundColor: nextBackground,
        }}
      >
        {children}
      </div>
    </div>
  )
}