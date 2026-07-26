import type { TuViChart } from './types.js';

export function buildRelations(menhBranch: number): TuViChart['relations'] {
  const relation = (
    type: 'xung' | 'tam-hop' | 'luc-hop' | 'chieu',
    from: number,
    to: number
  ) => ({ code: `relation.${type}.${from}.${to}`, type, from, to });

  const xungRelations = Array.from({ length: 6 }, (_, index) => relation('xung', index, index + 6));
  const tamHopRelations = Array.from({ length: 12 }, (_, index) => relation('tam-hop', index, (index + 4) % 12));
  const lucHopRelations = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]].map(([left, right]) => {
    const from = (left - menhBranch + 12) % 12;
    const to = (right - menhBranch + 12) % 12;
    return relation('luc-hop', Math.min(from, to), Math.max(from, to));
  });
  const chieuRelations = Array.from({ length: 12 }, (_, index) => relation('chieu', index, (index + 6) % 12));
  return [...xungRelations, ...tamHopRelations, ...lucHopRelations, ...chieuRelations];
}
