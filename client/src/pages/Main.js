import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Main() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setProfile('');

    const formData = new FormData();
    formData.append('transcript', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error((await response.json()).error);
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5 text-center">
        <h2>Welcome to DreamSpark</h2>
        <p>Please log in to upload transcripts and generate candidate profiles.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Upload Transcript</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Transcript File (.txt or .docx)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept=".txt,.docx"
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF' }}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {profile && (
        <div className="card mt-3" style={{ backgroundColor: '#F5F5F5', borderColor: '#E6E6FA' }}>
          <div className="card-body">
            <h5 className="card-title" style={{ color: '#6B21A8' }}>Candidate Profile</h5>
            <pre className="card-text" style={{ color: '#333333' }}>{profile}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;