import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { scroller } from 'react-scroll';

// Pages publiques
import Accueil from './components/Accueil/Accueil';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Login from './components/Connextion/Login';

// Components
import Dashboard from './components/dashbaord/Dashboard';
import AnimatedHeader from './components/DashborddAdmin/AnimatedHeader';
import ListAgriculteur from './components/ListAgriculteur/ListAgriculteur';
import ListJury from './components/ListJury/JuryList';
import ListDemande from './components/demande/ListDemande';
// Composants auxiliaires
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import CooperativeList from './components/CooperativeAgricole/CooperativeList';
import ResponsableListPage from './components/ResponsableList/ResponsableListPage';
import LoginPage2 from './components/Connextion/LoginPage2';
import ForgotPassword from './components/Forgot-password/forgot-password'
import ResetPassword from './components/ResetPassword/resetPassword'
import Profile from './components/Profile/Profile'

// Vérifier rôle depuis localStorage
function ProtectedRoute({ children, requiredRoles }) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/login" replace />;
  if (requiredRoles && !requiredRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
}

// Layout public
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        scroller.scrollTo(id, { smooth: true, offset: -100, duration: 500 });
      }, 0);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout><Accueil /><About /><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/login2" element={<LoginPage2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* Dashboard - Accessible to all authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRoles={['admin', 'agriculteur', 'responsable', 'jury']}>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AnimatedHeader />} />
          {/* Admin specific routes */}
          <Route path="administration/agriculteur" element={<ListAgriculteur />} />
          <Route path="administration/jury" element={<ListJury />} />
          <Route path="administration/cooperative" element={<CooperativeList />} />
          <Route path="administration/demande" element={<ListDemande />} />
          <Route path="administration/responsable" element={<ResponsableListPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Redirect old admin routes to new dashboard */}
        <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={
          <PublicLayout>
            <div className="flex items-center justify-center h-[60vh]">
              <h2 className="text-2xl font-bold">403 - Accès non autorisé</h2>
            </div>
          </PublicLayout>
        } />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="flex items-center justify-center h-[60vh]">
              <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}
