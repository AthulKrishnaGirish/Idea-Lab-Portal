import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages/Components (to be created)
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import OperatorDashboard from './pages/OperatorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import InventoryManagement from './pages/InventoryManagement';

function AppRoutes() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {currentUser.role === 'operator' ? (
          <>
            <Route index element={<OperatorDashboard />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route index element={<StudentDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
