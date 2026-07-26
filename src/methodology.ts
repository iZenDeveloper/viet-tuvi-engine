import type { ProvenanceSource } from './types.js';

const methodologySources: ProvenanceSource[] = [
  { url: 'https://tuvibacphai.com/tuvi', role: 'comparison-oracle' },
  { url: 'https://tuvivietnam.vn/so-luoc-ve-lich-su-tu-vi-trung-hoa-noi-chung-va-trung-chau-phai-noi-rieng/', role: 'reference-only' },
  { url: 'https://tuvivietnam.vn/trung-chau-phai/', role: 'reference-only' },
  { url: 'https://tuvitrungchau.com', role: 'reference-only' }
];

export const capabilities = () => ({
  engine: 'viet-tuvi-engine',
  version: '0.1.0',
  schemaVersion: '0.1.0',
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
  engineVersion: '0.1.0',
  schemaVersion: '0.1.0',
  ruleSetVersion: 'vn-popular-0.2',
  sources: methodologySources,
  rules: {
    calendar: 'vn-astronomical-lunar-1',
    wasmCalendar: 'wasm-calendar-abi-1',
    trueSolarTime: 'longitude-eot-approx-1',
    palaces: 'menh-than-lunar-month-hour-1',
    cuc: 'jiazi-nayin-2',
    majorStars: 'tuvi-thienphu-groups-1',
    transformations: 'ten-stem-tu-hoa-1',
    phiHoa: 'palace-stem-phi-hoa-1',
    timelines: 'daihan-luunien-baseline-1'
  }
});

export const methodologyResourceText = () => JSON.stringify(getMethodologyManifest(), null, 2);
