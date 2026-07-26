import { calculateTuVi } from '../calculate.js';
export function calculateTimeline(input) {
    const chart = calculateTuVi({ ...input, include: { ...input.include, daiHan: true, tieuHan: true, luuNien: true, ...(input.asOfDate ? { luuNguyet: true, luuNhat: true } : {}) } });
    return {
        input: chart.input, timeline: chart.timeline,
        audit: chart.audit.filter(entry => entry.rule.includes('han') || entry.rule.startsWith('luu-')),
        warnings: chart.warnings.filter(warning => warning.code.startsWith('timeline.')),
        metadata: { engine: chart.metadata.engine, version: chart.metadata.version, ruleSetVersion: chart.metadata.ruleSetVersion }
    };
}
