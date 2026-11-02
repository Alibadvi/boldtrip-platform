import { z } from 'zod'
import { isValidPhoneNumber, normalizePhoneNumber } from '@/modules/identity/domain/customer'

export const assessmentSchema = z
  .object({
    whatsapp: z
      .string()
      .trim()
      .transform(normalizePhoneNumber)
      .refine(isValidPhoneNumber, 'شماره واتس‌اپ معتبر وارد کنید.'),
    age: z.coerce.number().int().min(1).max(110),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
    education: z.string().trim().min(2).max(160),
    occupation: z.string().trim().min(2).max(160),
    travelHistory: z.string().trim().min(2).max(2000),
    refusals: z.string().trim().min(2).max(2000),
    destination: z.string().trim().min(2).max(120),
    visaType: z.string().trim().min(2).max(120),
    budget: z.string().trim().min(1).max(120),
    consent: z.literal(true),
  })
  .strict()

export type AssessmentInput = z.infer<typeof assessmentSchema>

export const assessmentLabels: Record<keyof AssessmentInput, string> = {
  whatsapp: 'واتس‌اپ',
  age: 'سن',
  maritalStatus: 'وضعیت تأهل',
  education: 'تحصیلات',
  occupation: 'شغل',
  travelHistory: 'سابقه سفر',
  refusals: 'سابقه ریجکتی',
  destination: 'کشور مقصد',
  visaType: 'نوع ویزا',
  budget: 'بودجه تقریبی',
  consent: 'تأیید حریم خصوصی',
}
export const maritalStatusLabels = {
  single: 'مجرد',
  married: 'متأهل',
  divorced: 'جداشده',
  widowed: 'همسر فوت‌شده',
}
