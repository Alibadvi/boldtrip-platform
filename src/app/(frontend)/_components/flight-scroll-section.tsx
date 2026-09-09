'use client'

/* eslint-disable @next/next/no-img-element -- Pre-compressed local textures avoid cold image optimization. */
import type { CSSProperties, ReactNode, Ref } from 'react'

import { useFlightScroll } from './use-flight-scroll'

type Artwork = 'aircraft-front' | 'cloud-bank' | 'mist-veil'

function FlightArtwork({ kind, mirrored = false }: { kind: Artwork; mirrored?: boolean }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={`/assets/flight/${kind}-1280.webp`} />
      <img
        src={`/assets/flight/${kind}-640.webp`}
        alt=""
        width={640}
        height={427}
        loading="eager"
        fetchPriority="low"
        decoding="async"
        draggable={false}
        className={`block h-auto w-full select-none ${mirrored ? '-scale-x-100' : ''}`}
      />
    </picture>
  )
}

// Layers share the same camera center and perspective; only their depth/motion differs.
function DepthLayer({
  children,
  layerRef,
  className = '',
  style,
}: {
  children: ReactNode
  layerRef: Ref<HTMLDivElement>
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1000px]">
      <div
        ref={layerRef}
        className={`shrink-0 group-data-[active=true]/flight:will-change-transform ${className}`}
        style={style}
      >
        {children}
      </div>
    </div>
  )
}

