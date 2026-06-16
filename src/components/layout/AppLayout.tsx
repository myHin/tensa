import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { DesignNav } from './DesignNav'

export function AppLayout() {
  return (
    <div className="app-shell pb-24">
      <Outlet />
      <BottomNav />
      <DesignNav />
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="app-shell min-h-dvh flex flex-col">
      <Outlet />
      <DesignNav />
    </div>
  )
}
