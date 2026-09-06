export {
  getCountries,
  getCountryPage,
  getEmbassyAppointmentCountries,
  getEmbassyAppointmentPage,
  getFeaturedCountries,
  getVisaPage,
} from './application/get-catalog-pages'

export {
  getServicePage,
  getServices,
} from './application/get-service-pages'

export {
  groupVisaRequirements,
  isCatalogSlug,
  isHttpsUrl,
  visaCategories,
  visaCategoryLabels,
  visaRequirementKindLabels,
  visaRequirementKinds,
} from './domain/catalog'

export type {
  Country,
  CountryPageData,
  EmbassyAppointmentDocument,
  EmbassyAppointmentGuide,
  EmbassyAppointmentNote,
  EmbassyAppointmentStep,
  VisaCategory,
  VisaDetail,
  VisaPageData,
  VisaRequirement,
  VisaRequirementKind,
  VisaStep,
  VisaSummary,
} from './domain/catalog'

export {
  getServicePriceLabel,
  serviceKindLabels,
  serviceKinds,
  servicePricingModeLabels,
  servicePricingModes,
} from './domain/service'

export type {
  ServiceBenefit,
  ServiceDetail,
  ServiceKind,
  ServicePricingMode,
  ServiceStep,
  ServiceSummary,
} from './domain/service'

export { Countries } from './infrastructure/payload/countries.collection'
export { Services } from './infrastructure/payload/services.collection'
export { Visas } from './infrastructure/payload/visas.collection'

export { CatalogBreadcrumbs } from './presentation/catalog-breadcrumbs'
export { getEmbassyCountryTheme } from './presentation/embassy-country-theme'