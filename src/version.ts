export const ENGINE_NAME = 'viet-tuvi-engine';
export const ENGINE_VERSION = '0.1.0';
export const SCHEMA_VERSION = '0.1.0';
export const RULE_SET_VERSION = 'vn-popular-0.2';

export const RULE_VERSIONS = {
  calendar: 'vn-astronomical-lunar-1',
  wasmCalendar: 'wasm-calendar-abi-1',
  trueSolarTime: 'longitude-eot-approx-1',
  palaces: 'menh-than-lunar-month-hour-1',
  cuc: 'jiazi-nayin-2',
  majorStars: 'tuvi-thienphu-groups-1',
  transformations: 'ten-stem-tu-hoa-1',
  phiHoa: 'palace-stem-phi-hoa-1',
  timelines: 'daihan-luunien-baseline-1'
} as const;
