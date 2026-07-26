export const majors = [
    ['tu-vi', 'Tử Vi'], ['thien-co', 'Thiên Cơ'], ['thai-duong', 'Thái Dương'], ['vu-khuc', 'Vũ Khúc'],
    ['thien-dong', 'Thiên Đồng'], ['liem-trinh', 'Liêm Trinh'], ['thien-phu', 'Thiên Phủ'], ['thai-am', 'Thái Âm'],
    ['tham-lang', 'Tham Lang'], ['cu-mon', 'Cự Môn'], ['thien-tuong', 'Thiên Tướng'], ['thien-luong', 'Thiên Lương'],
    ['that-sat', 'Thất Sát'], ['pha-quan', 'Phá Quân']
];
export const majorMetadata = {
    'tu-vi': { element: 'tho', yinYang: 'yin', group: 'tu-vi' },
    'thien-co': { element: 'moc', yinYang: 'yin', group: 'tu-vi' },
    'thai-duong': { element: 'hoa', yinYang: 'yang', group: 'tu-vi' },
    'vu-khuc': { element: 'kim', yinYang: 'yin', group: 'tu-vi' },
    'thien-dong': { element: 'thuy', yinYang: 'yang', group: 'tu-vi' },
    'liem-trinh': { element: 'hoa', yinYang: 'yin', group: 'tu-vi' },
    'thien-phu': { element: 'tho', yinYang: 'yang', group: 'thien-phu' },
    'thai-am': { element: 'thuy', yinYang: 'yin', group: 'thien-phu' },
    'tham-lang': { element: 'thuy', yinYang: 'yang', group: 'thien-phu' },
    'cu-mon': { element: 'thuy', yinYang: 'yin', group: 'thien-phu' },
    'thien-tuong': { element: 'thuy', yinYang: 'yang', group: 'thien-phu' },
    'thien-luong': { element: 'moc', yinYang: 'yang', group: 'thien-phu' },
    'that-sat': { element: 'kim', yinYang: 'yang', group: 'thien-phu' },
    'pha-quan': { element: 'thuy', yinYang: 'yin', group: 'thien-phu' }
};
export function listMajorStars() {
    return majors.map(([code, nameVi]) => ({ code, nameVi, ...majorMetadata[code] }));
}
export function tuViBranch(lunarDay, cuc) {
    let extra = 0;
    while ((lunarDay + extra) % cuc !== 0)
        extra++;
    const quotient = (lunarDay + extra) / cuc;
    return ((2 + quotient + (extra % 2 === 0 ? extra : -extra) - 1) % 12 + 12) % 12;
}
export function majorStarBranches(tuVi) {
    const phu = ((4 - tuVi) % 12 + 12) % 12;
    return new Map([
        ['tu-vi', tuVi], ['thien-co', (tuVi + 11) % 12], ['thai-duong', (tuVi + 9) % 12],
        ['vu-khuc', (tuVi + 8) % 12], ['thien-dong', (tuVi + 7) % 12], ['liem-trinh', (tuVi + 4) % 12],
        ['thien-phu', phu], ['thai-am', (phu + 1) % 12], ['tham-lang', (phu + 2) % 12],
        ['cu-mon', (phu + 3) % 12], ['thien-tuong', (phu + 4) % 12], ['thien-luong', (phu + 5) % 12],
        ['that-sat', (phu + 6) % 12], ['pha-quan', (phu + 10) % 12]
    ]);
}
