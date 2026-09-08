import { RequestAdminLinks } from '../../../modules/cases/presentation/request-admin-links'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { AdminIcon, AdminLogo, AdminNavIntro } from '../_components/admin-brand'
import { AdminDashboard } from '../_components/admin-dashboard'

/** @type import('payload').ImportMap */
export const importMap = {
  '/modules/cases/presentation/request-admin-links#RequestAdminLinks': RequestAdminLinks,
  '/app/(payload)/_components/admin-brand#AdminIcon': AdminIcon,
  '/app/(payload)/_components/admin-brand#AdminLogo': AdminLogo,
  '/app/(payload)/_components/admin-brand#AdminNavIntro': AdminNavIntro,
  '/app/(payload)/_components/admin-dashboard#AdminDashboard': AdminDashboard,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
}
