export const stems = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const naYinElements = [
    'kim', 'hoa', 'moc', 'tho', 'kim', 'hoa', 'thuy', 'tho', 'kim', 'moc',
    'thuy', 'tho', 'hoa', 'moc', 'thuy', 'kim', 'hoa', 'moc', 'tho', 'kim',
    'hoa', 'thuy', 'tho', 'kim', 'moc', 'thuy', 'tho', 'hoa', 'moc', 'thuy'
];
const cucByElement = {
    thuy: { code: 'thuy-nhi-cuc', nameVi: 'Thủy nhị cục', element: 'thuy', number: 2 },
    moc: { code: 'moc-tam-cuc', nameVi: 'Mộc tam cục', element: 'moc', number: 3 },
    kim: { code: 'kim-tu-cuc', nameVi: 'Kim tứ cục', element: 'kim', number: 4 },
    tho: { code: 'tho-ngu-cuc', nameVi: 'Thổ ngũ cục', element: 'tho', number: 5 },
    hoa: { code: 'hoa-luc-cuc', nameVi: 'Hỏa lục cục', element: 'hoa', number: 6 }
};
function yearStem(year) {
    return ((year - 4) % 10 + 10) % 10;
}
export function menhStem(yearStemIndex, menhBranch) {
    const stemAtDan = [2, 4, 6, 8, 0][yearStemIndex % 5];
    const branchOffsetFromDan = (menhBranch - 2 + 12) % 12;
    return (stemAtDan + branchOffsetFromDan) % 10;
}
function sexagenaryIndex(stem, branch) {
    for (let index = 0; index < 60; index++) {
        if (index % 10 === stem && index % 12 === branch)
            return index;
    }
    throw new Error('Invalid stem-branch parity');
}
export function calculateCuc(lunarYear, menhBranch) {
    const yearStemIndex = yearStem(lunarYear);
    const palaceStemIndex = menhStem(yearStemIndex, menhBranch);
    const cycleIndex = sexagenaryIndex(palaceStemIndex, menhBranch);
    const element = naYinElements[Math.floor(cycleIndex / 2)];
    return {
        yearStemIndex,
        palaceStemIndex,
        cuc: cucByElement[element]
    };
}
