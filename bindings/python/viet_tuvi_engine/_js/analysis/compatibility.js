import { calculateTuVi } from '../calculate.js';
import { branches } from '../domain.js';
export function compatibility(a, b) {
    const left = calculateTuVi(a), right = calculateTuVi(b);
    const li = branches.indexOf(left.palaces[0].branch), ri = branches.indexOf(right.palaces[0].branch);
    const distance = Math.min((li - ri + 12) % 12, (ri - li + 12) % 12);
    const lucHop = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]].some(([x, y]) => (li === x && ri === y) || (li === y && ri === x));
    const branchRelation = li === ri ? 'same' : distance === 4 ? 'tam-hop' : lucHop ? 'luc-hop' : distance === 6 ? 'xung' : 'neutral';
    const branchPoints = { same: 8, 'tam-hop': 15, 'luc-hop': 12, xung: -18, neutral: 0 }[branchRelation];
    const elements = ['moc', 'hoa', 'tho', 'kim', 'thuy'], le = elements.indexOf(left.cuc.element), re = elements.indexOf(right.cuc.element);
    const elementRelation = le === re ? 'same' : (le + 1) % 5 === re || (re + 1) % 5 === le ? 'productive' : (le + 2) % 5 === re || (re + 2) % 5 === le ? 'controlling' : 'neutral';
    const elementPoints = { same: 10, productive: 14, controlling: -12, neutral: 0 }[elementRelation];
    const score = Math.max(0, Math.min(100, 60 + branchPoints + elementPoints));
    return { score, grade: score >= 75 ? 'favorable' : score >= 50 ? 'mixed' : 'challenging',
        aspects: [
            { code: 'compatibility.menh-branch', relation: branchRelation, score: branchPoints, evidence: [`left:${left.palaces[0].branch}`, `right:${right.palaces[0].branch}`] },
            { code: 'compatibility.cuc-element', relation: elementRelation, score: elementPoints, evidence: [`left:${left.cuc.element}`, `right:${right.cuc.element}`] }
        ],
        evidence: [{ code: 'menh-branch-relation', value: branchRelation }, { code: 'cuc-element-relation', value: elementRelation }],
        methodology: 'structural baseline; not predictive advice' };
}
