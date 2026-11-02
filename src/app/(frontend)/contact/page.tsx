import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ContentPage, ContentSection } from '@/app/(frontend)/_components/content-page'
import { buttonVariants } from '@/shared/ui'
import { TravelIcon } from '../_components/travel-icon'

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'راه‌های ارتباطی بولدتریپ؛ اینستاگرام، تلفن، واتس‌اپ، تلگرام و ایمیل.',
  alternates: { canonical: '/contact' },
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'contact-settings', depth: 0 })
  const phone = (settings.phone || '+989104787878').replace(/[^+\d]/g, '')
  const whatsapp = (settings.whatsapp || '+989104787878').replace(/\D/g, '')
  const instagram = (settings.instagram || 'boldtrip.visa').replace(/[^a-zA-Z0-9._]/g, '')
  const telegram = (settings.telegram || 'boldtrip4444').replace(/[^a-zA-Z0-9_]/g, '')
  const displayPhone = phone === '+989104787878' ? '09104787878' : phone
  const contacts = [
    {
      label: 'اینستاگرام',
      display: `@${instagram}`,
      href: `https://instagram.com/${instagram}`,
      icon: 'camera' as const,
    },
    {
      label: 'تلفن',
      display: displayPhone,
      href: `tel:${phone}`,
      icon: 'phone' as const,
      phone: true,
    },
    {
      label: 'واتس‌اپ',
      display: displayPhone,
      href: `https://wa.me/${whatsapp}`,
      icon: 'message' as const,
      phone: true,
    },
    {
      label: 'تلگرام',
      display: `@${telegram}`,
      href: `https://t.me/${telegram}`,
      icon: 'message' as const,
    },
    {
      label: 'ایمیل',
      display: settings.email || 'boldtrip4444@gmail.com',
      href: `mailto:${settings.email || 'boldtrip4444@gmail.com'}`,
      icon: 'mail' as const,
    },
  ]
  return (
    <ContentPage
      description="برای انتخاب مسیر، یک جلسه مشاوره رزرو کنید؛ برای درخواست ثبت‌شده از داخل حساب خود پیگیری کنید."
      eyebrow="ارتباط با BoldTrip"
      title="از مسیر درست با ما در تماس باشید"
    >
      <ContentSection title="پیش از ثبت درخواست">
        <p>
          اگر درباره نوع ویزا یا خدمت مناسب مطمئن نیستید، زمان مشاوره را انتخاب کنید تا شرایط شما
          منظم بررسی شود.
        </p>
        <Link className={buttonVariants()} href="/consultation/book">
          رزرو مشاوره
        </Link>
      </ContentSection>

      <ContentSection title="پس از ثبت درخواست">
        <p>
          شماره پیگیری، وضعیت پرونده، توضیح کارشناس، مدارک و پرداخت هر درخواست در حساب کاربری شما
          قرار می‌گیرد.
        </p>
        <Link
          className={buttonVariants({
            variant: 'secondary',
          })}
          href="/account/requests"
        >
          ورود به پیگیری درخواست
        </Link>
      </ContentSection>

      <ContentSection title="راه‌های ارتباطی">
        <div className="grid gap-3 sm:grid-cols-2">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="flex min-w-0 items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 transition hover:border-brand-400 hover:bg-white"
              rel={contact.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
              target={contact.href.startsWith('https:') ? '_blank' : undefined}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                <TravelIcon name={contact.icon} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-ink-500">{contact.label}</span>
                <span
                  dir="ltr"
                  className={`mt-1 inline-block max-w-full font-bold text-brand-950 ${contact.phone ? 'whitespace-nowrap [unicode-bidi:isolate]' : 'break-all'}`}
                >
                  {contact.display}
                </span>
              </span>
            </a>
          ))}
        </div>
      </ContentSection>
    </ContentPage>
  )
}
