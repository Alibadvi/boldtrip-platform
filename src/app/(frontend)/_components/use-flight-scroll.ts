'use client'

import { useEffect, useRef } from 'react'

type FlightLayer =
  | 'horizon'
  | 'cloudBackLeft'
  | 'cloudBackRight'
  | 'plane'
  | 'flare'
  | 'cloudFrontLeft'
  | 'cloudFrontRight'
  | 'mistLeft'
  | 'mistRight'
  | 'intro'
  | 'outro'
  | 'fade'
  | 'progress'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start))
const ease = (value: number) => value * value * (3 - 2 * value)
const mix = (start: number, end: number, progress: number) => start + (end - start) * progress

/** Native scrolling, one scheduled frame per event, and no React renders during the flight. */
export function useFlightScroll() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const layers = useRef<Partial<Record<FlightLayer, HTMLDivElement | null>>>({})
  const bind = (name: FlightLayer) => (node: HTMLDivElement | null) => {
    layers.current[name] = node
  }

  useEffect(() => {
    const section = root.current
    const viewport = stage.current
    if (!section || !viewport) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 540px)')
    const initialStyles = new Map(
      Object.values(layers.current).flatMap((node) =>
        node ? [[node, node.style.cssText] as const] : [],
      ),
    )
    let active = false
    let disposed = false
    let frame = 0
    let needsMeasure = true
    let start = 0
    let distance = 1
    let width = 1
    let height = 1
    let previous = -1

    const move = (
      name: FlightLayer,
      x: number,
      y: number,
      z: number,
      scale: number,
      opacity: number,
      rotate = '',
    ) => {
      const node = layers.current[name]
      if (!node) return
      node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) ${rotate} scale(${scale.toFixed(3)})`
      node.style.opacity = clamp(opacity).toFixed(3)
    }

    const paint = () => {
      frame = 0
      if (disposed || document.hidden || still.matches) return
      if (needsMeasure) {
        // Read geometry together; scroll frames below only write transforms and opacity.
        width = viewport.clientWidth
        height = viewport.clientHeight
        start = section.getBoundingClientRect().top + window.scrollY
        distance = Math.max(1, section.offsetHeight - height)
        needsMeasure = false
        previous = -1
      }

      // Begin while the scene enters the screen, not after an intersection/reveal animation.
      const leadIn = height * 0.6
      const p = clamp((window.scrollY - start + leadIn) / (distance + leadIn))
      if (Math.abs(previous - p) < 0.0002) return
      previous = p

      const gather = ease(range(p, 0, 0.39))
      const clear = ease(range(p, 0.35, 0.78))
      const flight = ease(range(p, 0.28, 0.9))
      const approach = ease(range(p, 0.22, 0.64))
      const depart = ease(range(p, 0.62, 0.93))
      const bank = Math.sin(flight * Math.PI)
      const leave = ease(range(p, 0.8, 1))
      const cloudOpacity = (0.55 + gather * 0.4) * (1 - leave)

      move(
        'horizon',
        width * -0.035 * flight,
        height * 0.12 * flight,
        0,
        1 + flight * 0.12,
        1 - leave,
      )
      move(
        'flare',
        width * mix(-0.05, 0.24, flight),
        height * (-0.02 - flight * 0.08),
        0,
        1 + bank * 0.4,
        bank * (1 - leave) * 0.6,
      )
      move(
        'cloudBackLeft',
        width * (-0.48 + gather * 0.31 - clear * 0.24),
        height * (0.02 - clear * 0.07),
        -80,
        1.1,
        cloudOpacity,
      )
      move(
        'cloudBackRight',
        width * (0.48 - gather * 0.31 + clear * 0.24),
        height * (-0.06 + clear * 0.02),
        -110,
        1.15,
        cloudOpacity,
      )
      move(
        'plane',
        width * (-0.19 + approach * 0.27 + depart * 1.3),
        height * ((height < 700 ? 0.23 : 0.14) - approach * 0.2 - depart * 0.28),
        -260 + approach * 360 + depart * 240,
        0.7 + approach * 0.23 + depart * 0.1,
        1 - ease(range(p, 0.87, 0.98)),
        `rotateX(${mix(12, -6, flight).toFixed(2)}deg) rotateY(${mix(-22, 18, flight).toFixed(2)}deg) rotateZ(${(-12 + bank * 17).toFixed(2)}deg)`,
      )
      move(
        'cloudFrontLeft',
        width * (-0.57 + gather * 0.32 - clear * 0.5),
        height * (0.08 + clear * 0.13),
        75,
        1.1 + clear * 0.22,
        cloudOpacity,
      )
      move(
        'cloudFrontRight',
        width * (0.57 - gather * 0.32 + clear * 0.5),
        height * (0.13 + clear * 0.04),
        95,
        1.1 + clear * 0.22,
        cloudOpacity,
      )
      move(
        'mistLeft',
        width * (-0.7 + gather * 0.58 - clear * 0.35),
        0,
        0,
        1,
        (0.15 + gather * 0.5) * (1 - leave),
      )
      move(
        'mistRight',
        width * (0.7 - gather * 0.58 + clear * 0.35),
        0,
        0,
        1,
        (0.15 + gather * 0.5) * (1 - leave),
      )
      move('intro', 0, -height * 0.07 * flight, 0, 1, 1 - ease(range(p, 0.32, 0.48)))
      move('outro', 0, 24 * (1 - ease(range(p, 0.73, 0.87))), 0, 1, ease(range(p, 0.73, 0.87)))
      move('fade', 0, 0, 0, 1, leave)

      const progress = layers.current.progress
      if (progress) progress.style.transform = `scaleX(${p.toFixed(4)})`
      const phase = p < 0.44 ? 'clouds' : p < 0.8 ? 'flight' : 'arrival'
      if (section.dataset.phase !== phase) section.dataset.phase = phase
    }

    const schedule = () => {
      if (!disposed && active && !document.hidden && !still.matches && !frame) {
        frame = window.requestAnimationFrame(paint)
      }
    }
    const measure = () => {
      needsMeasure = true
      schedule()
    }
    const reset = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      previous = -1
      initialStyles.forEach((style, node) => {
        node.style.cssText = style
      })
      section.dataset.active = 'false'
      section.dataset.phase = 'clouds'
    }
    const changeMode = () => {
      reset()
      section.dataset.active = String(active && !still.matches && !document.hidden)
      measure()
    }

    // Observing early prepares compositor layers before arrival; it never hides the scene.
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              active = Boolean(entry?.isIntersecting)
              section.dataset.active = String(active && !still.matches && !document.hidden)
              if (active) measure()
              else {
                window.cancelAnimationFrame(frame)
                frame = 0
              }
            },
            { rootMargin: '100% 0px' },
          )
    if (observer) observer.observe(section)
    else active = true

    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    resize?.observe(section)
    if (section.parentElement) resize?.observe(section.parentElement)
    resize?.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('pageshow', measure)
    window.addEventListener('load', measure)
    document.addEventListener('visibilitychange', changeMode)
    still.addEventListener('change', changeMode)
    void document.fonts.ready.then(() => {
      if (!disposed) measure()
    })
    measure()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      resize?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pageshow', measure)
      window.removeEventListener('load', measure)
      document.removeEventListener('visibilitychange', changeMode)
      still.removeEventListener('change', changeMode)
      reset()
    }
  }, [])

  return { root, stage, bind }
}
