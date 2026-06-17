export type ProfileGender = 'female' | 'male' | 'other'

export const genderOptions: { value: ProfileGender; label: string }[] = [
  { value: 'female', label: '女性' },
  { value: 'male', label: '男性' },
  { value: 'other', label: '其他' },
]

export const genderLabels: Record<ProfileGender, string> = {
  female: '女性',
  male: '男性',
  other: '其他',
}

export function canTrackOwnMenstrualCycle(gender: ProfileGender | null | undefined): boolean {
  return gender === 'female'
}

export function isProfileCompleteForApp(profile: {
  display_name?: string | null
  gender?: ProfileGender | null
} | null): boolean {
  return Boolean(profile?.display_name?.trim() && profile?.gender)
}
