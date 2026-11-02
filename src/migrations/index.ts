import * as migration_20260902_172155_catalog_countries_visas from './20260902_172155_catalog_countries_visas';
import * as migration_20260908_062240_production_security from './20260908_062240_production_security';
import * as migration_20261010_072005_boldtrip_content_updates from './20261010_072005_boldtrip_content_updates';
import * as migration_20261102_055330_assessment_request_flows from './20261102_055330_assessment_request_flows';

export const migrations = [
  {
    up: migration_20260902_172155_catalog_countries_visas.up,
    down: migration_20260902_172155_catalog_countries_visas.down,
    name: '20260902_172155_catalog_countries_visas',
  },
  {
    up: migration_20260908_062240_production_security.up,
    down: migration_20260908_062240_production_security.down,
    name: '20260908_062240_production_security',
  },
  {
    up: migration_20261010_072005_boldtrip_content_updates.up,
    down: migration_20261010_072005_boldtrip_content_updates.down,
    name: '20261010_072005_boldtrip_content_updates',
  },
  {
    up: migration_20261102_055330_assessment_request_flows.up,
    down: migration_20261102_055330_assessment_request_flows.down,
    name: '20261102_055330_assessment_request_flows'
  },
];
