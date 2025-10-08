import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import TeacherDashboard from '../pages/TeacherDashboard.jsx';
import ParentDashboard from '../pages/ParentDashboard.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';
import SchoolLandingPage from '../pages/SchoolLandingPage.jsx';
import AlbumViewer from '../pages/AlbumViewer.jsx';
import ProtectedRoute from '../auth/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SchoolLandingPage />} />
      <Route path="/home" element={<SchoolLandingPage />} />
      <Route path="/landing" element={<SchoolLandingPage />} />
      <Route path="/album/:albumId" element={<AlbumViewer />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}