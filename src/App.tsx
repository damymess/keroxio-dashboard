import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { ClientsPage } from './pages/Clients';
import { ClientDetailPage } from './pages/ClientDetail';
import { ProspectsPage } from './pages/Prospects';
import { ProspectDetailPage } from './pages/ProspectDetail';
import { PipelinePage } from './pages/Pipeline';
import { VehiclesPage } from './pages/Vehicles';
import { PhotosPage } from './pages/Photos';
import { AnnoncesPage } from './pages/Annonces';
import { FacturesPage } from './pages/Factures';
import { StatisticsPage } from './pages/Statistics';
import { TasksPage } from './pages/Tasks';
import { SettingsPage } from './pages/Settings';
import { FAQPage } from './pages/FAQ';
import { OnboardingPage } from './pages/Onboarding';
import { LoginPage } from './pages/Login';
import { useAuthStore } from './stores/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <OnboardingPage />
            </OnboardingRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="prospects" element={<ProspectsPage />} />
          <Route path="prospects/:id" element={<ProspectDetailPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="annonces" element={<AnnoncesPage />} />
          <Route path="factures" element={<FacturesPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
