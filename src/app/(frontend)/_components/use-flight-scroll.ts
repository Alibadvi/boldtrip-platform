'use client'

import { useEffect, useRef } from 'react'

type FlightLayer =
  | 'light'
  | 'cloudBackLeft'
  | 'cloudBackRight'
  | 'plane'
  | 'flare'
  | 'cloudFrontLeft'
  | 'cloudFrontRight'
  | 'mistLeft'
  | 'mistRight'
  | 'mistCenter'
  | 'wake'
  | 'intro'
  | 'outro'
  | 'fade'
  | 'progress'
  | 'hud'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start))
const ease = (value: number) => value * value * (3 - 2 * value)

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

      const gather = ease(range(p, 0, 0.3))
      const approach = ease(range(p, 0.22, 0.79))
      const flyOver = ease(range(p, 0.75, 0.91))
      const leave = ease(range(p, 0.82, 0.98))
      const planeZ = -900 + 1550 * approach
      const planeScale = 0.45 + 0.6 * approach

      // Perspective magnification drives the wake: the growing aircraft pushes each layer
      // outward, with a lag for wispy vapor. The nose stays on the camera's center line.
      const projectedScale = (planeScale * 1000) / (1000 - planeZ)
      const wakeBack = ease(range(projectedScale, 0.3, 1.2))
      const wakeNear = ease(range(projectedScale, 0.42, 1.6))
      const wakeMist = ease(range(projectedScale, 0.6, 2))
      const cloudOpacity = 1 - leave

      move('light', 0, 0, 0, 1, (0.55 + gather * 0.35) * cloudOpacity)
      move(
        'flare',
        0,
        height * (0.1 - flyOver * 0.8),
        0,
        0.7 + approach,
        (0.15 + gather * 0.55) * (1 - ease(range(p, 0.76, 0.86))),
      )

      move(
        'cloudBackLeft',
        -width * (0.46 - gather * 0.23 + wakeBack * 0.85),
        height * (0.04 - wakeBack * 0.12),
        -220 + wakeBack * 60,
        1.3 + gather * 0.05 + wakeBack * 0.08,
        cloudOpacity,
      )
      move(
        'cloudBackRight',
        width * (0.46 - gather * 0.23 + wakeBack * 0.85),
        height * (-0.02 + wakeBack * 0.05),
        -220 + wakeBack * 60,
        1.3 + gather * 0.05 + wakeBack * 0.08,
        cloudOpacity,
      )

      // Approach along Z, then pass above the viewer; no sideways flight path.
      move(
        'plane',
        0,
        height * (0.09 - flyOver * 0.96),
        planeZ,
        planeScale,
        1 - ease(range(p, 0.83, 0.91)),
        `rotateX(${-flyOver * 4}deg)`,
      )

      move(
        'cloudFrontLeft',
        -width * (0.6 - gather * 0.4 + wakeNear * 1.15),
        height * (0.09 - wakeNear * 0.18),
        35 + wakeNear * 95,
        1.05 + gather * 0.08 + wakeNear * 0.15,
        cloudOpacity,
        `rotateZ(${-wakeNear * 12}deg)`,
      )
      move(
        'cloudFrontRight',
        width * (0.6 - gather * 0.4 + wakeNear * 1.15),
        height * (0.13 + wakeNear * 0.08),
        35 + wakeNear * 95,
        1.05 + gather * 0.08 + wakeNear * 0.15,
        cloudOpacity,
        `rotateZ(${wakeNear * 12}deg)`,
      )

      move(
        'mistCenter',
        0,
        height * (0.08 - wakeMist * 0.1),
        60 + wakeMist * 80,
        1 + wakeMist * 0.35,
        (0.25 + gather * 0.25) * (1 - wakeMist) * cloudOpacity,
      )
      move(
        'mistLeft',
        -width * (0.42 - gather * 0.24 + wakeMist * 1.15),
        height * (0.1 + wakeMist * 0.15),
        80 + wakeMist * 50,
        1 + wakeMist * 0.25,
        (0.5 + gather * 0.2) * (1 - wakeMist * 0.55) * cloudOpacity,
        `rotateZ(${-wakeMist * 20}deg)`,
      )
      move(
        'mistRight',
        width * (0.42 - gather * 0.24 + wakeMist * 1.15),
        height * (0.15 - wakeMist * 0.14),
        80 + wakeMist * 50,
        1 + wakeMist * 0.25,
        (0.5 + gather * 0.2) * (1 - wakeMist * 0.55) * cloudOpacity,
        `rotateZ(${wakeMist * 20}deg)`,
      )

      const trail = ease(range(p, 0.72, 0.86))
      move(
        'wake',
        0,
        height * (0.35 - trail * 0.4),
        140,
        1 + trail * 0.15,
        trail * (1 - ease(range(p, 0.87, 0.98))) * 0.55,
      )
      move('intro', 0, -height * 0.05 * approach, 0, 1, 1 - ease(range(p, 0.23, 0.39)))
      move('outro', 0, 24 * (1 - ease(range(p, 0.85, 0.95))), 0, 1, ease(range(p, 0.85, 0.95)))
      move('fade', 0, 0, 0, 1, leave)
      move('hud', 0, 0, 0, 1, 1 - ease(range(p, 0.65, 0.8)))

      const progress = layers.current.progress
      if (progress) progress.style.transform = `scaleX(${p.toFixed(4)})`
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
