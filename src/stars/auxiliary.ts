export const locTonBranch = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

export const lifeCycle: [string, string][] = [
  ['trang-sinh', 'Tràng Sinh'], ['moc-duc', 'Mộc Dục'], ['quan-doi', 'Quan Đới'], ['lam-quan', 'Lâm Quan'],
  ['de-vuong', 'Đế Vượng'], ['suy', 'Suy'], ['benh', 'Bệnh'], ['tu', 'Tử'], ['mo', 'Mộ'], ['tuyet', 'Tuyệt'],
  ['thai', 'Thai'], ['duong', 'Dưỡng']
];

export const lifeStart: Record<string, number> = {
  moc: 11,
  hoa: 2,
  tho: 8,
  kim: 5,
  thuy: 8
};

export const thaiTueCycle: [string, string][] = [
  ['thai-tue', 'Thái Tuế'], ['thieu-duong', 'Thiếu Dương'], ['tang-mon', 'Tang Môn'], ['thieu-am', 'Thiếu Âm'],
  ['quan-phu', 'Quan Phù'], ['tu-phu', 'Tử Phù'], ['tue-pha', 'Tuế Phá'], ['long-duc', 'Long Đức'],
  ['bach-ho', 'Bạch Hổ'], ['phuc-duc', 'Phúc Đức'], ['dieu-khach', 'Điếu Khách'], ['truc-phu', 'Trực Phù']
];

export const bacSiCycle: [string, string][] = [
  ['bac-si', 'Bác Sĩ'], ['luc-si', 'Lực Sĩ'], ['thanh-long', 'Thanh Long'], ['tieu-hao', 'Tiểu Hao'],
  ['tuong-quan', 'Tướng Quân'], ['tau-thu', 'Tấu Thư'], ['phi-liem', 'Phi Liêm'], ['hy-than', 'Hỷ Thần'],
  ['benh-phu', 'Bệnh Phù'], ['dai-hao', 'Đại Hao'], ['phuc-binh', 'Phục Binh'], ['quan-phu-bac-si', 'Quan Phủ']
];

export const khoiVietBranches: [number, number][] = [
  [1, 7], [0, 8], [11, 9], [11, 9], [1, 7],
  [0, 8], [6, 2], [6, 2], [3, 5], [3, 5]
];

export function groupStarBranch(yearBranch: number, star: 'thien-ma' | 'dao-hoa') {
  const group = yearBranch % 4;
  return star === 'thien-ma' ? [2, 11, 8, 5][group] : [9, 6, 3, 0][group];
}
