export function renderSvg(chart) {
    const size = 720;
    const cell = 180;
    const positions = [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1]];
    const escape = (value) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
    const starNames = new Map(chart.stars.map(star => [star.code, star.nameVi]));
    const cells = chart.palaces.map(palace => {
        const [column, row] = positions[palace.index];
        const x = column * cell;
        const y = row * cell;
        const names = palace.stars.map(code => starNames.get(code) ?? code);
        const lines = [];
        let line = '';
        for (const name of names) {
            const candidate = line ? `${line}, ${name}` : name;
            if (candidate.length > 19 && line) {
                lines.push(line);
                line = name;
            }
            else {
                line = candidate;
            }
        }
        if (line)
            lines.push(line);
        const starText = lines
            .slice(0, 8)
            .map((value, index) => `<tspan x="10" dy="${index === 0 ? 0 : 13}">${escape(value)}</tspan>`)
            .join('');
        return `<g transform="translate(${x},${y})"><rect width="180" height="180" fill="${palace.isMenh ? '#eef6ff' : '#fff'}" stroke="#1f2937"/>`
            + `<text x="10" y="24" font-family="sans-serif" font-size="16" font-weight="bold">${escape(palace.nameVi)}</text>`
            + `<text x="10" y="46" font-family="sans-serif" font-size="13">${escape(palace.branch)}${palace.isThan ? ' · Thân' : ''}</text>`
            + `<text x="10" y="72" font-family="sans-serif" font-size="9.5">${starText || '<tspan>Không có sao</tspan>'}</text></g>`;
    }).join('');
    const center = `<g transform="translate(180,180)"><rect width="360" height="360" fill="#f8fafc" stroke="#1f2937"/><text x="180" y="145" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold">Lá số Tử Vi</text><text x="180" y="180" text-anchor="middle" font-family="sans-serif" font-size="16">${escape(chart.cuc.nameVi)}</text><text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="13">Rule set ${escape(chart.metadata.ruleSetVersion)}</text></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="title desc"><title id="title">Lá số Tử Vi</title><desc id="desc">Mười hai cung bao quanh phần thông tin trung tâm, trình bày các sao trong từng cung</desc>${center}${cells}</svg>`;
}
