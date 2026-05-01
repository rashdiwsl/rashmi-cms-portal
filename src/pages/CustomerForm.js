import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createCustomer, updateCustomer, getCustomerById, getAllCustomers } from '../api/customerApi';

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', dateOfBirth: null, nicNumber: '',
    mobileNumbers: [''],
    addresses: [{ addressLine1: '', addressLine2: '', cityId: '', countryId: '' }],
    familyMemberIds: [],
  });

  const [allCustomers, setAllCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fix: use .content for paged response
    getAllCustomers()
      .then(res => setAllCustomers(res.data.content || res.data))
      .catch(() => setAllCustomers([]));

   fetch('http://localhost:8080/api/cities')
  .then(r => r.json())
  .then(data => setCities(Array.isArray(data) ? data : []))
  .catch(() => setCities([]));

fetch('http://localhost:8080/api/countries')
  .then(r => r.json())
  .then(data => setCountries(Array.isArray(data) ? data : []))
  .catch(() => setCountries([]));

    if (isEdit) {
      getCustomerById(id).then(res => {
        const c = res.data;
        setForm({
          name: c.name,
          dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null,
          nicNumber: c.nicNumber,
          mobileNumbers: c.mobileNumbers?.length ? c.mobileNumbers : [''],
          addresses: c.addresses?.length ? c.addresses : [{ addressLine1: '', addressLine2: '', cityId: '', countryId: '' }],
          familyMemberIds: c.familyMembers?.map(f => f.id) || [],
        });
      });
    }
  }, [id, isEdit]);

  const addMobile = () => setForm(f => ({ ...f, mobileNumbers: [...f.mobileNumbers, ''] }));
  const removeMobile = (i) => setForm(f => ({ ...f, mobileNumbers: f.mobileNumbers.filter((_, idx) => idx !== i) }));
  const updateMobile = (i, val) => setForm(f => {
    const updated = [...f.mobileNumbers];
    updated[i] = val;
    return { ...f, mobileNumbers: updated };
  });

  const addAddress = () => setForm(f => ({ ...f, addresses: [...f.addresses, { addressLine1: '', addressLine2: '', cityId: '', countryId: '' }] }));
  const removeAddress = (i) => setForm(f => ({ ...f, addresses: f.addresses.filter((_, idx) => idx !== i) }));
  const updateAddress = (i, field, val) => setForm(f => {
    const updated = [...f.addresses];
    updated[i] = { ...updated[i], [field]: val };
    return { ...f, addresses: updated };
  });

  const toggleFamily = (memberId) => {
    setForm(f => ({
      ...f,
      familyMemberIds: f.familyMemberIds.includes(memberId)
        ? f.familyMemberIds.filter(fid => fid !== memberId)
        : [...f.familyMemberIds, memberId]
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.name || !form.dateOfBirth || !form.nicNumber) {
      setError('Name, Date of Birth, and NIC are required.');
      return;
    }
    setLoading(true);
    const payload = {
  name: form.name,
  nicNumber: form.nicNumber,
  dateOfBirth: form.dateOfBirth.toISOString().split('T')[0],
  // ✅ plain strings, NOT objects
  mobileNumbers: form.mobileNumbers.filter(m => m.trim() !== ''),
  addresses: form.addresses.filter(a => a.addressLine1.trim() !== ''),
  familyMemberIds: form.familyMemberIds,
};
    try {
      if (isEdit) await updateCustomer(id, payload);
      else await createCustomer(payload);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Basic Information</h3>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Name *</label>
            <input style={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>NIC Number *</label>
            <input style={styles.input} value={form.nicNumber} onChange={e => setForm(f => ({ ...f, nicNumber: e.target.value }))} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Date of Birth *</label>
            <DatePicker
              selected={form.dateOfBirth}
              onChange={date => setForm(f => ({ ...f, dateOfBirth: date }))}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              scrollableYearDropdown
              placeholderText="Select date"
              customInput={<input style={styles.input} />}
            />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Mobile Numbers</h3>
        {form.mobileNumbers.map((m, i) => (
          <div key={i} style={styles.inlineRow}>
            <input style={styles.input} placeholder="Mobile number"
              value={m} onChange={e => updateMobile(i, e.target.value)} />
            {form.mobileNumbers.length > 1 && (
              <button style={styles.btnRemove} onClick={() => removeMobile(i)}>✕</button>
            )}
          </div>
        ))}
        <button style={styles.btnAdd} onClick={addMobile}>+ Add Mobile</button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Addresses</h3>
        {form.addresses.map((a, i) => (
          <div key={i} style={styles.addressBlock}>
            <input style={styles.input} placeholder="Address Line 1" value={a.addressLine1} onChange={e => updateAddress(i, 'addressLine1', e.target.value)} />
            <input style={styles.input} placeholder="Address Line 2" value={a.addressLine2} onChange={e => updateAddress(i, 'addressLine2', e.target.value)} />
            <select style={styles.input} value={a.cityId} onChange={e => updateAddress(i, 'cityId', Number(e.target.value))}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select style={styles.input} value={a.countryId} onChange={e => updateAddress(i, 'countryId', Number(e.target.value))}>
              <option value="">Select Country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {form.addresses.length > 1 && (
              <button style={styles.btnRemove} onClick={() => removeAddress(i)}>✕ Remove</button>
            )}
          </div>
        ))}
        <button style={styles.btnAdd} onClick={addAddress}>+ Add Address</button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Family Members</h3>
        <div style={styles.familyGrid}>
          {allCustomers.filter(c => String(c.id) !== String(id)).map(c => (
            <label key={c.id} style={styles.checkLabel}>
              <input type="checkbox"
                checked={form.familyMemberIds.includes(c.id)}
                onChange={() => toggleFamily(c.id)} />
              {' '}{c.name} ({c.nicNumber})
            </label>
          ))}
        </div>
      </div>

      <div style={styles.btnRow}>
        <button style={styles.btnCancel} onClick={() => navigate('/')}>Cancel</button>
        <button style={styles.btnSave} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  section: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  sectionTitle: { marginTop: 0, marginBottom: '16px', color: '#2c3e50' },
  row: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' },
  label: { marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  inlineRow: { display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' },
  addressBlock: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #ddd' },
  familyGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' },
  btnAdd: { background: '#27ae60', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' },
  btnRemove: { background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' },
  btnSave: { background: '#2c3e50', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' },
  btnCancel: { background: '#95a5a6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' },
  error: { color: 'red', marginBottom: '12px' },
};

export default CustomerForm;