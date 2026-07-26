export type Gender = 'male' | 'female';
export type Tradition = 'vietnamese' | 'trung-chau' | 'custom';

export interface CalculateInput {
  localDateTime: string;
  timezoneOffsetMinutes: number;
  gender: Gender;
  trueSolarTime?: boolean;
  location?: { city?: string; longitude?: number };
  tradition?: Tradition;
  asOfYear?: number;
  asOfDate?: string;
  include?: {
    daiHan?: boolean;
    tieuHan?: boolean;
    luuNien?: boolean;
    luuNguyet?: boolean;
    luuNhat?: boolean;
    phiHoa?: boolean;
  };
}

export interface Star {
  code: string;
  nameVi: string;
  kind: 'major' | 'auxiliary' | 'transformation';
  palaceIndex: number;
  element?: string;
  yinYang?: 'yin' | 'yang';
  group?: string;
}

export interface Palace {
  code: string;
  nameVi: string;
  index: number;
  branch: string;
  isMenh: boolean;
  isThan: boolean;
  stars: string[];
}

export interface ChartFact {
  code: string;
  text: { vi: string; en: string };
  evidence: string[];
}

export interface ChartWarning {
  code: string;
  message: { vi: string; en: string };
  severity: 'info' | 'warning';
}

export interface PhiHoaFlight {
  code: string;
  sourcePalaceIndex: number;
  targetPalaceIndex: number;
  sourceStem: string;
  starCode: string;
  transformation: 'loc' | 'quyen' | 'khoa' | 'ky';
}

export interface ProvenanceSource {
  url: string;
  role: 'implemented-rule' | 'reference-only' | 'comparison-oracle';
}

export interface TuViChart {
  input: CalculateInput;
  palaces: Palace[];
  stars: Star[];
  cuc: { code: string; nameVi: string; element: string; number: number };
  metadata: {
    engine: string;
    version: string;
    schemaVersion: string;
    ruleSetVersion: string;
    methodology: string;
    calculatedAt: string;
    capabilities: string[];
    sources: ProvenanceSource[];
  };
  audit: { rule: string; value: string; source: string; version: string }[];
  timeline: {
    daiHan?: { startAge: number; endAge: number; palaceIndex: number }[];
    tieuHan?: { year: number; nominalAge: number; palaceIndex: number };
    luuNien?: { year: number; palaceIndex: number }[];
    luuNguyet?: { asOfDate: string; lunarMonth: number; palaceIndex: number };
    luuNhat?: { asOfDate: string; lunarDay: number; palaceIndex: number };
  };
  relations: {
    code: string;
    type: 'xung' | 'tam-hop' | 'luc-hop' | 'chieu';
    from: number;
    to: number;
  }[];
  facts: ChartFact[];
  warnings: ChartWarning[];
  phiHoa?: PhiHoaFlight[];
}
