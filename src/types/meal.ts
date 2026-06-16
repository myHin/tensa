export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealRecord {
  id: string
  photoUrl: string
  caption: string
  mealType: MealType
  uploadedBy: string
  date: string
  time: string
  dateLabel: string
  points: number
}

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '宵夜',
}

export const mealTypeEmoji: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🌃',
}
