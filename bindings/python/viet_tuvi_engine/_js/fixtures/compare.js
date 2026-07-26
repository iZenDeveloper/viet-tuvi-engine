import { calculateTuVi } from '../calculate.js';
export function compareChartFixture(input, expected) {
    const actual = calculateTuVi(input), diffs = [];
    const check = (path, want, got) => { if (JSON.stringify(want) !== JSON.stringify(got))
        diffs.push({ path, expected: want, actual: got }); };
    if (expected.cuc?.code !== undefined)
        check('cuc.code', expected.cuc.code, actual.cuc.code);
    if (expected.palaces)
        for (const palace of expected.palaces) {
            const got = actual.palaces.find(p => p.index === palace.index);
            if (!got)
                diffs.push({ path: `palaces[${palace.index}]`, expected: palace, actual: undefined });
            else {
                if (palace.branch !== undefined)
                    check(`palaces[${palace.index}].branch`, palace.branch, got.branch);
                if (palace.isMenh !== undefined)
                    check(`palaces[${palace.index}].isMenh`, palace.isMenh, got.isMenh);
                if (palace.isThan !== undefined)
                    check(`palaces[${palace.index}].isThan`, palace.isThan, got.isThan);
                if (palace.stars !== undefined)
                    check(`palaces[${palace.index}].stars`, [...palace.stars].sort(), [...got.stars].sort());
            }
        }
    if (expected.stars)
        for (const star of expected.stars) {
            const got = actual.stars.find(s => s.code === star.code);
            if (!got)
                diffs.push({ path: `stars.${star.code}`, expected: star, actual: undefined });
            else if (star.palaceIndex !== undefined)
                check(`stars.${star.code}.palaceIndex`, star.palaceIndex, got.palaceIndex);
        }
    return { match: diffs.length === 0, diffs, actual, methodology: 'stable-field fixture comparison' };
}
