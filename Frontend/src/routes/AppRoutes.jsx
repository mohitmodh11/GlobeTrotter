import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Route Protection
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { MyTrips } from '../pages/trips/MyTrips';
import { CreateTrip } from '../pages/trips/CreateTrip';
import { EditTrip } from '../pages/trips/EditTrip';
import { ItineraryView } from '../pages/itinerary/ItineraryView';
import { ItineraryBuilderPage } from '../pages/itinerary/ItineraryBuilderPage';
import { BudgetPage } from '../pages/budget/BudgetPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { CitySearchPage } from '../pages/search/CitySearchPage';
import { ActivitySearchPage } from '../pages/search/ActivitySearchPage';
import { PublicTrip } from '../pages/sharing/PublicTrip';
import { Profile } from '../pages/profile/Profile';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Share Route */}
      <Route
        path="/share/:shareCode"
        element={
          <Layout>
            <PublicTrip />
          </Layout>
        }
      />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Trips */}
        <Route path="trips" element={<MyTrips />} />
        <Route path="trips/new" element={<CreateTrip />} />
        <Route path="trips/:id" element={<ItineraryView />} />
        <Route path="trips/:id/builder" element={<ItineraryBuilderPage />} />
        <Route path="trips/:id/budget" element={<BudgetPage />} />
        <Route path="trips/:id/calendar" element={<CalendarPage />} />
        <Route path="trips/:id/edit" element={<EditTrip />} />

        {/* Discovery & Search */}
        <Route path="cities" element={<CitySearchPage />} />
        <Route path="activities" element={<ActivitySearchPage />} />

        {/* Profile & Settings */}
        <Route path="profile" element={<Profile />} />

        {/* Admin Dashboard */}
        <Route
          path="admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Inside Layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
