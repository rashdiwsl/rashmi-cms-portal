import React from 'react';
export default function Placeholder() { return <div>Coming soon...</div>; }

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCustomers } from '../api/customerApi';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCustomers()
      .then(res => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load customers');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={styles.header}>
        <h2>Customers</h2>
        <div style={styles.btnGroup}>
          <button style={styles.btnPrimary} onClick={() => navigate('/customers/new')}>+ Add Customer</button>
          <button style={styles.btnSecondary} onClick={() => navigate('/bulk-upload')}>Bulk Upload</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>NIC</th>
              <th style={styles.th}>Date of Birth</th>
              <th style={styles.th}>Mobile Numbers</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No customers found</td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{c.name}</td>
                  <td style={styles.td}>{c.nicNumber}</td>
                  <td style={styles.td}>{c.dateOfBirth}</td>
                  <td style={styles.td}>{c.mobileNumbers?.map(m => m.number).join(', ')}</td>
                  <td style={styles.td}>
                    <button style={styles.btnView} onClick={() => navigate(`/customers/${c.id}`)}>View</button>
                    <button style={styles.btnEdit} onClick={() => navigate(`/customers/edit/${c.id}`)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  btnGroup: { display: 'flex', gap: '10px' },
  btnPrimary: { background: '#2c3e50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  btnSecondary: { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#2c3e50', color: '#fff' },
  th: { padding: '12px', textAlign: 'left', color: '#fff' },
  td: { padding: '10px 12px', borderBottom: '1px solid #ddd' },
  rowEven: { background: '#f9f9f9' },
  rowOdd: { background: '#fff' },
  btnView: { background: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '6px' },
  btnEdit: { background: '#e67e22', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' },
};

export default CustomerList;