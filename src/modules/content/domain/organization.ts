type Contact = { phone: string; email: string; instagram: string; telegram: string }

export function organizationSchema(contact: Contact) {
  const instagram = contact.instagram.replace(/^@/, '')
  const telegram = contact.telegram.replace(/^@/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://boldtrip.ir/#organization',
    name: 'BoldTrip',
    url: 'https://boldtrip.ir',
    logo: 'https://boldtrip.ir/assets/boldtrip-official.jpg',
    telephone: contact.phone,
    email: contact.email,
    sameAs: [
      ...(/^[a-zA-Z0-9_.]+$/.test(instagram) ? [`https://www.instagram.com/${instagram}/`] : []),
      ...(/^[a-zA-Z0-9_]+$/.test(telegram) ? [`https://t.me/${telegram}`] : []),
    ],
  }
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
