export { getCustomerDocuments } from './application/get-customer-documents'

export {
  documentKinds,
  documentKindLabels,
  documentStatuses,
  documentStatusLabels,
  documentStatusTones,
} from './domain/customer-document'

export type {
  CustomerDocument,
  DocumentKind,
  DocumentStatus,
} from './domain/customer-document'

export { CustomerDocuments } from './infrastructure/payload/customer-documents.collection'
export { DocumentUploadForm } from './presentation/document-upload-form'
