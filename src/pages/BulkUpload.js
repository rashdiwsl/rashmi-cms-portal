import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BulkUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'uploading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.match(/\.(xlsx|xls)$/)) {
      setMessage('Please select a valid Excel file (.xlsx or .xls)');
      setStatus('error');
      setFile(null);
      return;
    }
    setFile(selected);
    setStatus(null);
    setMessage('');
    setResult(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus('uploading');
    setProgress(0);
    setMessage('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8080/api/customers/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      setStatus('success');
      setResult(response.data);
      setMessage('Upload completed successfully!');
    } catch (e) {
      setStatus('error');
      setMessage(e.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  const handleDownloadTemplate = () => {
    window.open('http://localhost:8080/api/customers/bulk-upload/template', '_blank');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Bulk Customer Upload</h2>
        <button style={styles.btnBack} onClick={() => navigate('/')}>Back</button>
      </div>

      {/* Instructions */}
      <div style={styles.infoBox}>
        <h4 style={styles.infoTitle}>📋 Instructions</h4>
        <ul style={styles.infoList}>
          <li>Download the template below and fill in customer data.</li>
          <li>Required columns: <strong>Name, Date of Birth (YYYY-MM-DD), NIC Number</strong></li>
          <li>Optional columns: Mobile Number, Address Line 1, Address Line 2, City, Country</li>
          <li>For multiple mobile numbers, add extra rows with the same NIC.</li>
          <li>File supports up to 1,000,000 records — large files may take a few minutes.</li>
        </ul>
        <button style={styles.btnTemplate} onClick={handleDownloadTemplate}>
          ⬇ Download Template
        </button>
      </div>

      {/* Upload Area */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Select Excel File</h3>
        <div style={styles.uploadArea}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={styles.fileInput}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={styles.fileLabel}>
            {file ? `📄 ${file.name}` : '📂 Click to choose an Excel file'}
          </label>
        </div>

        {file && (
          <p style={styles.fileInfo}>
            File: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}

        {/* Progress Bar */}
        {status === 'uploading' && (
          <div style={styles.progressWrapper}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <span style={styles.progressText}>{progress}%</span>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <p style={status === 'error' ? styles.msgError : styles.msgSuccess}>
            {status === 'error' ? '❌' : '✅'} {message}
          </p>
        )}

        {/* Result Summary */}
        {result && (
          <div style={styles.resultBox}>
            <h4 style={styles.resultTitle}>Upload Summary</h4>
            <div style={styles.resultGrid}>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Total Rows</span>
                <span style={styles.resultValue}>{result.totalRows ?? '-'}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Created</span>
                <span style={{ ...styles.resultValue, color: '#27ae60' }}>{result.created ?? '-'}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Updated</span>
                <span style={{ ...styles.resultValue, color: '#e67e22' }}>{result.updated ?? '-'}</span>
              </div>
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Failed</span>
                <span style={{ ...styles.resultValue, color: '#e74c3c' }}>{result.failed ?? '-'}</span>
              </div>
            </div>
          </div>
        )}

        <button
          style={status === 'uploading' ? styles.btnDisabled : styles.btnUpload}
          onClick={handleUpload}
          disabled={status === 'uploading'}
        >
          {status === 'uploading' ? 'Uploading...' : '⬆ Upload File'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0 },
  btnBack: { background: '#95a5a6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  infoBox: { background: '#eaf4fb', border: '1px solid #aed6f1', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px' },
  infoTitle: { margin: '0 0 10px', color: '#2980b9' },
  infoList: { margin: '0 0 12px', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' },
  btnTemplate: { background: '#2980b9', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  section: { background: '#f9f9f9', padding: '24px', borderRadius: '8px' },
  sectionTitle: { marginTop: 0, marginBottom: '16px', color: '#2c3e50' },
  uploadArea: { border: '2px dashed #bdc3c7', borderRadius: '8px', padding: '30px', textAlign: 'center', marginBottom: '12px', cursor: 'pointer' },
  fileInput: { display: 'none' },
  fileLabel: { fontSize: '15px', color: '#555', cursor: 'pointer' },
  fileInfo: { fontSize: '13px', color: '#666', margin: '4px 0 12px' },
  progressWrapper: { display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' },
  progressBar: { flex: 1, height: '12px', background: '#ddd', borderRadius: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#27ae60', borderRadius: '6px', transition: 'width 0.3s ease' },
  progressText: { fontSize: '13px', fontWeight: 'bold', minWidth: '36px' },
  msgError: { color: '#e74c3c', fontSize: '14px', margin: '10px 0' },
  msgSuccess: { color: '#27ae60', fontSize: '14px', margin: '10px 0' },
  resultBox: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', margin: '16px 0' },
  resultTitle: { margin: '0 0 12px', color: '#2c3e50' },
  resultGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  resultItem: { display: 'flex', flexDirection: 'column', minWidth: '100px' },
  resultLabel: { fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '4px' },
  resultValue: { fontSize: '22px', fontWeight: 'bold', color: '#2c3e50' },
  btnUpload: { background: '#2c3e50', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', marginTop: '16px' },
  btnDisabled: { background: '#bdc3c7', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: '4px', cursor: 'not-allowed', fontSize: '15px', marginTop: '16px' },
};

export default BulkUpload;