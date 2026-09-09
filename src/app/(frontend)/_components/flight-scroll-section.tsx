'use client'

/* eslint-disable @next/next/no-img-element -- Pre-compressed responsive assets bypass cold image optimization. */
import type { ReactNode } from 'react'

import { useFlightScroll } from './use-flight-scroll'

/** Both images ship with the site. Repeated clouds reuse the same browser download. */
function FlightArtwork({
  kind,
  mirrored = false,
}: {
  kind: 'plane' | 'cloud'
  mirrored?: boolean
}) {
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

const moving = 'group-data-[active=true]/flight:will-change-transform'
const cloud = `pointer-events-none absolute top-[30%] w-[94%] max-w-[1500px] sm:w-[76%] ${moving}`

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

  return (
    <div style={{ backgroundColor: nextBackground }}>
      <section
        ref={root}
        id={id}
        aria-labelledby={`${id}-title`}
        data-phase="clouds"
        className="group/flight relative isolate h-[240svh] text-white [--plane-start-y:14svh] [overflow-anchor:none] motion-reduce:h-auto [@media(max-height:540px)]:h-auto [@media(max-height:700px)]:[--plane-start-y:23svh] [@media(scripting:none)]:h-auto"
      >
        <div
          ref={stage}
          className="sticky top-0 isolate h-svh min-h-[540px] overflow-hidden [perspective:1000px] [@media(max-height:540px)]:relative [@media(max-height:540px)]:h-[600px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_64%_38%,#9364c9_0%,#533379_26%,#211434_58%,#160c26_100%)]"
          />

          <div
            ref={bind('horizon')}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${moving}`}
          >
            <div className="absolute top-[37%] left-[57%] size-[clamp(70px,12vw,170px)] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff6d9,#eacbff_40%,#9970d5_65%,#4b2c6d)] shadow-[0_0_90px_25px_#efcbfc30]" />
            <div className="absolute top-[65%] left-1/2 h-[80vw] min-h-[650px] w-[190%] -translate-x-1/2 rounded-[50%] border-t border-purple-200/50 bg-[radial-gradient(ellipse_at_50%_0%,#ae89cf_0%,#644878_12%,#291b3e_42%,#170d26_70%)] shadow-[0_-12px_70px_#c1a2fa30] sm:w-[130%]" />
            <svg
              viewBox="0 0 1440 900"
              fill="none"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M-120 760C300 840 150 320 730 450S1040 750 1600 260"
                stroke="#f1d5ff"
                strokeOpacity=".24"
                strokeDasharray="3 12"
              />
              <path
                d="M-100 660C350 1010 1060 1030 1610 620"
                stroke="#eedfff"
                strokeOpacity=".12"
              />
              <g fill="#f4e4ff" opacity=".55">
                <circle cx="190" cy="290" r="2" />
                <circle cx="360" cy="370" r="1.5" />
                <circle cx="1000" cy="195" r="2" />
                <circle cx="1250" cy="420" r="1.5" />
                <circle cx="880" cy="280" r="1" />
                <circle cx="640" cy="130" r="1.5" />
              </g>
            </svg>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [perspective:1000px]"
          >
            <div
              ref={bind('cloudBackLeft')}
              className={`${cloud} left-0`}
              style={{ transform: 'translate3d(-48vw,2vh,-80px) scale(1.1)', opacity: 0.55 }}
            >
              <FlightArtwork kind="cloud" />
            </div>
            <div
              ref={bind('cloudBackRight')}
              className={`${cloud} right-0`}
              style={{ transform: 'translate3d(48vw,-6vh,-110px) scale(1.15)', opacity: 0.55 }}
            >
              <FlightArtwork kind="cloud" mirrored />
            </div>
            <div
              ref={bind('flare')}
              className={`absolute top-[47%] left-[15%] h-8 w-[70%] bg-[radial-gradient(ellipse_at_center,#fff4df_0%,#e7c8ff80_18%,transparent_70%)] ${moving}`}
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 flex items-center justify-center [perspective:1000px]">
              <div
                ref={bind('plane')}
                className={`w-[94vw] max-w-[1100px] shrink-0 motion-reduce:[--plane-start-y:clamp(180px,30svh,300px)] [@media(max-height:540px)]:w-[min(72vw,600px)] [@media(max-height:540px)]:[--plane-start-y:180px] ${moving}`}
                style={{
                  transform:
                    'translate3d(-19vw,var(--plane-start-y),-260px) rotateX(12deg) rotateY(-22deg) rotateZ(-12deg) scale(.7)',
                }}
              >
                <FlightArtwork kind="plane" />
              </div>
            </div>
            <div
              ref={bind('cloudFrontLeft')}
              className={`${cloud} left-0`}
              style={{ transform: 'translate3d(-57vw,8vh,75px) scale(1.1)', opacity: 0.55 }}
            >
              <FlightArtwork kind="cloud" />
            </div>
            <div
              ref={bind('cloudFrontRight')}
              className={`${cloud} right-0`}
              style={{ transform: 'translate3d(57vw,13vh,95px) scale(1.1)', opacity: 0.55 }}
            >
              <FlightArtwork kind="cloud" mirrored />
            </div>
            <div
              ref={bind('mistLeft')}
              className={`absolute inset-y-0 left-0 w-[85%] bg-[radial-gradient(ellipse_at_0%_55%,#f0e4ff_0%,#cdb9e980_36%,transparent_70%)] ${moving}`}
              style={{ transform: 'translate3d(-70vw,0,0)', opacity: 0.15 }}
            />
            <div
              ref={bind('mistRight')}
              className={`absolute inset-y-0 right-0 w-[85%] bg-[radial-gradient(ellipse_at_100%_55%,#eee4ff_0%,#c1c7f080_36%,transparent_70%)] ${moving}`}
              style={{ transform: 'translate3d(70vw,0,0)', opacity: 0.15 }}
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#130a2360_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
            style={{ background: `linear-gradient(to top, ${nextBackground}, transparent)` }}
          />
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
              className="mb-3 text-[10px] font-medium tracking-[.32em] text-white/65 sm:text-xs"
              dir="ltr"
            >
              BOLDTRIP · BEYOND THE HORIZON
            </p>
            <h2
              id={`${id}-title`}
              className="mx-auto max-w-4xl text-[clamp(2rem,min(5vw,7svh),4.75rem)] font-black leading-[1.55] tracking-normal text-white"
            >
              از خیالِ سفر،
              <br />
              <span className="text-accent-200">تا آن سوی ابرها.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-white/75 sm:mt-4 sm:max-w-lg sm:text-base [@media(max-height:700px)]:hidden">
              مقصد بعدی شما، شروع یک داستان تازه است.
            </p>
          </div>

          <div
            ref={bind('outro')}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-[26%] z-10 text-center"
            style={{ opacity: 0, transform: 'translateY(24px)' }}
          >
            <span className="mb-5 block text-xs tracking-wide text-accent-200">
              افق تازه، قدم‌های روشن
            </span>
            <p className="text-[clamp(1.75rem,min(4.5vw,5.5svh),4rem)] font-black leading-[1.6]">
              سفر شما،
              <br />
              از اینجا شروع می‌شود.
            </p>
          </div>

          <div className="absolute inset-x-5 top-[max(112px,13svh)] z-20 flex items-center justify-between gap-4 text-[10px] sm:inset-x-10 sm:text-xs">
            <span className="inline-flex items-center gap-2 text-white/65">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-200" /> یک لحظه
              برای سفر
            </span>
            <a
              href={`#${nextSectionId}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[#201035]/70 px-4 text-white/85 transition-colors hover:bg-white/15 focus-visible:outline-accent-200"
            >
              ادامه به مراحل سفر <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div
            className="absolute inset-x-5 bottom-10 z-20 mx-auto max-w-2xl motion-reduce:hidden sm:bottom-14 [@media(max-height:540px)]:hidden [@media(scripting:none)]:hidden"
            aria-hidden="true"
          >
            <div className="mb-4 flex items-center justify-between gap-3 text-[10px] text-white/55 sm:text-xs">
              <span>برای پرواز، اسکرول کنید</span>
              <span dir="ltr" className="tracking-[.16em]">
                SCROLL TO EXPLORE ↓
              </span>
            </div>
            <div className="mb-4 h-px overflow-hidden bg-white/15">
              <div
                ref={bind('progress')}
                className="h-full origin-right bg-accent-200"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:gap-3 sm:text-xs">
              <span className="rounded-xl border border-white/10 px-1 py-2 text-white/50 transition-colors group-data-[phase=clouds]/flight:border-accent-200/40 group-data-[phase=clouds]/flight:bg-accent-200/10 group-data-[phase=clouds]/flight:text-accent-100">
                ۰۱ · ورود به ابرها
              </span>
              <span className="rounded-xl border border-white/10 px-1 py-2 text-white/50 transition-colors group-data-[phase=flight]/flight:border-accent-200/40 group-data-[phase=flight]/flight:bg-accent-200/10 group-data-[phase=flight]/flight:text-accent-100">
                ۰۲ · پرواز به افق
              </span>
              <span className="rounded-xl border border-white/10 px-1 py-2 text-white/50 transition-colors group-data-[phase=arrival]/flight:border-accent-200/40 group-data-[phase=arrival]/flight:bg-accent-200/10 group-data-[phase=arrival]/flight:text-accent-100">
                ۰۳ · شروع مسیر شما
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-30 h-4 sm:h-6"
            style={{ backgroundColor: nextBackground }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-4 sm:h-6"
            style={{ backgroundColor: nextBackground }}
          />
        </div>
      </section>
      {/* Real content enters naturally; it is never hidden or made inert by animation state. */}
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
