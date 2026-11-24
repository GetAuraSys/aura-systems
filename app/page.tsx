import AuthGuard from './dashboard/AuthGuard'
import ProtectedDashboard from './dashboard/ProtectedDashboard'

export default function HomePage() {
  return (
    <AuthGuard
      subtitle="Aura Systems"
      title="Panel de Control"
      navHref="/dashboard"
      navLabel="Vista Miembros"
    >
      <ProtectedDashboard />
    </AuthGuard>
  )
}
