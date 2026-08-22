import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ children, wide = false }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className={wide ? 'main-content-wide' : 'main-content'}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};
