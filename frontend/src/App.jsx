import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import EditorDashboard from './pages/EditorDashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={styles.app}>
          <Navbar />
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute role="editor">
                    <EditorDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f7fafc'
  },
  main: {
    minHeight: 'calc(100vh - 80px)'
  }
};

export default App;