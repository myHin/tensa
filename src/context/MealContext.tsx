import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialMealRecords } from '@/data/meals'
import type { MealRecord, MealType } from '@/types/meal'

interface AddMealInput {
  photoUrl: string
  caption: string
  mealType: MealType
  uploadedBy: string
}

interface MealContextValue {
  records: MealRecord[]
  addMeal: (input: AddMealInput) => MealRecord
  hasCheckedInToday: (userName: string) => boolean
  getTodayMeals: () => MealRecord[]
  getTodayMealByUser: (userName: string) => MealRecord | undefined
  getRecordsByDate: (date: string) => MealRecord[]
}

const MealContext = createContext<MealContextValue | null>(null)

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('zh-Hant', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function buildInitialRecords(): MealRecord[] {
  const today = todayKey()
  const partnerLunchToday: MealRecord = {
    id: 'm-today-partner',
    photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278dfe799?w=600&h=600&fit=crop',
    caption: '公司楼下水餃店，韭菜豬肉加酸辣湯',
    mealType: 'lunch',
    uploadedBy: 'Jamie',
    date: today,
    time: '12:18',
    dateLabel: '今天',
    points: 30,
  }
  return [partnerLunchToday, ...initialMealRecords]
}

export function MealProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MealRecord[]>(buildInitialRecords)

  const addMeal = useCallback((input: AddMealInput) => {
    const now = new Date()
    const record: MealRecord = {
      id: `m-${Date.now()}`,
      photoUrl: input.photoUrl,
      caption: input.caption,
      mealType: input.mealType,
      uploadedBy: input.uploadedBy,
      date: todayKey(),
      time: formatTime(now),
      dateLabel: '今天',
      points: 30,
    }
    setRecords((prev) => [record, ...prev])
    return record
  }, [])

  const hasCheckedInToday = useCallback(
    (userName: string) =>
      records.some((r) => r.date === todayKey() && r.uploadedBy === userName),
    [records],
  )

  const getTodayMeals = useCallback(
    () => records.filter((r) => r.date === todayKey()),
    [records],
  )

  const getTodayMealByUser = useCallback(
    (userName: string) => records.find((r) => r.date === todayKey() && r.uploadedBy === userName),
    [records],
  )

  const getRecordsByDate = useCallback(
    (date: string) => records.filter((r) => r.date === date),
    [records],
  )

  const value = useMemo(
    () => ({
      records,
      addMeal,
      hasCheckedInToday,
      getTodayMeals,
      getTodayMealByUser,
      getRecordsByDate,
    }),
    [records, addMeal, hasCheckedInToday, getTodayMeals, getTodayMealByUser, getRecordsByDate],
  )

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>
}

export function useMeals() {
  const ctx = useContext(MealContext)
  if (!ctx) throw new Error('useMeals must be used within MealProvider')
  return ctx
}
