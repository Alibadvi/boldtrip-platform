import type { GlobalConfig, PayloadRequest } from 'payload'

import { can, getStaffRoles } from '@/modules/identity'

const canEdit = ({ req }: { req: PayloadRequest }) => can(getStaffRoles(req.user), 'content.manage')

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'راه‌های ارتباطی',
  admin: { group: 'محتوا' },
  access: { read: () => true, update: canEdit },
  fields: [
    {
      name: 'instagram',
      type: 'text',
      label: 'شناسه اینستاگرام',
      required: true,
      defaultValue: 'boldtrip.visa',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'تلفن (فرمت بین‌المللی)',
      required: true,
      defaultValue: '+989104787878',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'واتس‌اپ (فرمت بین‌المللی)',
      required: true,
      defaultValue: '+989104787878',
    },
    {
      name: 'telegram',
      type: 'text',
      label: 'شناسه تلگرام',
      required: true,
      defaultValue: 'boldtrip4444',
    },
    {
      name: 'email',
      type: 'email',
      label: 'ایمیل',
      required: true,
      defaultValue: 'boldtrip4444@gmail.com',
    },
  ],
}
