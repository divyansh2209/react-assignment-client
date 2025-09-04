// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CatalogPage from './components/CatalogPage';
import DetailPage from './components/DetailPage';

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ marginRight: 12 }}>
          Catalog
        </Link>
      </nav>

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/item/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}
