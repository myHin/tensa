export type ThemeId = 'rose' | 'lavender' | 'ocean' | 'sage' | 'sunset'
export type ThemeMode = 'light' | 'dark'

export interface ThemePreset {
  id: ThemeId
  name: string
  nameZh: string
  swatch: string
  light: ThemeTokens
  dark: ThemeTokens
}

export interface ThemeTokens {
  '--color-bg': string
  '--color-bg-elevated': string
  '--color-bg-muted': string
  '--color-surface': string
  '--color-border': string
  '--color-text': string
  '--color-text-muted': string
  '--color-primary': string
  '--color-primary-soft': string
  '--color-primary-foreground': string
  '--color-accent': string
  '--color-accent-soft': string
  '--color-success': string
  '--color-success-soft': string
  '--color-warning': string
  '--color-warning-soft': string
  '--gradient-hero': string
  '--shadow-card': string
  '--shadow-float': string
}

export const themePresets: ThemePreset[] = [
  {
    id: 'rose',
    name: 'Rose',
    nameZh: '玫瑰',
    swatch: '#e11d6a',
    light: {
      '--color-bg': '#fff5f8',
      '--color-bg-elevated': '#ffffff',
      '--color-bg-muted': '#ffe8f0',
      '--color-surface': '#ffffff',
      '--color-border': '#f5d0dc',
      '--color-text': '#2d1020',
      '--color-text-muted': '#8b6478',
      '--color-primary': '#e11d6a',
      '--color-primary-soft': '#fce7f0',
      '--color-primary-foreground': '#ffffff',
      '--color-accent': '#f97316',
      '--color-accent-soft': '#fff1e8',
      '--color-success': '#16a34a',
      '--color-success-soft': '#dcfce7',
      '--color-warning': '#d97706',
      '--color-warning-soft': '#fef3c7',
      '--gradient-hero': 'linear-gradient(145deg, #fff0f5 0%, #ffe4ec 45%, #ffd6e8 100%)',
      '--shadow-card': '0 4px 24px rgba(225, 29, 106, 0.08)',
      '--shadow-float': '0 12px 40px rgba(225, 29, 106, 0.15)',
    },
    dark: {
      '--color-bg': '#1a0a12',
      '--color-bg-elevated': '#261018',
      '--color-bg-muted': '#331422',
      '--color-surface': '#2a101c',
      '--color-border': '#4a2034',
      '--color-text': '#fce7f0',
      '--color-text-muted': '#c49aad',
      '--color-primary': '#fb7185',
      '--color-primary-soft': '#4a1a2e',
      '--color-primary-foreground': '#1a0a12',
      '--color-accent': '#fb923c',
      '--color-accent-soft': '#3d2010',
      '--color-success': '#4ade80',
      '--color-success-soft': '#14532d',
      '--color-warning': '#fbbf24',
      '--color-warning-soft': '#422006',
      '--gradient-hero': 'linear-gradient(145deg, #1a0a12 0%, #2a1020 50%, #331422 100%)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
      '--shadow-float': '0 12px 40px rgba(0, 0, 0, 0.45)',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    nameZh: '薰衣草',
    swatch: '#8b5cf6',
    light: {
      '--color-bg': '#f8f5ff',
      '--color-bg-elevated': '#ffffff',
      '--color-bg-muted': '#ede9fe',
      '--color-surface': '#ffffff',
      '--color-border': '#ddd6fe',
      '--color-text': '#1e1033',
      '--color-text-muted': '#7c6b9e',
      '--color-primary': '#8b5cf6',
      '--color-primary-soft': '#ede9fe',
      '--color-primary-foreground': '#ffffff',
      '--color-accent': '#ec4899',
      '--color-accent-soft': '#fce7f3',
      '--color-success': '#16a34a',
      '--color-success-soft': '#dcfce7',
      '--color-warning': '#d97706',
      '--color-warning-soft': '#fef3c7',
      '--gradient-hero': 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #e9d5ff 100%)',
      '--shadow-card': '0 4px 24px rgba(139, 92, 246, 0.08)',
      '--shadow-float': '0 12px 40px rgba(139, 92, 246, 0.15)',
    },
    dark: {
      '--color-bg': '#120a1f',
      '--color-bg-elevated': '#1a1028',
      '--color-bg-muted': '#231533',
      '--color-surface': '#1e1230',
      '--color-border': '#3b2660',
      '--color-text': '#ede9fe',
      '--color-text-muted': '#a89bc4',
      '--color-primary': '#a78bfa',
      '--color-primary-soft': '#2e1f4d',
      '--color-primary-foreground': '#120a1f',
      '--color-accent': '#f472b6',
      '--color-accent-soft': '#3d1a30',
      '--color-success': '#4ade80',
      '--color-success-soft': '#14532d',
      '--color-warning': '#fbbf24',
      '--color-warning-soft': '#422006',
      '--gradient-hero': 'linear-gradient(145deg, #120a1f 0%, #1a1028 50%, #231533 100%)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
      '--shadow-float': '0 12px 40px rgba(0, 0, 0, 0.45)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    nameZh: '海洋',
    swatch: '#0ea5e9',
    light: {
      '--color-bg': '#f0f9ff',
      '--color-bg-elevated': '#ffffff',
      '--color-bg-muted': '#e0f2fe',
      '--color-surface': '#ffffff',
      '--color-border': '#bae6fd',
      '--color-text': '#0c1929',
      '--color-text-muted': '#5b7a94',
      '--color-primary': '#0ea5e9',
      '--color-primary-soft': '#e0f2fe',
      '--color-primary-foreground': '#ffffff',
      '--color-accent': '#14b8a6',
      '--color-accent-soft': '#ccfbf1',
      '--color-success': '#16a34a',
      '--color-success-soft': '#dcfce7',
      '--color-warning': '#d97706',
      '--color-warning-soft': '#fef3c7',
      '--gradient-hero': 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      '--shadow-card': '0 4px 24px rgba(14, 165, 233, 0.08)',
      '--shadow-float': '0 12px 40px rgba(14, 165, 233, 0.15)',
    },
    dark: {
      '--color-bg': '#0a1520',
      '--color-bg-elevated': '#0f1e2e',
      '--color-bg-muted': '#152a3d',
      '--color-surface': '#122638',
      '--color-border': '#1e4466',
      '--color-text': '#e0f2fe',
      '--color-text-muted': '#7eb3d4',
      '--color-primary': '#38bdf8',
      '--color-primary-soft': '#0c2d44',
      '--color-primary-foreground': '#0a1520',
      '--color-accent': '#2dd4bf',
      '--color-accent-soft': '#0f3330',
      '--color-success': '#4ade80',
      '--color-success-soft': '#14532d',
      '--color-warning': '#fbbf24',
      '--color-warning-soft': '#422006',
      '--gradient-hero': 'linear-gradient(145deg, #0a1520 0%, #0f1e2e 50%, #152a3d 100%)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
      '--shadow-float': '0 12px 40px rgba(0, 0, 0, 0.45)',
    },
  },
  {
    id: 'sage',
    name: 'Sage',
    nameZh: '鼠尾草',
    swatch: '#059669',
    light: {
      '--color-bg': '#f0fdf4',
      '--color-bg-elevated': '#ffffff',
      '--color-bg-muted': '#dcfce7',
      '--color-surface': '#ffffff',
      '--color-border': '#bbf7d0',
      '--color-text': '#0f2918',
      '--color-text-muted': '#5b8a6e',
      '--color-primary': '#059669',
      '--color-primary-soft': '#dcfce7',
      '--color-primary-foreground': '#ffffff',
      '--color-accent': '#ca8a04',
      '--color-accent-soft': '#fef9c3',
      '--color-success': '#16a34a',
      '--color-success-soft': '#dcfce7',
      '--color-warning': '#d97706',
      '--color-warning-soft': '#fef3c7',
      '--gradient-hero': 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
      '--shadow-card': '0 4px 24px rgba(5, 150, 105, 0.08)',
      '--shadow-float': '0 12px 40px rgba(5, 150, 105, 0.15)',
    },
    dark: {
      '--color-bg': '#0a1a12',
      '--color-bg-elevated': '#0f2418',
      '--color-bg-muted': '#143020',
      '--color-surface': '#122a1c',
      '--color-border': '#1e4d32',
      '--color-text': '#dcfce7',
      '--color-text-muted': '#7eb896',
      '--color-primary': '#34d399',
      '--color-primary-soft': '#0f3324',
      '--color-primary-foreground': '#0a1a12',
      '--color-accent': '#facc15',
      '--color-accent-soft': '#3d3008',
      '--color-success': '#4ade80',
      '--color-success-soft': '#14532d',
      '--color-warning': '#fbbf24',
      '--color-warning-soft': '#422006',
      '--gradient-hero': 'linear-gradient(145deg, #0a1a12 0%, #0f2418 50%, #143020 100%)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
      '--shadow-float': '0 12px 40px rgba(0, 0, 0, 0.45)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    nameZh: '夕陽',
    swatch: '#ea580c',
    light: {
      '--color-bg': '#fff7ed',
      '--color-bg-elevated': '#ffffff',
      '--color-bg-muted': '#ffedd5',
      '--color-surface': '#ffffff',
      '--color-border': '#fed7aa',
      '--color-text': '#2a1205',
      '--color-text-muted': '#9a6844',
      '--color-primary': '#ea580c',
      '--color-primary-soft': '#ffedd5',
      '--color-primary-foreground': '#ffffff',
      '--color-accent': '#db2777',
      '--color-accent-soft': '#fce7f3',
      '--color-success': '#16a34a',
      '--color-success-soft': '#dcfce7',
      '--color-warning': '#d97706',
      '--color-warning-soft': '#fef3c7',
      '--gradient-hero': 'linear-gradient(145deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      '--shadow-card': '0 4px 24px rgba(234, 88, 12, 0.08)',
      '--shadow-float': '0 12px 40px rgba(234, 88, 12, 0.15)',
    },
    dark: {
      '--color-bg': '#1a0e08',
      '--color-bg-elevated': '#261610',
      '--color-bg-muted': '#331e12',
      '--color-surface': '#2a1810',
      '--color-border': '#4a2818',
      '--color-text': '#ffedd5',
      '--color-text-muted': '#c49a78',
      '--color-primary': '#fb923c',
      '--color-primary-soft': '#3d2010',
      '--color-primary-foreground': '#1a0e08',
      '--color-accent': '#f472b6',
      '--color-accent-soft': '#3d1a30',
      '--color-success': '#4ade80',
      '--color-success-soft': '#14532d',
      '--color-warning': '#fbbf24',
      '--color-warning-soft': '#422006',
      '--gradient-hero': 'linear-gradient(145deg, #1a0e08 0%, #261610 50%, #331e12 100%)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
      '--shadow-float': '0 12px 40px rgba(0, 0, 0, 0.45)',
    },
  },
]

export function getThemeTokens(id: ThemeId, mode: ThemeMode): ThemeTokens {
  const preset = themePresets.find((t) => t.id === id) ?? themePresets[0]
  return mode === 'dark' ? preset.dark : preset.light
}
