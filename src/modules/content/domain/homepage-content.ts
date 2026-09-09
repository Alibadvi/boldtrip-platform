export const faqCategories = ['visa-services', 'documents', 'consultation-payment'] as const

export type FaqCategory = (typeof faqCategories)[number]

export type HomepageContent = {
  consultation: {
    actionHref: string
    actionLabel: string
    description: string
    kicker: string
    title: string
  }
  destinationIntro: {
    description: string
    kicker: string
    title: string
  }
  faqIntro: {
    description: string
    kicker: string
    title: string
  }
  faqs: Array<{
    answer: string
    category: FaqCategory
    question: string
    showOnHomepage: boolean
  }>
  hero: {
    accent: string
    description: string
    highlights: Array<{ label: string }>
    kicker: string
    primaryActionHref: string
    primaryActionLabel: string
    secondaryActionHref: string
    secondaryActionLabel: string
    title: string
  }
  process: {
    description: string
    kicker: string
    steps: Array<{
      description: string
      number: string
      title: string
    }>
    title: string
  }
  serviceIntro: {
    description: string
    kicker: string
    title: string
  }
  services: Array<{
    actionLabel: string
    description: string
    eyebrow: string
    href: string
    index: string
    title: string
  }>
  trust: {
    actionHref: string
    actionLabel: string
    description: string
    kicker: string
    title: string
  }
}

