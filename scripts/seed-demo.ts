import { getPayload } from 'payload'
import { loadEnv } from 'payload/node'

import { defaultHomepageContent } from '../src/modules/content/domain/homepage-content'

// Match Next.js environment loading before evaluating server-env in the config.
loadEnv()

type ID = number | string
type DemoRecord = Record<string, unknown> & { id: ID }

const today = new Date()
const reviewedAt = today.toISOString()

const countries = [
  { slug: 'canada', code: 'CA', flag: '🇨🇦', name: 'کانادا', source: 'https://www.canada.ca/en/immigration-refugees-citizenship.html' },
  { slug: 'germany', code: 'DE', flag: '🇩🇪', name: 'آلمان', source: 'https://www.auswaertiges-amt.de/en/visa-service' },
  { slug: 'france', code: 'FR', flag: '🇫🇷', name: 'فرانسه', source: 'https://france-visas.gouv.fr/en/' },
  { slug: 'italy', code: 'IT', flag: '🇮🇹', name: 'ایتالیا', source: 'https://vistoperitalia.esteri.it/home/en' },
  { slug: 'spain', code: 'ES', flag: '🇪🇸', name: 'اسپانیا', source: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx' },
  { slug: 'netherlands', code: 'NL', flag: '🇳🇱', name: 'هلند', source: 'https://www.netherlandsworldwide.nl/visa-the-netherlands' },
] as const

const visaTemplates = [
  {
    category: 'visitor',
    slug: 'visitor',
    label: 'توریستی',
    suitableFor: 'سفر تفریحی، دیدار خانواده یا سفر کوتاه‌مدت',
    stayLength: 'مطابق تصمیم مرجع صادرکننده و شرایط پرونده',
  },
  {
    category: 'study',
    slug: 'study',
    label: 'تحصیلی',
    suitableFor: 'متقاضیان دارای پذیرش معتبر از مرکز آموزشی',
    stayLength: 'متناسب با دوره تحصیل و مجوز صادرشده',
  },
  {
    category: 'work',
    slug: 'work',
    label: 'کاری',
    suitableFor: 'متقاضیان دارای پیشنهاد شغلی یا مسیر قانونی کار',
    stayLength: 'متناسب با مجوز کار و تصمیم مرجع رسمی',
  },
] as const

const services = [
  {
    slug: 'visa',
    title: 'خدمات ویزا',
    kind: 'visa',
    pricingMode: 'quotation',
    summary: 'بررسی اولیه شرایط، چک‌لیست اختصاصی و همراهی مرحله‌به‌مرحله برای آماده‌سازی درخواست ویزا.',
    description: 'ابتدا مقصد و نوع ویزا را انتخاب می‌کنید. کارشناس اطلاعات اولیه را بررسی می‌کند، مدارک موردنیاز را اعلام می‌کند و ادامه مسیر در حساب کاربری قابل پیگیری است.',
    estimatedDuration: 'پس از بررسی نوع پرونده اعلام می‌شود',
  },
  {
    slug: 'embassy-appointment',
    title: 'دریافت وقت سفارت',
    kind: 'embassyAppointment',
    pricingMode: 'quotation',
    summary: 'ثبت درخواست وقت سفارت، دریافت مدارک و پیگیری وضعیت از داخل حساب کاربری.',
    description: 'کشور مقصد را انتخاب کنید و اطلاعات متقاضی را ثبت کنید. پس از بررسی ظرفیت، هزینه و مراحل بعدی توسط کارشناس اعلام می‌شود.',
    estimatedDuration: 'وابسته به ظرفیت سفارت',
  },
  {
    slug: 'document-review',
    title: 'بررسی و تکمیل مدارک',
    kind: 'documentReview',
    pricingMode: 'fixed',
    priceAmount: 1450000,
    summary: 'کنترل چک‌لیست، کیفیت فایل‌ها و نواقص احتمالی پیش از ادامه پرونده.',
    description: 'مدارک بارگذاری‌شده با چک‌لیست خدمت تطبیق داده می‌شوند و موارد ناقص یا نیازمند اصلاح در پنل شما مشخص خواهد شد.',
    estimatedDuration: '۲ تا ۳ روز کاری',
  },
  {
    slug: 'application-form',
    title: 'تکمیل فرم‌های درخواست',
    kind: 'visa',
    pricingMode: 'quotation',
    summary: 'تکمیل فرم‌های موردنیاز بر اساس اطلاعات تأییدشده متقاضی.',
    description: 'اطلاعات فرم‌ها از شما دریافت و پیش‌نویس برای بازبینی آماده می‌شود. مسئولیت تأیید نهایی اطلاعات با متقاضی است.',
    estimatedDuration: '۳ تا ۵ روز کاری',
  },
  {
    slug: 'consultation',
    title: 'مشاوره تخصصی',
    kind: 'consultation',
    pricingMode: 'fixed',
    priceAmount: 1200000,
    summary: 'جلسه آنلاین برای بررسی هدف سفر، شرایط فعلی و انتخاب مسیر مناسب.',
    description: 'در یک جلسه ۴۵ دقیقه‌ای، وضعیت فعلی و پرسش‌های اصلی شما بررسی می‌شود. این جلسه تضمین دریافت ویزا یا نتیجه پرونده نیست.',
    estimatedDuration: '۴۵ دقیقه',
  },
] as const

async function upsert(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  key: string,
  value: unknown,
  data: Record<string, unknown>,
): Promise<DemoRecord> {
  const result = await payload.find({
    collection: collection as never,
    where: { [key]: { equals: value } },
    limit: 1,
    depth: 0,
    draft: false,
    overrideAccess: true,
    pagination: false,
  })

  const current = result.docs[0] as DemoRecord | undefined

  if (current) {
    return await payload.update({
      collection: collection as never,
      id: current.id,
      data: data as never,
      draft: false,
      overrideAccess: true,
    }) as unknown as DemoRecord
  }

  return await payload.create({
    collection: collection as never,
    data: data as never,
    draft: false,
    overrideAccess: true,
  }) as unknown as DemoRecord
}

function futureSlot(daysFromNow: number, hour: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + daysFromNow)
  date.setUTCHours(hour, 0, 0, 0)
  return date.toISOString()
}

