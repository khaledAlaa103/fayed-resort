export const chaletsData = [
  { id: 100, type: 'double', area: 'خلفي' }, { id: 101, type: 'double', area: 'الملاعب' },
  { id: 102, type: 'double', area: 'الملاعب' }, { id: 103, type: 'double', area: 'البسين' },
  { id: 104, type: 'double', area: 'خلفي' }, { id: 105, type: 'double', area: 'الملاعب' },
  { id: 106, type: 'double', area: 'الملاعب' }, { id: 107, type: 'double', area: 'البسين' },
  { id: 108, type: 'double', area: 'خلفي' }, { id: 109, type: 'double', area: 'الملاعب' },
  { id: 110, type: 'double', area: 'الملاعب' }, { id: 111, type: 'double', area: 'البسين' },
  { id: 200, type: 'double', area: 'خلفي' }, { id: 201, type: 'double', area: 'الملاعب' },
  { id: 202, type: 'double', area: 'الملاعب' }, { id: 203, type: 'double', area: 'البسين' },
  { id: 204, type: 'double', area: 'خلفي' }, { id: 205, type: 'double', area: 'الملاعب' },
  { id: 206, type: 'double', area: 'الملاعب' }, { id: 207, type: 'double', area: 'البسين' },
  { id: 208, type: 'double', area: 'خلفي' }, { id: 209, type: 'double', area: 'الملاعب' },
  { id: 210, type: 'double', area: 'الملاعب' }, { id: 211, type: 'double', area: 'البسين' },
  { id: 220, type: 'single', area: 'الملاعب' }, { id: 222, type: 'single', area: 'خلفي' },
  { id: 223, type: 'single', area: 'الملاعب' }, { id: 224, type: 'single', area: 'الملاعب' },
  { id: 225, type: 'single', area: 'خلفي' }, { id: 226, type: 'single', area: 'خلفي' },
  { id: 227, type: 'single', area: 'الملاعب' }, { id: 228, type: 'single', area: 'الملاعب' },
  { id: 229, type: 'single', area: 'خلفي' }, { id: 230, type: 'single', area: 'خلفي' },
  { id: 231, type: 'single', area: 'الملاعب' }, { id: 233, type: 'single', area: 'خلفي' },
]

export function chaletTypeLabel(type) {
  return type === 'single' ? 'فردي' : 'زوجي'
}

export const housingMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

export const monthMap = {
  يناير: 1, فبراير: 2, مارس: 3, أبريل: 4, مايو: 5, يونيو: 6,
  يوليو: 7, أغسطس: 8, سبتمبر: 9, أكتوبر: 10, نوفمبر: 11, ديسمبر: 12,
}

export const daysInMonth = {
  يناير: 31, فبراير: 29, مارس: 31, أبريل: 30, مايو: 31, يونيو: 30,
  يوليو: 31, أغسطس: 31, سبتمبر: 30, أكتوبر: 31, نوفمبر: 30, ديسمبر: 31,
}
