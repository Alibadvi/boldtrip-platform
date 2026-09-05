import type { PayloadRequest } from 'payload'

import { can, getStaffRoles } from '@/modules/identity'

export const canManageCatalog = ({ req }: { req: PayloadRequest }) =>
  can(getStaffRoles(req.user), 'content.manage')

export const readPublishedCatalog = ({ req }: { req: PayloadRequest }) => {
  if (canManageCatalog({ req })) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
