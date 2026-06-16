export const checkInTemplates = [
  {
    id: 'meal',
    emoji: '🍽️',
    title: '每日一餐',
    subtitle: '分享你今天吃了什麼',
    description: '各自上傳一餐照片，分開吃也能互相看看',
    points: 30,
    completedToday: false,
    streak: 12,
    schedule: '每人每日一次',
  },
  {
    id: 'brush',
    emoji: '🪥',
    title: '睡前刷牙',
    subtitle: '每晚 22:00 前完成',
    description: '提醒 Jamie 不要忘記刷牙就睡著',
    points: 20,
    completedToday: false,
    streak: 5,
    schedule: '每日 22:00',
  },
  {
    id: 'water',
    emoji: '💧',
    title: '喝夠 8 杯水',
    subtitle: 'Alex 已完成',
    description: '各自追蹤，完成可賺點數',
    points: 15,
    completedToday: true,
    streak: 3,
    schedule: '每日一次',
  },
]

export const upcomingEvents = [
  {
    id: '1',
    emoji: '💍',
    title: '10 週年紀念日',
    dateLabel: '2026 年 6 月 19 日',
    daysLeft: 3,
    color: 'var(--color-primary-soft)',
  },
  {
    id: '2',
    emoji: '🎂',
    title: 'Jamie 生日',
    dateLabel: '2026 年 8 月 22 日',
    daysLeft: 67,
    color: 'var(--color-accent-soft)',
  },
  {
    id: '3',
    emoji: '🎁',
    title: '交往紀念日',
    dateLabel: '每年 6 月 16 日',
    daysLeft: 365,
    color: 'var(--color-warning-soft)',
  },
]

export const rewards = [
  {
    id: '1',
    emoji: '☕',
    title: '請喝手搖飲',
    description: '兌換一杯對方指定的飲料',
    cost: 200,
  },
  {
    id: '2',
    emoji: '🎬',
    title: '電影約會',
    description: '由對方安排一場電影之夜',
    cost: 500,
  },
  {
    id: '3',
    emoji: '🍰',
    title: '小蛋糕驚喜',
    description: '換一份小甜點',
    cost: 300,
  },
]

export const pointHistory = [
  { id: '1', label: '每日一餐打卡', time: '今天 12:30', amount: 30 },
  { id: '2', label: 'Jamie 完成刷牙簽到', time: '昨天 21:45', amount: 20 },
  { id: '3', label: '兌換 · 手搖飲', time: '6/10', amount: -200 },
  { id: '4', label: '紀念週活動 · 合照', time: '6/9', amount: 80 },
]

export const cycleInfo = {
  nextPredicted: '7 月 2 日',
  avgCycle: 28,
  recentLogs: [
    { id: '1', range: '5/4 – 5/8', duration: 5, cycle: 28, note: '' },
    { id: '2', range: '4/6 – 4/10', duration: 5, cycle: 27, note: '偏短' },
  ],
}

export const calendarDays: Array<{ date: number; otherMonth: boolean; dots?: string[] }> = [
  ...Array.from({ length: 3 }, (_, i) => ({ date: 28 + i, otherMonth: true })),
  ...Array.from({ length: 30 }, (_, i) => {
    const date = i + 1
    const dots: string[] = []
    if (date === 16) dots.push('var(--color-primary)')
    if (date === 19) dots.push('var(--color-accent)')
    if (date === 22) dots.push('var(--color-warning)')
    return { date, otherMonth: false, dots: dots.length ? dots : undefined }
  }),
  ...Array.from({ length: 5 }, (_, i) => ({ date: i + 1, otherMonth: true })),
]
