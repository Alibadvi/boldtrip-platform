import * as migration_20260902_172155_catalog_countries_visas from './20260902_172155_catalog_countries_visas'

export const migrations = [
  {
    up: migration_20260902_172155_catalog_countries_visas.up,
    down: migration_20260902_172155_catalog_countries_visas.down,
    name: '20260902_172155_catalog_countries_visas',
  },
]
