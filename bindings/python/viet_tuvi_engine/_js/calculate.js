import { solarToVietnameseLunar } from './calendar.js';
import { branches, palaceNames } from './domain.js';
import { findCity } from './locations.js';
import { getMethodologyManifest } from './methodology.js';
import { buildRelations } from './relations.js';
import { calculateCuc, menhStem, stems } from './rules/cuc.js';
import { bacSiCycle, groupStarBranch, khoiVietBranches, lifeCycle, lifeStart, locTonBranch, thaiTueCycle } from './stars/auxiliary.js';
import { majorMetadata, majors, majorStarBranches, tuViBranch } from './stars/major.js';
import { hoaByCan } from './stars/transformations.js';
import { equationOfTimeMinutes, hourBranch, parseLocal } from './time.js';
import { minorLimitStart } from './timeline/rules.js';
import { ENGINE_NAME, ENGINE_VERSION, RULE_SET_VERSION, RULE_VERSIONS, SCHEMA_VERSION } from './version.js';
export function calculateTuVi(input) {
    if (!input || typeof input !== 'object' || typeof input.localDateTime !== 'string' || !input.localDateTime || !input.gender)
        throw new Error('localDateTime and gender are required');
    const inputKeys = ['localDateTime', 'timezoneOffsetMinutes', 'gender', 'trueSolarTime', 'location', 'tradition', 'asOfYear', 'asOfDate', 'include'];
    for (const key of Object.keys(input))
        if (!inputKeys.includes(key))
            throw new Error(`input.${key} is not supported`);
    if (input.gender !== 'male' && input.gender !== 'female')
        throw new Error('gender must be male or female');
    if (input.trueSolarTime !== undefined && typeof input.trueSolarTime !== 'boolean')
        throw new Error('trueSolarTime must be boolean');
    if (input.tradition && !['vietnamese', 'trung-chau', 'custom'].includes(input.tradition))
        throw new Error('tradition is not supported');
    if (input.asOfYear !== undefined && (!Number.isInteger(input.asOfYear) || input.asOfYear < 1 || input.asOfYear > 9999))
        throw new Error('asOfYear must be an integer from 1 to 9999');
    if (input.asOfDate !== undefined && (typeof input.asOfDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input.asOfDate)))
        throw new Error('asOfDate must use YYYY-MM-DD');
    if (input.location !== undefined && (typeof input.location !== 'object' || input.location === null))
        throw new Error('location must be an object');
    for (const key of Object.keys(input.location ?? {}))
        if (!['city', 'longitude'].includes(key))
            throw new Error(`location.${key} is not supported`);
    if (input.location?.city !== undefined && typeof input.location.city !== 'string')
        throw new Error('location.city must be a string');
    if (input.location?.longitude !== undefined && (!Number.isFinite(input.location.longitude) || input.location.longitude < -180 || input.location.longitude > 180))
        throw new Error('location.longitude must be from -180 to 180');
    if (input.include !== undefined && (typeof input.include !== 'object' || input.include === null))
        throw new Error('include must be an object');
    for (const [key, value] of Object.entries(input.include ?? {}))
        if (!['daiHan', 'tieuHan', 'luuNien', 'luuNguyet', 'luuNhat', 'phiHoa'].includes(key) || typeof value !== 'boolean')
            throw new Error(`include.${key} is not a supported boolean flag`);
    const date = parseLocal(input);
    const instant = new Date(date.getTime() - input.timezoneOffsetMinutes * 60000);
    const catalogCity = findCity(input.location?.city);
    const longitude = input.location?.longitude ?? catalogCity?.longitude;
    const standardMeridian = input.timezoneOffsetMinutes / 4;
    const longitudeCorrection = input.trueSolarTime && longitude !== undefined ? (longitude - standardMeridian) * 4 : 0;
    const equationCorrection = input.trueSolarTime && longitude !== undefined ? equationOfTimeMinutes(date) : 0;
    const solarCorrection = longitudeCorrection + equationCorrection;
    const effectiveDate = new Date(date.getTime() + solarCorrection * 60000);
    const year = effectiveDate.getUTCFullYear();
    const h = hourBranch(effectiveDate);
    const lunar = solarToVietnameseLunar(effectiveDate.getUTCDate(), effectiveDate.getUTCMonth() + 1, effectiveDate.getUTCFullYear(), input.timezoneOffsetMinutes / 60);
    const menhRaw = 2 + (lunar.month - 1) - h, menh = ((menhRaw % 12) + 12) % 12;
    const than = (2 + (lunar.month - 1) + h) % 12;
    const { yearStemIndex: can, palaceStemIndex: palaceStem, cuc } = calculateCuc(lunar.year, menh);
    const starBranches = majorStarBranches(tuViBranch(lunar.day, cuc.number));
    const stars = majors.map(([code, name]) => ({ code, nameVi: name, kind: 'major', palaceIndex: ((starBranches.get(code) ?? 0) - menh + 12) % 12, ...majorMetadata[code] }));
    const auxiliary = [
        ['van-xuong', 'Văn Xương', (10 - h + 12) % 12], ['van-khuc', 'Văn Khúc', (4 + h) % 12],
        ['ta-phu', 'Tả Phù', (4 + lunar.month - 1) % 12], ['huu-bat', 'Hữu Bật', (10 - (lunar.month - 1) + 12) % 12],
        ['loc-ton', 'Lộc Tồn', locTonBranch[can]], ['kinh-duong', 'Kình Dương', (locTonBranch[can] + 1) % 12],
        ['da-la', 'Đà La', (locTonBranch[can] + 11) % 12]
    ];
    auxiliary.forEach(([code, name, branch]) => stars.push({ code, nameVi: name, kind: 'auxiliary', palaceIndex: (branch - menh + 12) % 12 }));
    const lifeForward = (can % 2 === 0 && input.gender === 'male') || (can % 2 === 1 && input.gender === 'female');
    lifeCycle.forEach(([code, name], i) => {
        const branch = (lifeStart[cuc.element] + (lifeForward ? i : -i) + 120) % 12;
        stars.push({ code, nameVi: name, kind: 'auxiliary', palaceIndex: (branch - menh + 12) % 12 });
    });
    const yearBranch = ((lunar.year - 4) % 12 + 12) % 12;
    thaiTueCycle.forEach(([code, name], i) => stars.push({ code, nameVi: name, kind: 'auxiliary', palaceIndex: (yearBranch + i - menh + 12) % 12 }));
    bacSiCycle.forEach(([code, name], i) => {
        const branch = (locTonBranch[can] + (lifeForward ? i : -i) + 120) % 12;
        stars.push({ code, nameVi: name, kind: 'auxiliary', palaceIndex: (branch - menh + 12) % 12 });
    });
    const [khoiBranch, vietBranch] = khoiVietBranches[can], hongLoanBranch = (3 - yearBranch + 12) % 12;
    const annualAuxiliary = [
        ['thien-khoi', 'Thiên Khôi', khoiBranch], ['thien-viet', 'Thiên Việt', vietBranch],
        ['thien-ma', 'Thiên Mã', groupStarBranch(yearBranch, 'thien-ma')],
        ['dao-hoa', 'Đào Hoa', groupStarBranch(yearBranch, 'dao-hoa')],
        ['hong-loan', 'Hồng Loan', hongLoanBranch], ['thien-hy', 'Thiên Hỷ', (hongLoanBranch + 6) % 12]
    ];
    annualAuxiliary.forEach(([code, name, branch]) => stars.push({ code, nameVi: name, kind: 'auxiliary', palaceIndex: (branch - menh + 12) % 12 }));
    const hoaNames = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    (hoaByCan[can] || []).forEach((code, i) => { const s = stars.find(x => x.code === code); if (s)
        stars.push({ code: `${code}-hoa-${['loc', 'quyen', 'khoa', 'ky'][i]}`, nameVi: `${s.nameVi} ${hoaNames[i]}`, kind: 'transformation', palaceIndex: s.palaceIndex, element: s.element, yinYang: s.yinYang, group: 'tu-hoa' }); });
    const palaces = palaceNames.map((name, i) => ({ code: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'), nameVi: name, index: i, branch: branches[(menh + i) % 12], isMenh: i === 0, isThan: i === ((than - menh + 12) % 12), stars: stars.filter(s => s.palaceIndex === i).map(s => s.code) }));
    const phiHoa = input.include?.phiHoa ? palaces.flatMap(p => {
        const branch = (menh + p.index) % 12, stem = menhStem(can, branch);
        return hoaByCan[stem].flatMap((starCode, i) => {
            const target = stars.find(s => s.code === starCode && s.kind !== 'transformation');
            if (!target)
                return [];
            const transformation = ['loc', 'quyen', 'khoa', 'ky'][i];
            return [{ code: `phi-hoa.${p.index}.${transformation}.${starCode}.${target.palaceIndex}`, sourcePalaceIndex: p.index, targetPalaceIndex: target.palaceIndex, sourceStem: stems[stem], starCode, transformation }];
        });
    }) : undefined;
    const relations = buildRelations(menh);
    let asOfLunar, asOfYearBranch, dauQuanBranch, luuNguyetBranch, luuNhatBranch;
    if (input.asOfDate) {
        const [ay, am, ad] = input.asOfDate.split('-').map(Number);
        const check = new Date(Date.UTC(ay, am - 1, ad));
        if (check.getUTCFullYear() !== ay || check.getUTCMonth() !== am - 1 || check.getUTCDate() !== ad)
            throw new Error('asOfDate contains an invalid calendar date');
        asOfLunar = solarToVietnameseLunar(ad, am, ay, input.timezoneOffsetMinutes / 60);
        asOfYearBranch = ((asOfLunar.year - 4) % 12 + 12) % 12;
        dauQuanBranch = (asOfYearBranch - (lunar.month - 1) + h + 120) % 12;
        luuNguyetBranch = (dauQuanBranch + asOfLunar.month - 1) % 12;
        luuNhatBranch = (luuNguyetBranch + asOfLunar.day - 1) % 12;
    }
    const limitYear = asOfLunar?.year ?? input.asOfYear;
    const nominalAge = limitYear !== undefined ? limitYear - lunar.year + 1 : undefined;
    const tieuHanBranch = nominalAge !== undefined && nominalAge > 0 ? ((minorLimitStart(yearBranch) + (input.gender === 'male' ? nominalAge - 1 : -(nominalAge - 1))) % 12 + 12) % 12 : undefined;
    const limitYearBranch = asOfYearBranch ?? (input.asOfYear !== undefined ? ((input.asOfYear - 4) % 12 + 12) % 12 : undefined);
    const timeline = { ...(input.include?.daiHan ? { daiHan: Array.from({ length: 12 }, (_, i) => ({ startAge: cuc.number + i * 10, endAge: cuc.number + i * 10 + 9, palaceIndex: (lifeForward ? i : (12 - i) % 12) })) } : {}),
        ...(input.include?.tieuHan && input.asOfYear && nominalAge && tieuHanBranch !== undefined ? { tieuHan: { year: input.asOfYear, nominalAge, palaceIndex: (tieuHanBranch - menh + 12) % 12 } } : {}),
        ...(input.include?.luuNien && input.asOfYear && limitYearBranch !== undefined ? { luuNien: [{ year: input.asOfYear, palaceIndex: (limitYearBranch - menh + 12) % 12 }] } : {}),
        ...(input.include?.luuNguyet && input.asOfDate && asOfLunar && luuNguyetBranch !== undefined ? { luuNguyet: { asOfDate: input.asOfDate, lunarMonth: asOfLunar.month, palaceIndex: (luuNguyetBranch - menh + 12) % 12 } } : {}),
        ...(input.include?.luuNhat && input.asOfDate && asOfLunar && luuNhatBranch !== undefined ? { luuNhat: { asOfDate: input.asOfDate, lunarDay: asOfLunar.day, palaceIndex: (luuNhatBranch - menh + 12) % 12 } } : {}) };
    const audit = [{ rule: 'lunar-date', value: `${lunar.year}-${lunar.month}-${lunar.day}${lunar.leap ? '-leap' : ''}`, source: 'Vietnamese astronomical lunar calendar' }, { rule: 'menh-branch-index', value: String(menh), source: 'lunar month and hour branch' }, { rule: 'menh-stem-branch', value: `${stems[palaceStem]} ${branches[menh]}`, source: 'Ngũ hổ độn palace stem rule' }, { rule: 'cuc-na-yin-element', value: cuc.element, source: '60 Jiazi Na Yin table' }, { rule: 'trang-sinh-direction', value: lifeForward ? 'forward' : 'reverse', source: 'year yin-yang and gender' }, { rule: 'tu-vi-branch-index', value: String(starBranches.get('tu-vi')), source: 'lunar day and Cục placement rule' }, { rule: 'year-can', value: String(can), source: 'sexagenary lunar year' }, ...(input.trueSolarTime ? [
            { rule: 'longitude-correction-minutes', value: String(longitudeCorrection), source: longitude === undefined ? 'longitude unavailable' : `longitude vs ${standardMeridian}° standard meridian` },
            { rule: 'equation-of-time-minutes', value: String(equationCorrection), source: longitude === undefined ? 'not applied without longitude' : 'NOAA-style day-of-year approximation' },
            { rule: 'true-solar-correction-minutes', value: String(solarCorrection), source: 'longitude correction plus equation of time' }
        ] : [])];
    if (input.include?.daiHan)
        audit.push({ rule: 'dai-han-direction', value: lifeForward ? 'forward' : 'reverse', source: 'year yin-yang and gender' });
    if (input.include?.tieuHan && nominalAge && tieuHanBranch !== undefined)
        audit.push({ rule: 'tieu-han-position', value: `age-${nominalAge}:${branches[tieuHanBranch]}`, source: 'year-branch trine start and male-forward/female-reverse' });
    if (input.include?.luuNien && limitYearBranch !== undefined)
        audit.push({ rule: 'luu-nien-year-branch', value: branches[limitYearBranch], source: asOfLunar ? 'asOfDate Vietnamese lunar year branch' : 'asOfYear sexagenary branch' });
    if (input.include?.luuNguyet && asOfLunar && dauQuanBranch !== undefined)
        audit.push({ rule: 'luu-nguyet-dau-quan', value: `${branches[dauQuanBranch]}:${asOfLunar.month}`, source: 'annual branch, birth lunar month and birth hour' });
    if (input.include?.luuNhat && asOfLunar)
        audit.push({ rule: 'luu-nhat-lunar-day', value: String(asOfLunar.day), source: 'asOfDate Vietnamese lunar day' });
    if (input.include?.phiHoa)
        audit.push({ rule: 'phi-hoa-palace-stems', value: String(phiHoa?.length ?? 0), source: 'palace heavenly stem transformation table' });
    const versionForRule = (rule) => {
        if (rule === 'lunar-date')
            return RULE_VERSIONS.calendar;
        if (rule.includes('solar') || rule.includes('longitude') || rule.includes('equation-of-time'))
            return RULE_VERSIONS.trueSolarTime;
        if (rule.includes('cuc') || rule === 'menh-stem-branch')
            return RULE_VERSIONS.cuc;
        if (rule === 'tu-vi-branch-index')
            return RULE_VERSIONS.majorStars;
        if (rule.startsWith('phi-hoa'))
            return RULE_VERSIONS.phiHoa;
        if (rule.includes('han') || rule.startsWith('luu-'))
            return RULE_VERSIONS.timelines;
        return RULE_VERSIONS.palaces;
    };
    const versionedAudit = audit.map(entry => ({ ...entry, version: versionForRule(entry.rule) }));
    const menhPalace = palaces[0], menhStars = stars.filter(s => s.palaceIndex === 0 && s.kind === 'major');
    const facts = [
        { code: 'chart.menh.location', text: { vi: `Cung Mệnh an tại ${menhPalace.branch}.`, en: `The Life palace is located at ${menhPalace.branch}.` }, evidence: ['audit:menh-branch-index', 'palace:menh'] },
        { code: 'chart.cuc', text: { vi: `Lá số thuộc ${cuc.nameVi}.`, en: `The chart uses ${cuc.code}.` }, evidence: ['audit:cuc-na-yin-element', `cuc:${cuc.code}`] },
        { code: 'chart.menh.major-stars', text: { vi: `Chính tinh tại Mệnh: ${menhStars.map(s => s.nameVi).join(', ') || 'Vô chính diệu'}.`, en: `Major stars in Life palace: ${menhStars.map(s => s.code).join(', ') || 'none'}.` }, evidence: menhStars.map(s => `star:${s.code}`) }
    ];
    const warnings = [];
    if (input.tradition && input.tradition !== 'vietnamese')
        warnings.push({ code: 'tradition.baseline-fallback', severity: 'warning', message: { vi: `Profile ${input.tradition} chưa có rule table riêng; kết quả dùng baseline Vietnamese.`, en: `The ${input.tradition} profile has no dedicated rule table; Vietnamese baseline rules were used.` } });
    if (input.trueSolarTime && longitude === undefined)
        warnings.push({ code: 'solar-time.longitude-missing', severity: 'warning', message: { vi: 'Không có kinh độ nên chưa áp dụng hiệu chỉnh giờ Mặt Trời thật.', en: 'True solar time correction was not applied because longitude is unavailable.' } });
    if (catalogCity && input.timezoneOffsetMinutes !== catalogCity.timezoneOffsetMinutes)
        warnings.push({ code: 'location.timezone-mismatch', severity: 'warning', message: { vi: `Timezone input không khớp catalog ${catalogCity.nameVi}.`, en: `The input timezone does not match the catalog timezone for ${catalogCity.nameEn}.` } });
    if ((input.include?.luuNguyet || input.include?.luuNhat) && !input.asOfDate)
        warnings.push({ code: 'timeline.as-of-date-missing', severity: 'warning', message: { vi: 'Cần asOfDate để tính Lưu Nguyệt hoặc Lưu Nhật.', en: 'asOfDate is required to calculate monthly or daily limits.' } });
    if (input.include?.phiHoa)
        warnings.push({ code: 'feature.phi-hoa-baseline', severity: 'info', message: { vi: 'Phi Hóa dùng bảng can cung của profile Vietnamese baseline; trường phái khác có thể dùng quy ước khác.', en: 'Flying transformations use the Vietnamese baseline palace-stem table; other schools may differ.' } });
    if (lunar.leap)
        warnings.push({ code: 'calendar.leap-month', severity: 'info', message: { vi: 'Ngày sinh nằm trong tháng âm lịch nhuận.', en: 'The birth date falls in a leap lunar month.' } });
    return { input, palaces, stars, cuc, metadata: { engine: ENGINE_NAME, version: ENGINE_VERSION, schemaVersion: SCHEMA_VERSION, ruleSetVersion: RULE_SET_VERSION, methodology: `${input.tradition || 'vietnamese'} deterministic baseline`, calculatedAt: instant.toISOString(), capabilities: ['palaces', '14-major-stars', 'tu-hoa', 'cuc', 'relations', 'audit', 'localized-facts', 'warnings', 'phi-hoa'], sources: getMethodologyManifest().sources }, audit: versionedAudit, timeline, relations, facts, warnings, ...(phiHoa ? { phiHoa } : {}) };
}
