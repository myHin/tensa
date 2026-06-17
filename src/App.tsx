import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { CoupleProvider } from '@/context/CoupleContext'
import { PointsProvider } from '@/context/PointsContext'
import { CheckInProvider } from '@/context/CheckInContext'
import { AppProvider } from '@/context/AppContext'
import { MealProvider } from '@/context/MealContext'
import { CycleProvider } from '@/context/CycleContext'
import { RequireAppAccess, RequireGuest, RequireOnboarding } from '@/components/auth/AuthGuard'
import { AppLayout, AuthLayout } from '@/components/layout/AppLayout'
import { WelcomeScreen } from '@/screens/WelcomeScreen'
import { LoginScreen } from '@/screens/LoginScreen'
import { RegisterScreen } from '@/screens/RegisterScreen'
import { AuthCallbackScreen } from '@/screens/AuthCallbackScreen'
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
      <AuthProvider>
        <CoupleProvider>
          <PointsProvider>
            <CheckInProvider>
              <MealProvider>
                <AppProvider>
                  <CycleProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route element={<AuthLayout />}>
                          <Route path="/" element={<WelcomeScreen />} />
                          <Route path="/auth/callback" element={<AuthCallbackScreen />} />

                          <Route element={<RequireGuest />}>
                            <Route path="/login" element={<LoginScreen />} />
                            <Route path="/register" element={<RegisterScreen />} />
                          </Route>

                          <Route element={<RequireOnboarding />}>
                            <Route path="/pair" element={<PairScreen />} />
                            <Route path="/profile-setup" element={<ProfileSetupScreen />} />
                          </Route>
                        </Route>

                        <Route element={<RequireAppAccess />}>
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
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </BrowserRouter>
                  </CycleProvider>
                </AppProvider>
              </MealProvider>
            </CheckInProvider>
          </PointsProvider>
        </CoupleProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
