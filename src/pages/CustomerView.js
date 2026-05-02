import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById, deleteCustomer } from '../api/customerApi';

function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomerById(id)
      .then(res => {
        setCustomer(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load customer');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        navigate('/');
      } catch (e) {
        setError('Failed to delete customer');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!customer) return null;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Customer Details</h2>
        <div style={styles.btnGroup}>
          <button style={styles.btnEdit} onClick={() => navigate(`/customers/edit/${id}`)}>Edit</button>
          <button style={styles.btnDelete} onClick={handleDelete}>Delete</button>
          <button style={styles.btnBack} onClick={() => navigate('/')}>Back</button>
        </div>
      </div>

      {/* Basic Info */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Basic Information</h3>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Name</span>
            <span style={styles.value}>{customer.name}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>NIC Number</span>
            <span style={styles.value}>{customer.nicNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Date of Birth</span>
            <span style={styles.value}>{customer.dateOfBirth}</span>
          </div>
        </div>
      </div>

      {/* Mobile Numbers */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Mobile Numbers</h3>
        {customer.mobileNumbers?.length > 0 ? (
          <ul style={styles.list}>
            {customer.mobileNumbers.map((m, i) => (
              <li key={i} style={styles.listItem}>{m}</li>
            ))}
          </ul>
        ) : (
          <p style={styles.empty}>No mobile numbers</p>
        )}
      </div>

      {/* Addresses */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Addresses</h3>
        {customer.addresses?.length > 0 ? (
          customer.addresses.map((a, i) => (
            <div key={i} style={styles.addressCard}>
              <p style={styles.addressLine}>{a.addressLine1}</p>
              {a.addressLine2 && <p style={styles.addressLine}>{a.addressLine2}</p>}
              {/* ✅ Fixed: use cityName and countryName from AddressDTO */}
              {(a.cityName || a.countryName) && (
                <p style={styles.addressMeta}>
                  {[a.cityName, a.countryName].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={styles.empty}>No addresses</p>
        )}
      </div>

      {/* Family Members */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Family Members</h3>
        {customer.familyMembers?.length > 0 ? (
          <div style={styles.familyGrid}>
            {customer.familyMembers.map(f => (
              <div
                key={f.id}
                style={styles.familyCard}
                onClick={() => navigate(`/customers/${f.id}`)}
              >
                <span style={styles.familyName}>{f.name}</span>
                <span style={styles.familyNic}>{f.nicNumber}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.empty}>No family members</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0 },
  btnGroup: { display: 'flex', gap: '10px' },
  btnEdit: { background: '#e67e22', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  btnBack: { background: '#95a5a6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  section: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  sectionTitle: { marginTop: 0, marginBottom: '16px', color: '#2c3e50' },
  grid: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', minWidth: '200px' },
  label: { fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' },
  value: { fontSize: '15px', fontWeight: '500', color: '#2c3e50' },
  list: { margin: 0, paddingLeft: '20px' },
  listItem: { padding: '4px 0', fontSize: '14px' },
  addressCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '12px', marginBottom: '10px' },
  addressLine: { margin: '2px 0', fontSize: '14px', color: '#2c3e50' },
  addressMeta: { margin: '6px 0 2px', fontSize: '13px', color: '#666', fontStyle: 'italic' }, // ✅ new style
  familyGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  familyCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' },
  familyName: { fontWeight: '600', fontSize: '14px' },
  familyNic: { fontSize: '12px', color: '#888' },
  empty: { color: '#aaa', fontSize: '14px', margin: 0 },
};

export default CustomerView;