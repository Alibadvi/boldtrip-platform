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

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value))

const range = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start))

const smooth = (value: number) =>
  value * value * (3 - 2 * value)

function bezier(
  start: number,
  control1: number,
  control2: number,
  end: number,
  progress: number,
) {
  const inverse = 1 - progress

  return (
    inverse ** 3 * start +
    3 * inverse ** 2 * progress * control1 +
    3 * inverse * progress ** 2 * control2 +
    progress ** 3 * end
  )
}

export function useFlightScroll() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  const layers = useRef<
    Partial<Record<FlightLayer, HTMLDivElement | null>>
  >({})

  const bind = (name: FlightLayer) =>
    (node: HTMLDivElement | null) => {
      layers.current[name] = node
    }

  useEffect(() => {
    const section = root.current
    const viewport = stage.current

    if (!section || !viewport) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')

    const initialStyles = new Map(
      Object.values(layers.current).flatMap((node) =>
        node ? [[node, node.style.cssText] as const] : [],
      ),
    )

    let disposed = false
    let active = true
    let frame = 0
    let lastTime = 0
    let needsMeasure = true
    let snap = true

    let width = 1
    let height = 1
    let start = 0
    let distance = 1
    let planeWidth = 1
    let portrait = false

    let current = 0
    let previous = -1

    const move = (
      name: FlightLayer,
      x: number,
      y: number,
      z = 0,
      scale = 1,
      opacity = 1,
      rotation = '',
    ) => {
      const node = layers.current[name]

      if (!node) return

      node.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) ` +
        `${rotation} scale(${scale.toFixed(4)})`

      node.style.opacity = clamp(opacity).toFixed(4)
    }

    const measure = () => {
      // Read layout before writing styles.
      width = viewport.clientWidth
      height = viewport.clientHeight
      start = section.getBoundingClientRect().top + window.scrollY
      distance = Math.max(1, section.offsetHeight - height)

      portrait = width / height < 0.95

      // Size against both dimensions, including tablets and short laptops.
      planeWidth = Math.min(
        width * (portrait ? 0.96 : 0.74),
        height * (portrait ? 0.88 : 1.3),
        1100,
      )

      const plane = layers.current.plane

      if (plane) {
        plane.style.width = `${planeWidth.toFixed(1)}px`
        plane.style.transformOrigin = '50% 50%'
      }

      needsMeasure = false
      previous = -1
    }

    const draw = (progress: number) => {
      if (Math.abs(previous - progress) < 0.0001) return

      previous = progress

      const gather = smooth(range(progress, 0, 0.3))
      const flight = smooth(range(progress, 0.12, 0.74))
      const departure = smooth(range(progress, 0.74, 0.97))
      const clear = smooth(range(progress, 0.34, 0.8))
      const arrival = smooth(range(progress, 0.84, 0.97))
      const fade = smooth(range(progress, 0.83, 1))

      /*
       * Positions describe the visible screen path.
       * The aircraft stays below the opening text, then moves
       * toward the center before making its departure.
       */
      const pathX = bezier(
        portrait ? -0.17 : -0.23,
        -0.13,
        portrait ? -0.025 : 0.02,
        portrait ? 0.02 : 0.07,
        flight,
      )

      const pathY = bezier(
        portrait ? 0.21 : 0.17,
        portrait ? 0.2 : 0.17,
        portrait ? 0.12 : 0.09,
        portrait ? 0.035 : -0.025,
        flight,
      )

      const exitDistance = width * 0.65 + planeWidth * 0.6
      const screenX = width * pathX + exitDistance * departure
      const screenY = height * (
        pathY - departure * (portrait ? 0.36 : 0.42)
      )

      const depth = -160 + flight * 210
      const apparentScale = 0.4 + flight * 0.54 - departure * 0.1
      const bank = Math.sin(flight * Math.PI)

      /*
       * Perspective also magnifies translation.
       * Compensating for it keeps the intended screen position
       * and size stable instead of throwing the plane off-screen.
       */
      const projection = 1000 / (1000 - depth)

      move(
        'plane',
        screenX / projection,
        screenY / projection,
        depth,
        apparentScale / projection,
        1 - smooth(range(progress, 0.94, 1)),
        `rotateX(${(1.5 - flight * 3).toFixed(2)}deg) ` +
          `rotateZ(${(-2 - bank * 3 + departure * 5).toFixed(2)}deg)`,
      )

      move(
        'horizon',
        -width * flight * 0.018,
        height * flight * 0.055,
        0,
        1 + flight * 0.055,
        1 - fade,
      )

      move(
        'flare',
        width * (-0.08 + flight * 0.19),
        height * (0.12 - flight * 0.13),
        0,
        0.85 + bank * 0.25,
        bank * (1 - departure) * 0.42,
      )

      const cloudOpacity = (0.55 + gather * 0.3) * (1 - fade)

      move(
        'cloudBackLeft',
        width * (-0.48 + gather * 0.28 - clear * 0.3),
        height * (0.02 - clear * 0.045),
        -80,
        1.1 + clear * 0.04,
        cloudOpacity,
      )

      move(
        'cloudBackRight',
        width * (0.48 - gather * 0.28 + clear * 0.3),
        height * (-0.06 + clear * 0.025),
        -110,
        1.15 + clear * 0.04,
        cloudOpacity,
      )

      move(
        'cloudFrontLeft',
        width * (-0.57 + gather * 0.3 - clear * 0.48),
        height * (0.08 + clear * 0.08),
        75,
        1.1 + clear * 0.14,
        cloudOpacity,
        `rotateZ(${(-clear * 3).toFixed(2)}deg)`,
      )

      move(
        'cloudFrontRight',
        width * (0.57 - gather * 0.3 + clear * 0.48),
        height * (0.13 + clear * 0.035),
        95,
        1.1 + clear * 0.14,
        cloudOpacity,
        `rotateZ(${(clear * 3).toFixed(2)}deg)`,
      )

      const mistClear = smooth(range(progress, 0.43, 0.86))
      const mistOpacity =
        (0.15 + gather * 0.34) *
        (1 - mistClear * 0.65) *
        (1 - fade)

      move(
        'mistLeft',
        width * (-0.7 + gather * 0.55 - mistClear * 0.4),
        height * mistClear * 0.025,
        0,
        1,
        mistOpacity,
      )

      move(
        'mistRight',
        width * (0.7 - gather * 0.55 + mistClear * 0.4),
        -height * mistClear * 0.02,
        0,
        1,
        mistOpacity,
      )

      const introExit = smooth(range(progress, 0.2, 0.4))

      move(
        'intro',
        0,
        -height * introExit * 0.035,
        0,
        1,
        1 - introExit,
      )

      move('outro', 0, 20 * (1 - arrival), 0, 1, arrival)
      move('fade', 0, 0, 0, 1, fade)

      const progressBar = layers.current.progress

      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress.toFixed(4)})`
      }

      const phase =
        progress < 0.38
          ? 'clouds'
          : progress < 0.84
            ? 'flight'
            : 'arrival'

      if (section.dataset.phase !== phase) {
        section.dataset.phase = phase
      }
    }

    const cancel = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
    }

    const tick = (time: number) => {
      frame = 0

      if (disposed || document.hidden) return

      if (needsMeasure) measure()

      if (still.matches) {
        previous = -1
        draw(0)

        // A composed static scene for reduced motion and short screens.
        move('plane', 0, height * 0.24, 0, 0.7, 1, 'rotateZ(-2deg)')
        section.dataset.active = 'false'
        lastTime = 0
        return
      }

      // Start during entrance, without waiting for the section to pin.
      const leadIn = height * 0.55
      const target = clamp(
        (window.scrollY - start + leadIn) / (distance + leadIn),
      )

      if (snap || Math.abs(target - current) > 0.24) {
        // Restored scroll positions and large jumps should not play catch-up.
        current = target
        snap = false
      } else {
        const elapsed = lastTime ? clamp(time - lastTime, 0, 40) : 16.67
        const follow = 1 - Math.exp(-elapsed / 85)

        current += (target - current) * follow
      }

      lastTime = time

      const settled = Math.abs(target - current) < 0.0003

      if (settled) current = target

      draw(current)

      // Run only while settling after a scroll, never an idle render loop.
      if (!settled && active) {
        frame = window.requestAnimationFrame(tick)
      } else {
        lastTime = 0
      }
    }

    const schedule = () => {
      if (
        disposed ||
        document.hidden ||
        frame ||
        (!active && !needsMeasure)
      ) {
        return
      }

      frame = window.requestAnimationFrame(tick)
    }

    const invalidate = () => {
      needsMeasure = true
      snap = true
      schedule()
    }

    const onScroll = () => {
      if (!still.matches) schedule()
    }

    const onModeChange = () => {
      cancel()

      section.dataset.active = String(
        active && !still.matches && !document.hidden,
      )

      invalidate()
    }

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              active = Boolean(entry?.isIntersecting)

              section.dataset.active = String(
                active && !still.matches && !document.hidden,
              )

              if (active) invalidate()
              else cancel()
            },
            { rootMargin: '60% 0px' },
          )

    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(invalidate)

    observer?.observe(section)
    resize?.observe(viewport)
    resize?.observe(section)

    if (section.parentElement) {
      resize?.observe(section.parentElement)
    }

    resize?.observe(document.body)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    window.addEventListener('orientationchange', invalidate)
    window.addEventListener('pageshow', invalidate)
    window.addEventListener('load', invalidate)

    document.addEventListener('visibilitychange', onModeChange)
    still.addEventListener('change', onModeChange)

    void document.fonts.ready.then(() => {
      if (!disposed) invalidate()
    })

    // Initialize immediately; the observer only controls off-screen work.
    onModeChange()

    return () => {
      disposed = true
      cancel()

      observer?.disconnect()
      resize?.disconnect()

      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('orientationchange', invalidate)
      window.removeEventListener('pageshow', invalidate)
      window.removeEventListener('load', invalidate)

      document.removeEventListener('visibilitychange', onModeChange)
      still.removeEventListener('change', onModeChange)

      initialStyles.forEach((style, node) => {
        node.style.cssText = style
      })

      section.dataset.active = 'false'
      section.dataset.phase = 'clouds'
    }
  }, [])

  return { root, stage, bind }
}