async function seed() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  payload.logger.info('Seeding BoldTrip showcase data...')

  await payload.updateGlobal({
    slug: 'homepage',
    data: defaultHomepageContent,
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'consultation-page',
    overrideAccess: true,
    data: {
      hero: {
        kicker: 'مشاوره تخصصی BoldTrip',
        title: 'قبل از اقدام، مسیر مناسب خود را روشن کنید',
        description: 'در یک جلسه آنلاین، هدف سفر، شرایط فعلی و گزینه‌های قابل بررسی شما مرور می‌شود تا تصمیم دقیق‌تری بگیرید.',
      },
      durationMinutes: 45,
      priceAmount: 1200000,
      deliveryMethod: 'video',
      documentsNote: 'برای رزرو اولیه مدرکی لازم نیست. اگر کارشناس به مدرکی نیاز داشته باشد، آن را از داخل حساب کاربری و در پرونده مربوط بارگذاری می‌کنید.',
      paymentNote: 'بعد از ثبت رزرو، اطلاعات کارت نمایشی نشان داده می‌شود. رسید را بارگذاری کنید تا وضعیت پرداخت در پنل بررسی شود.',
      cancellationPolicy: 'برای نسخه نمایشی: جابه‌جایی جلسه تا ۲۴ ساعت پیش از زمان شروع امکان‌پذیر است. قانون نهایی باید توسط مدیریت تأیید شود.',
      benefits: [
        { title: 'انتخاب مسیر مناسب', description: 'گزینه‌ها بر اساس هدف سفر و اطلاعات اولیه شما دسته‌بندی می‌شوند.' },
        { title: 'کاهش خطاهای شروع پرونده', description: 'پیش از پرداخت هزینه خدمات، ابهام‌ها و مدارک پایه مرور می‌شوند.' },
        { title: 'جمع‌بندی قابل پیگیری', description: 'موضوع جلسه و وضعیت رزرو در حساب کاربری باقی می‌ماند.' },
      ],
      steps: [
        { title: 'انتخاب زمان', description: 'یکی از زمان‌های آزاد را انتخاب کنید.' },
        { title: 'ثبت موضوع', description: 'پرسش‌ها و هدف اصلی جلسه را کوتاه بنویسید.' },
        { title: 'ارسال رسید', description: 'اطلاعات پرداخت را ببینید و رسید نمایشی را بارگذاری کنید.' },
        { title: 'تأیید جلسه', description: 'پس از بررسی رسید، وضعیت رزرو تأیید می‌شود.' },
      ],
    } as never,
  })

  await payload.updateGlobal({
    slug: 'payment-settings',
    overrideAccess: true,
    data: {
      active: true,
      cardNumber: '0000000000000000',
      cardholderName: 'حساب نمایشی BoldTrip',
      bankName: 'بانک نمونه',
      iban: 'IR000000000000000000000000',
      instructions: 'این اطلاعات صرفاً برای نمایش به مشتری است و قابل پرداخت نیست. پیش از انتشار واقعی، اطلاعات مالی معتبر و قوانین تأیید پرداخت را جایگزین کنید.',
    },
  })

  const countryRecords = new Map<string, DemoRecord>()

  for (const [index, country] of countries.entries()) {
    const record = await upsert(payload, 'countries', 'code', country.code, {
      _status: 'published',
      name: country.name,
      slug: country.slug,
      code: country.code,
      flag: country.flag,
      summary: `اطلاعات نمونه مسیرهای ویزا و خدمات سفارت ${country.name} برای نمایش ساختار سایت.`,
      introduction: `در این صفحه می‌توانید مسیرهای نمایشی ویزای ${country.name}، مدارک پایه و مراحل ثبت درخواست را مرور کنید. اطلاعات این نسخه برای دمو است و قبل از استفاده واقعی باید با منابع رسمی بازبینی شود.`,
      featuredOnHomepage: index < 4,
      sortOrder: (index + 1) * 10,
      embassyAppointment: {
        enabled: true,
        acceptingRequests: true,
        title: `درخواست وقت سفارت ${country.name}`,
        summary: `مشاهده مراحل نمونه، ثبت اطلاعات متقاضی و پیگیری درخواست وقت سفارت ${country.name}.`,
        introduction: `پس از ثبت درخواست، تیم BoldTrip اطلاعات اولیه را بررسی می‌کند. ظرفیت، محل مراجعه و هزینه نهایی بسته به شرایط مرکز درخواست و نوع ویزا اعلام خواهد شد.`,
        requiredDocuments: [
          { title: 'تصویر صفحه مشخصات پاسپورت', description: 'پاسپورت باید معتبر و تصویر آن خوانا باشد.' },
          { title: 'اطلاعات تماس متقاضی', description: 'شماره موبایل و ایمیل در دسترس وارد شود.' },
          { title: 'اطلاعات نوع سفر', description: 'هدف سفر، بازه زمانی و نوع ویزای موردنظر مشخص شود.' },
        ],
        steps: [
          { title: 'ثبت درخواست', description: 'اطلاعات اولیه و کشور مقصد را در حساب کاربری ثبت کنید.' },
          { title: 'بارگذاری مدارک', description: 'فایل‌های درخواست‌شده را فقط در صفحه پرونده خود ارسال کنید.' },
          { title: 'بررسی و اعلام هزینه', description: 'کارشناس ظرفیت و جزئیات درخواست را بررسی می‌کند.' },
          { title: 'پرداخت و پیگیری', description: 'پس از اعلام مبلغ، رسید پرداخت را بارگذاری و وضعیت را پیگیری کنید.' },
        ],
        importantNotes: [
          { text: 'زمان خالی و نتیجه رزرو توسط سفارت یا مرکز رسمی تعیین می‌شود.' },
          { text: 'این محتوای نمایشی تضمین دریافت وقت یا صدور ویزا نیست.' },
        ],
        estimatedTime: 'وابسته به ظرفیت مرکز درخواست',
        feeNote: 'پس از بررسی پرونده اعلام می‌شود',
        officialSourceUrl: country.source,
        lastReviewedAt: reviewedAt,
      },
    })
    countryRecords.set(country.slug, record)
  }

  for (const country of countries) {
    const countryRecord = countryRecords.get(country.slug)
    if (!countryRecord) continue

    for (const [index, visa] of visaTemplates.entries()) {
      await upsert(payload, 'visas', 'slug', `${country.slug}-${visa.slug}`, {
        _status: 'published',
        country: countryRecord.id,
        title: `ویزای ${visa.label} ${country.name}`,
        category: visa.category,
        slug: `${country.slug}-${visa.slug}`,
        summary: `راهنمای نمایشی شرایط اولیه و مراحل درخواست ویزای ${visa.label} ${country.name}.`,
        suitableFor: visa.suitableFor,
        processingTime: 'زمان بررسی متغیر است؛ منبع رسمی را کنترل کنید',
        validity: 'بر اساس تصمیم مرجع صادرکننده',
        stayLength: visa.stayLength,
        feeNote: 'هزینه‌های دولتی، خدمات مرکز درخواست و خدمات BoldTrip جداگانه اعلام می‌شوند.',
        requirements: [
          { kind: 'required', title: 'پاسپورت معتبر', description: 'اعتبار موردنیاز باید پیش از اقدام از منبع رسمی کنترل شود.' },
          { kind: 'required', title: 'فرم و اطلاعات هویتی', description: 'تمام اطلاعات باید دقیق و مطابق مدارک رسمی باشد.' },
          { kind: 'conditional', title: 'مدارک مالی و شغلی', description: 'نوع و میزان مدارک به شرایط متقاضی و مسیر درخواست بستگی دارد.' },
          { kind: 'later', title: 'اطلاعات بیومتریک یا مراجعه حضوری', description: 'در صورت درخواست مرجع رسمی انجام می‌شود.' },
        ],
        steps: [
          { title: 'بررسی شرایط اولیه', description: 'نوع ویزا و هدف سفر را انتخاب کنید.' },
          { title: 'تکمیل اطلاعات و مدارک', description: 'چک‌لیست اختصاصی پرونده را تکمیل کنید.' },
          { title: 'بازبینی و اقدام', description: 'پس از تأیید اطلاعات، مراحل رسمی درخواست دنبال می‌شود.' },
          { title: 'پیگیری نتیجه', description: 'وضعیت پرونده و درخواست‌های تکمیلی را از حساب خود ببینید.' },
        ],
        officialSourceLabel: `منبع رسمی ${country.name}`,
        officialSourceUrl: country.source,
        lastReviewedAt: reviewedAt,
        disclaimer: 'این صفحه محتوای نمایشی است. شرایط و هزینه‌ها ممکن است تغییر کنند و تصمیم نهایی فقط با مرجع رسمی است.',
        sortOrder: (index + 1) * 10,
      })
    }
  }

  const serviceRecords = new Map<string, DemoRecord>()
  for (const [index, service] of services.entries()) {
    const record = await upsert(payload, 'services', 'slug', service.slug, {
      ...service,
      _status: 'published',
      sortOrder: (index + 1) * 10,
      benefits: [
        { title: 'مسیر مشخص', description: 'هر مرحله و اقدام بعدی در حساب کاربری نمایش داده می‌شود.' },
        { title: 'بررسی توسط کارشناس', description: 'اطلاعات و مدارک ثبت‌شده پیش از ادامه مسیر کنترل می‌شوند.' },
        { title: 'پیگیری متمرکز', description: 'درخواست، مدارک و وضعیت پرداخت در یک پرونده باقی می‌مانند.' },
      ],
      steps: [
        { title: 'ثبت درخواست', description: 'خدمت را انتخاب و اطلاعات اولیه را کامل کنید.' },
        { title: 'ارسال مدارک', description: 'فقط مدارک درخواست‌شده را از صفحه پرونده بارگذاری کنید.' },
        { title: 'بررسی و اعلام هزینه', description: 'کارشناس نتیجه بررسی و مبلغ قابل پرداخت را ثبت می‌کند.' },
        { title: 'پرداخت و شروع خدمت', description: 'رسید را ارسال کنید؛ پس از تأیید، انجام خدمت آغاز می‌شود.' },
      ],
    })
    serviceRecords.set(service.slug, record)
  }

  payload.logger.info('Published 6 country/embassy guides, 18 visa pages and 5 services. Demo embassy requests are enabled.')

  if (process.argv.includes('--content-only')) {
    payload.logger.info('Demo content complete. Restart the app and open /embassy-appointments/canada.')
    await payload.destroy()
    return
  }

  const customer = await upsert(payload, 'customers', 'email', 'customer.demo@boldtrip.local', {
    email: 'customer.demo@boldtrip.local',
    password: 'DemoCustomer123!',
    name: 'مشتری نمایشی',
    mobile: '09120000001',
  })

  const request = await upsert(payload, 'service-requests', 'reference', 'BT-DEMO-001', {
    reference: 'BT-DEMO-001',
    customer: customer.id,
    requestType: 'service',
    service: serviceRecords.get('visa')?.id,
    status: 'awaitingPayment',
    submittedAt: reviewedAt,
    applicant: {
      fullName: 'متقاضی نمونه',
      mobile: '09120000001',
      email: 'customer.demo@boldtrip.local',
      nationality: 'ایرانی',
      passportNumber: 'DEMO000001',
      applicantsCount: 1,
    },
    customerMessage: 'این پرونده فقط برای نمایش روند ثبت درخواست و پیگیری وضعیت ساخته شده است.',
    quotedAmount: 3500000,
    staffNote: 'داده نمایشی؛ برای پرونده واقعی استفاده نشود.',
  })

  await upsert(payload, 'service-requests', 'reference', 'BT-DEMO-002', {
    reference: 'BT-DEMO-002',
    customer: customer.id,
    requestType: 'embassyAppointment',
    country: countryRecords.get('germany')?.id,
    status: 'underReview',
    submittedAt: reviewedAt,
    applicant: {
      fullName: 'متقاضی نمونه',
      mobile: '09120000001',
      email: 'customer.demo@boldtrip.local',
      nationality: 'ایرانی',
      passportNumber: 'DEMO000001',
      applicantsCount: 1,
    },
    customerMessage: 'درخواست نمونه وقت سفارت آلمان برای نمایش پنل مشتری.',
    staffNote: 'در انتظار بررسی ظرفیت نمایشی.',
  })

  const slots: DemoRecord[] = []
  for (const [index, day] of [2, 3, 5, 7, 9, 10].entries()) {
    const startsAt = futureSlot(day, index % 2 === 0 ? 10 : 14)
    slots.push(await upsert(payload, 'consultation-slots', 'startsAt', startsAt, {
      startsAt,
      durationMinutes: 45,
      deliveryMethod: 'video',
      priceAmount: 1200000,
      active: true,
    }))
  }

  const booking = await upsert(payload, 'consultation-bookings', 'reference', 'BC-DEMO-001', {
    reference: 'BC-DEMO-001',
    customer: customer.id,
    slot: slots[0].id,
    reservationKey: String(slots[0].id),
    startsAt: slots[0].startsAt,
    durationMinutes: 45,
    deliveryMethod: 'video',
    amount: 1200000,
    topic: 'بررسی مسیر تحصیلی کانادا',
    customerNote: 'رزرو نمونه برای نمایش وضعیت پرداخت و پیگیری جلسه.',
    status: 'confirmed',
  })

  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64',
  )

  const uploadDemo = async (
    collection: 'customer-documents' | 'payment-receipts',
    filename: string,
    data: Record<string, unknown>,
  ) => {
    const existing = await payload.find({
      collection,
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) return

    await payload.create({
      collection,
      data: data as never,
      file: {
        data: pixel,
        mimetype: 'image/png',
        name: filename,
        size: pixel.length,
      },
      overrideAccess: true,
    })
  }

  await uploadDemo('customer-documents', 'demo-passport.png', {
    customer: customer.id,
    serviceRequest: request.id,
    label: 'تصویر پاسپورت نمایشی',
    kind: 'passport',
    status: 'accepted',
    reviewerNote: 'فایل نمونه است و اطلاعات واقعی ندارد.',
  })

  await uploadDemo('payment-receipts', 'demo-payment-receipt.png', {
    customer: customer.id,
    payableType: 'consultation',
    consultationBooking: booking.id,
    amount: 1200000,
    paidAt: reviewedAt,
    note: 'رسید نمایشی',
    status: 'approved',
    reviewerNote: 'پرداخت برای نمایش تأیید شده است.',
  })

  payload.logger.info('Demo seed complete.')
  payload.logger.info('Customer: customer.demo@boldtrip.local / DemoCustomer123!')
  await payload.destroy()
}

await seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
