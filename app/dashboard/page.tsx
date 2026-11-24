import AuthGuard from './AuthGuard'
import ProtectedDashboard from './ProtectedDashboard'

export default function DashboardPage() {
  return (
    <AuthGuard
      subtitle="Aura Systems"
      title="Panel de Miembros"
      navHref="/"
      navLabel="Inicio"
    >
      <ProtectedDashboard />
    </AuthGuard>
  )
}
