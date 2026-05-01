import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerView from './pages/CustomerView';
import BulkUpload from './pages/BulkUpload';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerView />} />
          <Route path="/bulk-upload" element={<BulkUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;