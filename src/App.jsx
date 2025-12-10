import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import History from './pages/History';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* All routes under Layout should be private, so we wrap the Layout route with PrivateRoute */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/:categoryId" element={<ProductList />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
