import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppProvider } from '@/context/AppContext'
import { MealProvider } from '@/context/MealContext'
import { AppLayout, AuthLayout } from '@/components/layout/AppLayout'
import { WelcomeScreen } from '@/screens/WelcomeScreen'
import { LoginScreen } from '@/screens/LoginScreen'
import { RegisterScreen } from '@/screens/RegisterScreen'
import { PairScreen } from '@/screens/PairScreen'
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { CheckInsScreen } from '@/screens/CheckInsScreen'
import { PointsScreen, CheckInSuccessScreen } from '@/screens/PointsScreen'
import { CalendarScreen } from '@/screens/CalendarScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { SeasonalScreen } from '@/screens/SeasonalScreen'
import { MealCheckInScreen } from '@/screens/MealCheckInScreen'
import { MealHistoryScreen } from '@/screens/MealHistoryScreen'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MealProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/pair" element={<PairScreen />} />
                <Route path="/profile-setup" element={<ProfileSetupScreen />} />
              </Route>

              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<HomeScreen />} />
                <Route path="check-ins" element={<CheckInsScreen />} />
                <Route path="meals/check-in" element={<MealCheckInScreen />} />
                <Route path="meals" element={<MealHistoryScreen />} />
                <Route path="points" element={<PointsScreen />} />
                <Route path="calendar" element={<CalendarScreen />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="check-in-success" element={<CheckInSuccessScreen />} />
                <Route path="seasonal" element={<SeasonalScreen />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </MealProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