export const defaultHomepageContent: HomepageContent = {
  hero: {
    kicker: 'مسیر روشن خدمات ویزا',
    title: 'برای ویزا و وقت سفارت،',
    accent: 'سردرگم شروع نکنید.',
    description:
      'شرایط کانادا و شینگن را بررسی کنید، خدمت مناسب را انتخاب کنید و ادامه مسیر را مرحله‌به‌مرحله در حساب خود پیگیری کنید.',
    primaryActionLabel: 'مشاهده ویزاها',
    primaryActionHref: '/countries',
    secondaryActionLabel: 'رزرو مشاوره',
    secondaryActionHref: '/consultation/book',
    highlights: [
      { label: 'اطلاعات بازبینی‌شده' },
      { label: 'ارسال خصوصی مدارک' },
      { label: 'پیگیری شفاف پرونده' },
    ],
  },
  destinationIntro: {
    kicker: 'مقصدهای شروع',
    title: 'شرایط مقصد را قبل از اقدام بشناسید',
    description: 'توضیحات هر مقصد، مدارک پایه، مراحل اقدام و خدمات مرتبط را در یک صفحه ببینید.',
  },
  serviceIntro: {
    kicker: 'چه کاری برای شما انجام می‌دهیم؟',
    title: 'از اطلاعات اولیه تا اقدام واقعی',
    description: 'هر خدمت، مسیر مشخص خودش را دارد؛ بدون فرم‌های پراکنده و پیگیری نامعلوم.',
  },
  services: [
    {
      eyebrow: 'برای یک تصمیم دقیق',
      href: '/consultation',
      index: '01',
      title: 'مشاوره تخصصی',
      description:
        'زمان‌های آزاد را ببینید، موضوع جلسه را مشخص کنید و مشاوره خود را آنلاین رزرو کنید.',
      actionLabel: 'مشاهده زمان‌های مشاوره',
    },
    {
      eyebrow: 'برای شروع پرونده',
      href: '/services/visa',
      index: '02',
      title: 'خدمات ویزا',
      description:
        'شرایط مقصد را بخوانید، مدارک لازم را بشناسید و درخواست خود را مرحله‌به‌مرحله ثبت کنید.',
      actionLabel: 'بررسی خدمات ویزا',
    },
    {
      eyebrow: 'برای هماهنگی سفارت',
      href: '/embassy-appointments',
      index: '03',
      title: 'وقت سفارت',
      description:
        'کشور مقصد را انتخاب کنید، اطلاعات و مدارک را ارسال کنید و وضعیت درخواست را پیگیری کنید.',
      actionLabel: 'درخواست وقت سفارت',
    },
  ],
  process: {
    kicker: 'روند کار',
    title: 'بدانید الان کجای مسیر هستید',
    description: 'از اولین بررسی تا پایان خدمت، وضعیت پرونده و اقدام بعدی برای شما مشخص می‌ماند.',
    steps: [
      {
        number: '۱',
        title: 'مقصد یا خدمت را انتخاب کنید',
        description: 'اطلاعات بازبینی‌شده و شرایط هر مسیر را قبل از شروع بخوانید.',
      },
      {
        number: '۲',
        title: 'فرم و مدارک را کامل کنید',
        description: 'فقط اطلاعات موردنیاز همان خدمت را در یک مسیر مرحله‌ای ارسال کنید.',
      },
      {
        number: '۳',
        title: 'هزینه را انتقال دهید',
        description: 'مبلغ و اطلاعات پرداخت را ببینید و تصویر رسید را در پرونده بارگذاری کنید.',
      },
      {
        number: '۴',
        title: 'وضعیت را پیگیری کنید',
        description: 'اقدام بعدی، درخواست اصلاح مدرک و تغییر وضعیت پرونده را یک‌جا ببینید.',
      },
    ],
  },
  trust: {
    kicker: 'اطلاعات حساس، مسیر مسئولانه',
    title: 'قبل از ارسال مدرک، دلیل نیاز به آن را می‌بینید',
    description:
      'گذرنامه و مدارک مالی فایل عادی نیستند. در هر درخواست، فهرست مدارک همان خدمت نمایش داده می‌شود و فایل‌های اصلاحی نیز داخل همان پرونده باقی می‌مانند.',
    actionLabel: 'سیاست حریم خصوصی و مدارک',
    actionHref: '/privacy',
  },
  consultation: {
    kicker: 'اگر هنوز مطمئن نیستید',
    title: 'قبل از شروع پرونده، مسیر مناسب را مشخص کنید.',
    description: 'موضوع جلسه را انتخاب کنید و یکی از زمان‌های آزاد مشاوره را رزرو کنید.',
    actionLabel: 'مشاهده زمان‌های آزاد',
    actionHref: '/consultation/book',
  },
  faqIntro: {
    kicker: 'پاسخ‌های کوتاه و روشن',
    title: 'سوالات متداول',
    description: 'پیش از ثبت درخواست، پاسخ مهم‌ترین سوال‌ها را اینجا بخوانید.',
  },
  faqs: [
    {
      category: 'visa-services',
      showOnHomepage: true,
      question: 'آیا بلدتریپ صدور ویزا را تضمین می‌کند؟',
      answer:
        'خیر. تصمیم نهایی همیشه با سفارت یا مرجع رسمی مهاجرت است. بلدتریپ اطلاعات، آماده‌سازی پرونده و خدمات درخواستی را با مسیر مشخص انجام می‌دهد و هیچ تضمین غیرواقعی ارائه نمی‌کند.',
    },
    {
      category: 'visa-services',
      showOnHomepage: true,
      question: 'در نسخه فعلی برای چه مقصدهایی خدمات ارائه می‌شود؟',
      answer:
        'محتوای اولیه سایت برای کانادا و حوزه شینگن طراحی شده است. در خدمات شینگن، کشور مقصد اصلی باید هنگام ثبت درخواست مشخص شود.',
    },
    {
      category: 'visa-services',
      showOnHomepage: false,
      question: 'خدمت وقت سفارت دقیقا شامل چه کاری است؟',
      answer:
        'پس از انتخاب کشور، اطلاعات و مدارک موردنیاز را ارسال می‌کنید. تیم پرونده درخواست را بررسی و مراحل هماهنگی وقت را انجام می‌دهد. این سامانه به‌صورت خودکار وارد وب‌سایت سفارت نمی‌شود.',
    },
    {
      category: 'documents',
      showOnHomepage: true,
      question: 'مدارک را در کدام بخش بارگذاری می‌کنم؟',
      answer:
        'مدارک اولیه داخل فرم مرحله‌ای همان درخواست ارسال می‌شوند. اگر بعدا اصلاح یا مدرک دیگری لازم باشد، آن را در صفحه جزئیات پرونده خود بارگذاری می‌کنید.',
    },
    {
      category: 'documents',
      showOnHomepage: false,
      question: 'اگر یکی از مدارک من تایید نشود چه اتفاقی می‌افتد؟',
      answer:
        'دلیل نیاز به اصلاح در پرونده نمایش داده می‌شود. نسخه جدید را در همان بخش بارگذاری می‌کنید تا دوباره بررسی شود.',
    },
    {
      category: 'documents',
      showOnHomepage: false,
      question: 'چطور وضعیت درخواست را پیگیری کنم؟',
      answer:
        'پس از ورود به حساب کاربری، درخواست‌های فعال، وضعیت فعلی و اقدام بعدی را در بخش پرونده‌های من می‌بینید.',
    },
    {
      category: 'consultation-payment',
      showOnHomepage: true,
      question: 'پرداخت هزینه خدمات چگونه انجام می‌شود؟',
      answer:
        'پس از ثبت درخواست یا رزرو، مبلغ و اطلاعات انتقال نمایش داده می‌شود. رسید پرداخت را بارگذاری می‌کنید و پس از بررسی مالی، وضعیت آن در حساب کاربری اعلام می‌شود.',
    },
    {
      category: 'consultation-payment',
      showOnHomepage: true,
      question: 'چطور برای مشاوره وقت رزرو کنم؟',
      answer:
        'موضوع مشاوره را انتخاب می‌کنید، زمان‌های آزاد را می‌بینید و پس از انتخاب روز و ساعت، اطلاعات خود را تکمیل می‌کنید.',
    },
    {
      category: 'consultation-payment',
      showOnHomepage: false,
      question: 'آیا می‌توانم زمان مشاوره را تغییر دهم؟',
      answer:
        'امکان تغییر یا لغو بر اساس قوانین رزرو و بازه زمانی اعلام‌شده برای جلسه خواهد بود. جزئیات پیش از نهایی‌کردن رزرو نمایش داده می‌شود.',
    },
  ],
}
