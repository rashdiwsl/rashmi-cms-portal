import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>CMS Portal</span>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Customers</Link>
        <Link to="/customers/new" style={styles.link}>Add Customer</Link>
        <Link to="/bulk-upload" style={styles.link}>Bulk Upload</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#2c3e50', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  links: { display: 'flex', gap: '20px' },
  link: { color: '#ecf0f1', textDecoration: 'none', fontSize: '15px' }
};

export default Navbar;