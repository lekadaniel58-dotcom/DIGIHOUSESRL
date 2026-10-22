import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import { About, Promotions, NotFound } from './pages/Information';
import Contact from './pages/Contact';
import Businesses from './pages/Businesses';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="promozioni" element={<Promotions />} />
          <Route path="chi-siamo" element={<About />} />
          <Route path="imprese" element={<Businesses />} />
          <Route path="contatti" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
