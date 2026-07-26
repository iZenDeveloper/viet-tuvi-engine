export function createGroundedPrompt(chart, locale = 'vi') {
    const facts = chart.facts
        .map(fact => `${fact.code}: ${fact.text[locale]} [${fact.evidence.join(',')}]`)
        .join('\n');
    const instruction = locale === 'vi'
        ? 'Diễn giải có điều kiện, chỉ dùng bằng chứng bên dưới; trích dẫn stable code và nêu rõ giới hạn.'
        : 'Interpret conditionally using only the evidence below; cite stable codes and state limitations.';
    return {
        system: instruction,
        evidence: {
            engine: chart.metadata.engine,
            version: chart.metadata.version,
            cuc: chart.cuc.code,
            palaces: facts,
            audit: chart.audit,
            warnings: chart.warnings
        }
    };
}
