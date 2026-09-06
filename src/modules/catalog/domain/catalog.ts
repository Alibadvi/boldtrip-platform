export const visaCategories = [
  'visitor',
  'study',
  'work',
  'family',
  'transit',
  'other',
] as const

export type VisaCategory = (typeof visaCategories)[number]

export const visaCategoryLabels: Record<VisaCategory, string> = {
  visitor: 'توریستی و بازدید',
  study: 'تحصیلی',
  work: 'کاری',
  family: 'خانوادگی',
  transit: 'ترانزیت',
  other: 'سایر',
}

export const visaRequirementKinds = [
  'required',
  'conditional',
  'later',
] as const

export type VisaRequirementKind =
  (typeof visaRequirementKinds)[number]

export const visaRequirementKindLabels: Record<
  VisaRequirementKind,
  string
> = {
  required: 'الزامی',
  conditional: 'بسته به شرایط متقاضی',
  later: 'در مرحله بعد',
}

export type CatalogId = number | string

export type EmbassyAppointmentDocument = {
  title: string
  description?: string
}

export type EmbassyAppointmentStep = {
  title: string
  description: string
}

export type EmbassyAppointmentNote = {
  text: string
}

export type EmbassyAppointmentGuide = {
  enabled: boolean
  acceptingRequests: boolean
  title?: string
  summary?: string
  introduction?: string
  estimatedTime?: string
  feeNote?: string
  officialSourceUrl?: string
  lastReviewedAt?: string
  requiredDocuments: EmbassyAppointmentDocument[]
  steps: EmbassyAppointmentStep[]
  importantNotes: EmbassyAppointmentNote[]
}

export type Country = {
  code: string
  featuredOnHomepage: boolean
  flag: string
  id: CatalogId
  introduction: string
  name: string
  slug: string
  summary: string
  embassyAppointment?: EmbassyAppointmentGuide
}

export type VisaRequirement = {
  description?: string
  kind: VisaRequirementKind
  title: string
}

export type VisaStep = {
  description: string
  title: string
}

export type VisaSummary = {
  category: VisaCategory
  id: CatalogId
  processingTime?: string
  slug: string
  summary: string
  title: string
}

export type VisaDetail = VisaSummary & {
  disclaimer?: string
  feeNote?: string
  lastReviewedAt: string
  officialSourceLabel: string
  officialSourceUrl: string
  requirements: VisaRequirement[]
  stayLength?: string
  steps: VisaStep[]
  suitableFor?: string
  validity?: string
}

export type CountryPageData = {
  country: Country
  visas: VisaSummary[]
}

export type VisaPageData = {
  country: Country
  visa: VisaDetail
}

export function isCatalogSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function groupVisaRequirements(
  requirements: VisaRequirement[],
) {
  return visaRequirementKinds.map((kind) => ({
    kind,
    requirements: requirements.filter(
      (requirement) => requirement.kind === kind,
    ),
  }))
}