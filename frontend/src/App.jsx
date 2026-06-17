import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SentenceBuilder from './pages/SentenceBuilder';
import DialogueGenerator from './pages/DialogueGenerator';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {/* Navigation header */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/sentence-builder" 
                element={
                  <ProtectedRoute>
                    <SentenceBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dialogue-generator" 
                element={
                  <ProtectedRoute>
                    <DialogueGenerator />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          
          {/* Footer info */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
