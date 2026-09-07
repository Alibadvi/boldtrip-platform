import type { CollectionSlug, PayloadRequest, Where } from 'payload'

type QueueDefinition = {
  collection: string
  title: string
  description: string
  empty: string
  tone: 'amber' | 'violet' | 'blue' | 'green'
  where: Where
  query: Record<string, string>
  sort: string
}

export type DashboardQueue = QueueDefinition & {
  href: string
  total: number | null
  items: { id: string; title: string; detail: string; href: string }[]
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function sessionDate(value: unknown): string {
  const date = new Date(text(value))
  if (Number.isNaN(date.getTime())) return 'زمان جلسه ثبت نشده'

  return new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export async function getDashboardQueues(
  req: PayloadRequest,
  visibleCollections: readonly string[],
): Promise<DashboardQueue[]> {
  if (req.user?.collection !== 'staff' || req.user.accountStatus !== 'active') return []

  const now = new Date()
  const until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const definitions: QueueDefinition[] = [
    {
      collection: 'payment-receipts',
      title: 'رسیدهای منتظر تأیید',
      description: 'رسید را با واریز بانکی تطبیق دهید و نتیجه بررسی را ثبت کنید.',
      empty: 'رسیدی در انتظار بررسی نیست.',
      tone: 'amber',
      where: { status: { equals: 'pending' } },
      query: { 'where[status][equals]': 'pending' },
      sort: 'createdAt',
    },
    {
      collection: 'service-requests',
      title: 'درخواست‌های جدید',
      description: 'اطلاعات متقاضی را بررسی کنید و مرحله بعد را مشخص کنید.',
      empty: 'درخواست جدیدی در انتظار بررسی نیست.',
      tone: 'violet',
      where: { status: { equals: 'submitted' } },
      query: { 'where[status][equals]': 'submitted' },
      sort: 'submittedAt',
    },
    {
      collection: 'customer-documents',
      title: 'مدارک منتظر بررسی',
      description: 'مدرک را بررسی کنید؛ اگر نیاز به اصلاح دارد، دلیل را بنویسید.',
      empty: 'مدرکی در انتظار بررسی نیست.',
      tone: 'blue',
      where: { status: { equals: 'pending' } },
      query: { 'where[status][equals]': 'pending' },
      sort: 'createdAt',
    },
    {
      collection: 'consultation-bookings',
      title: 'جلسات هفت روز آینده',
      description: 'جلسات تأییدشده، به ترتیب نزدیک‌ترین زمان؛ ساعت تهران.',
      empty: 'جلسه تأییدشده‌ای برای هفت روز آینده ندارید.',
      tone: 'green',
      where: {
        status: { equals: 'confirmed' },
        startsAt: { greater_than_equal: now.toISOString(), less_than: until.toISOString() },
      },
      query: {
        'where[status][equals]': 'confirmed',
        'where[startsAt][greater_than_equal]': now.toISOString(),
        'where[startsAt][less_than]': until.toISOString(),
      },
      sort: 'startsAt',
    },
  ]

  const allowed = definitions.filter(({ collection }) => visibleCollections.includes(collection))
  const results = await Promise.allSettled(allowed.map((queue) => req.payload.find({
    collection: queue.collection as CollectionSlug,
    where: queue.where,
    sort: queue.sort,
    limit: 4,
    depth: 0,
    overrideAccess: false,
    req,
  })))

  return allowed.map((queue, index) => {
    const base = `${req.payload.config.routes.admin}/collections/${queue.collection}`
    const result = results[index]
    const query = new URLSearchParams({ ...queue.query, sort: queue.sort })
    const docs = result?.status === 'fulfilled'
      ? result.value.docs as unknown as Record<string, unknown>[]
      : []

    return {
      ...queue,
      href: `${base}?${query}`,
      // A failed read is not an empty queue.
      total: result?.status === 'fulfilled' ? result.value.totalDocs : null,
      items: docs.map((doc) => ({
        id: String(doc.id),
        title: text(doc.reference) || text(doc.label) || text(doc.filename) || 'مشاهده جزئیات',
        detail: queue.collection === 'consultation-bookings'
          ? `${sessionDate(doc.startsAt)} · ${text(doc.topic)}`
          : queue.collection === 'payment-receipts'
            ? typeof doc.amount === 'number'
              ? `${new Intl.NumberFormat('fa-IR').format(doc.amount)} تومان`
              : 'بررسی مبلغ و رسید'
            : queue.collection === 'service-requests'
              ? doc.requestType === 'embassyAppointment' ? 'وقت سفارت' : 'درخواست خدمت'
              : 'نیاز به بررسی کارشناس',
        href: `${base}/${encodeURIComponent(String(doc.id))}`,
      })),
    }
  })
}
