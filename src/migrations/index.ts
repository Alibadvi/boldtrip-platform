import * as migration_20260902_172155_catalog_countries_visas from './20260902_172155_catalog_countries_visas';
import * as migration_20260908_062240_production_security from './20260908_062240_production_security';

export const migrations = [
  {
    up: migration_20260902_172155_catalog_countries_visas.up,
    down: migration_20260902_172155_catalog_countries_visas.down,
    name: '20260902_172155_catalog_countries_visas',
  },
  {
    up: migration_20260908_062240_production_security.up,
    down: migration_20260908_062240_production_security.down,
    name: '20260908_062240_production_security'
  },
];
