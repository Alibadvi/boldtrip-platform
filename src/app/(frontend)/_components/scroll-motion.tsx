'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || media.matches || !('IntersectionObserver' in window)) return

    let animation: Animation | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        animation = element.animate(
          [
            { opacity: 0.2, transform: 'translateY(24px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 650, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
        )
        observer.disconnect()
      },
      { threshold: 0.08 },
    )
    const stop = () => {
      if (media.matches) {
        animation?.cancel()
        observer.disconnect()
      }
    }

    observer.observe(element)
    media.addEventListener('change', stop)
    return () => {
      observer.disconnect()
      animation?.cancel()
      media.removeEventListener('change', stop)
    }
  }, [])

  // Content stays visible in server HTML and without JavaScript.
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function Parallax({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const wrapper = useRef<HTMLDivElement>(null)
  const moving = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = wrapper.current
    const target = moving.current
    if (!element || !target || !('IntersectionObserver' in window)) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 1023px)')
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const offset = media.matches
        ? 0
        : Math.max(-28, Math.min(28, (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.08))
      target.style.setProperty('--parallax-offset', `${offset}px`)
    }
    const schedule = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      schedule()
    })

    observer.observe(element)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', update)
      target.style.removeProperty('--parallax-offset')
    }
  }, [])

  return (
    <div ref={wrapper} className={className}>
      <div ref={moving} className="motion-safe:lg:translate-y-[var(--parallax-offset,0px)]">
        {children}
      </div>
    </div>
  )
}