export function FlightScrollSection({
  children,
  id = 'boldtrip-flight',
  nextBackground = '#17082f',
}: {
  children: ReactNode
  id?: string
  nextBackground?: string
}) {
  const { root, stage, bind } = useFlightScroll()
  const nextSectionId = `${id}-next`
  const cloudSize =
    'w-[125vw] max-w-[1700px] [mask-image:radial-gradient(ellipse,#000_35%,#000_55%,transparent_74%)]'
  const mistSize = 'w-[145vw] max-w-[1800px]'

  return (
    <div style={{ backgroundColor: nextBackground }}>
      <section
        ref={root}
        id={id}
        aria-labelledby={`${id}-title`}
        className="group/flight relative isolate h-[240svh] text-white [overflow-anchor:none] motion-reduce:h-auto [@media(max-height:540px)]:h-auto [@media(scripting:none)]:h-auto"
      >
        <div
          ref={stage}
          className="sticky top-0 isolate h-svh min-h-[540px] overflow-hidden bg-[#10121e] [@media(max-height:540px)]:relative [@media(max-height:540px)]:h-[600px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_56%,#827785_0%,#3b3d51_32%,#151826_67%,#090b15_100%)]"
          />
          <div
            ref={bind('light')}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: 0.55 }}
          >
            <div className="absolute top-[29%] left-[33%] h-[55%] w-[34%] bg-[radial-gradient(ellipse,#fff1d8a6_0%,#edc9b238_30%,transparent_70%)]" />
            <div className="absolute -top-[35%] left-[33%] h-[150%] w-[13%] -rotate-[28deg] bg-[linear-gradient(90deg,transparent,#fce9cf12,transparent)]" />
            <div className="absolute -top-[35%] right-[33%] h-[150%] w-[13%] rotate-[28deg] bg-[linear-gradient(90deg,transparent,#fce9cf12,transparent)]" />
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <DepthLayer
              layerRef={bind('cloudBackLeft')}
              className={cloudSize}
              style={{ transform: 'translate3d(-46vw,4svh,-220px) scale(1.3)' }}
            >
              <FlightArtwork kind="cloud-bank" />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('cloudBackRight')}
              className={cloudSize}
              style={{ transform: 'translate3d(46vw,-2svh,-220px) scale(1.3)' }}
            >
              <FlightArtwork kind="cloud-bank" mirrored />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('flare')}
              className="h-10 w-[80vw] max-w-[1200px] bg-[radial-gradient(ellipse,#fff3dccc_0%,#d9dfff45_20%,transparent_68%)]"
              style={{ opacity: 0.15, transform: 'translateY(10svh)' }}
            >
              <span />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('plane')}
              className="w-[100vw] max-w-[1300px] [--plane-depth:-900px] [--plane-scale:.45] [--plane-y:9svh] motion-reduce:[--plane-depth:0px] motion-reduce:[--plane-scale:.85] motion-reduce:[--plane-y:20svh] [@media(max-height:540px)]:w-[min(72vw,600px)] [@media(max-height:540px)]:[--plane-depth:0px] [@media(max-height:540px)]:[--plane-scale:.85] [@media(max-height:540px)]:[--plane-y:180px] [@media(scripting:none)]:[--plane-depth:0px] [@media(scripting:none)]:[--plane-scale:.85] [@media(scripting:none)]:[--plane-y:20svh]"
              style={{
                transform:
                  'translate3d(0,var(--plane-y),var(--plane-depth)) scale(var(--plane-scale))',
              }}
            >
              <FlightArtwork kind="aircraft-front" />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('cloudFrontLeft')}
              className={cloudSize}
              style={{ transform: 'translate3d(-60vw,9svh,35px) scale(1.05)' }}
            >
              <FlightArtwork kind="cloud-bank" />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('cloudFrontRight')}
              className={cloudSize}
              style={{ transform: 'translate3d(60vw,13svh,35px) scale(1.05)' }}
            >
              <FlightArtwork kind="cloud-bank" mirrored />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('mistCenter')}
              className="w-[145vw] max-w-[1900px]"
              style={{ transform: 'translate3d(0,8svh,60px)', opacity: 0.25 }}
            >
              <FlightArtwork kind="mist-veil" />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('mistLeft')}
              className={mistSize}
              style={{ transform: 'translate3d(-42vw,10svh,80px)', opacity: 0.5 }}
            >
              <FlightArtwork kind="mist-veil" />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('mistRight')}
              className={mistSize}
              style={{ transform: 'translate3d(42vw,15svh,80px)', opacity: 0.5 }}
            >
              <FlightArtwork kind="mist-veil" mirrored />
            </DepthLayer>
            <DepthLayer
              layerRef={bind('wake')}
              className="w-[155vw] max-w-[1800px]"
              style={{ transform: 'translate3d(0,35svh,140px)', opacity: 0 }}
            >
              <FlightArtwork kind="mist-veil" />
            </DepthLayer>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,transparent_26%,#080b1738_62%,#040611cf_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-linear-to-b from-[#090b17]/85 via-[#090b17]/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
            style={{ background: `linear-gradient(to top,${nextBackground},transparent)` }}
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[.045]"
          >
            <defs>
              <pattern id={`${id}-grain`} width="53" height="47" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="8" r=".7" fill="white" />
                <circle cx="19" cy="31" r=".5" fill="black" />
                <circle cx="39" cy="13" r=".6" fill="white" />
                <circle cx="47" cy="41" r=".7" fill="black" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id}-grain)`} />
          </svg>
          <div
            ref={bind('fade')}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: 0, backgroundColor: nextBackground }}
          />

          <div
            ref={bind('intro')}
            className="pointer-events-none absolute inset-x-5 top-[max(164px,20svh)] z-10 text-center"
          >
            <p
              dir="ltr"
              className="mb-4 text-[10px] font-medium tracking-[.36em] text-[#ead6bf] sm:text-xs"
            >
              BOLDTRIP · A NEW CHAPTER
            </p>
            <h2
              id={`${id}-title`}
              className="text-[clamp(2rem,min(5vw,7svh),4.75rem)] font-black leading-[1.5] text-white"
            >
              از میانِ ابرها،
              <br />
              <span className="text-[#ffe3b5]">به یک شروع تازه.</span>
            </h2>
          </div>
          <div
            ref={bind('outro')}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-[27%] z-10 text-center"
            style={{ opacity: 0, transform: 'translateY(24px)' }}
          >
            <span className="mb-5 block text-xs text-accent-200">آن سوی ابرها، مسیر شماست.</span>
            <p className="text-[clamp(1.75rem,min(4.5vw,5.5svh),4rem)] font-black leading-[1.6]">
              حالا،
              <br />
              نوبتِ شروع شماست.
            </p>
          </div>
          <a
            href={`#${nextSectionId}`}
            className="absolute top-[max(112px,13svh)] left-5 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#090b17]/65 px-4 text-xs text-white/85 transition-colors hover:bg-white/15 focus-visible:outline-accent-200 sm:left-10"
          >
            ادامه به مراحل سفر <span aria-hidden="true">↓</span>
          </a>
          <div
            ref={bind('hud')}
            aria-hidden="true"
            className="absolute inset-x-6 bottom-[max(3rem,9svh)] z-20 mx-auto max-w-xl motion-reduce:hidden [@media(max-height:540px)]:hidden [@media(scripting:none)]:hidden"
          >
            <div className="mb-4 flex items-center justify-between gap-4 text-[10px] text-white/70 sm:text-xs">
              <span>با اسکرول، از میان ابرها عبور کنید</span>
              <span dir="ltr" className="shrink-0 tracking-[.18em]">
                SCROLL ↓
              </span>
            </div>
            <div className="h-px overflow-hidden bg-white/20">
              <div
                ref={bind('progress')}
                className="h-full origin-right bg-[#f8deba]"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[clamp(1.5rem,6svh,4rem)] bg-[#050610]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[clamp(1.5rem,6svh,4rem)] bg-[#050610]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8"
            style={{ background: `linear-gradient(to top,${nextBackground},transparent)` }}
          />
        </div>
      </section>
      <div
        id={nextSectionId}
        tabIndex={-1}
        className="relative z-10 -mt-[40svh] scroll-mt-24 outline-none motion-reduce:mt-0 [@media(max-height:540px)]:mt-0 [@media(scripting:none)]:mt-0"
      >
        {children}
      </div>
    </div>
  )
}
