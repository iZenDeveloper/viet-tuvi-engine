import type { ProvenanceSource } from './types.js';
import {
  ENGINE_NAME,
  ENGINE_VERSION,
  RULE_SET_VERSION,
  RULE_VERSIONS,
  SCHEMA_VERSION
} from './version.js';

const methodologySources: ProvenanceSource[] = [
  { url: 'https://tuvibacphai.com/tuvi', role: 'comparison-oracle' },
  { url: 'https://tuvivietnam.vn/so-luoc-ve-lich-su-tu-vi-trung-hoa-noi-chung-va-trung-chau-phai-noi-rieng/', role: 'reference-only' },
  { url: 'https://tuvivietnam.vn/trung-chau-phai/', role: 'reference-only' },
  { url: 'https://tuvitrungchau.com', role: 'reference-only' }
];

export const capabilities = () => ({
  engine: ENGINE_NAME,
  version: ENGINE_VERSION,
  schemaVersion: SCHEMA_VERSION,
  offline: true,
  features: ['calculate', 'timeline', 'phi-hoa', 'compatibility', 'sensitivity', 'grounded-prompt', 'svg', 'mcp'],
  traditions: { vietnamese: 'baseline', 'trung-chau': 'fallback', custom: 'fallback' },
  timeline: {
    daiHan: 'baseline',
    tieuHan: 'baseline',
    luuNien: 'baseline',
    luuNguyet: 'baseline',
    luuNhat: 'baseline'
  },
  status: {
    core: 'stable-baseline',
    svg: 'available',
    mcp: 'available',
    python: 'available',
    phiHoa: 'baseline',
    wasm: 'available'
  }
});

export const getEngineCapabilities = capabilities;

export const getMethodologyManifest = () => ({
  engineVersion: ENGINE_VERSION,
  schemaVersion: SCHEMA_VERSION,
  ruleSetVersion: RULE_SET_VERSION,
  sources: methodologySources,
  rules: RULE_VERSIONS
});

export const methodologyResourceText = () => JSON.stringify(getMethodologyManifest(), null, 2);
