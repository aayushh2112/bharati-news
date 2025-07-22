import React, { useState } from 'react';
import api from '../utils/api';

const NewsForm = ({ news, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    summary: news?.summary || '',
    category: news?.category || 'Politics',
    imageUrl: news?.imageUrl || '',
    published: news?.published || false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Politics', 'Sports', 'Technology', 'Health', 'Entertainment', 'Business', 'World'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (news) {
        await api.put(`/news/${news._id}`, formData);
      } else {
        await api.post('/news', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>
          {news ? 'Edit Article' : 'Create New Article'}
        </h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Article Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <textarea
            name="summary"
            placeholder="Article Summary (200 characters max)"
            value={formData.summary}
            onChange={handleChange}
            required
            maxLength={200}
            rows={3}
            style={styles.textarea}
          />
          
          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleChange}
            style={styles.input}
          />
          
          <textarea
            name="content"
            placeholder="Article Content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            style={styles.textarea}
          />
          
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              style={styles.checkbox}
            />
            Publish immediately
          </label>
          
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Saving...' : (news ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    background: '#f7fafc',
    minHeight: '100vh'
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#1a202c'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a5568'
  },
  checkbox: {
    width: '1rem',
    height: '1rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitButton: {
    flex: 1,
    background: '#3182ce',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    background: '#718096',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  }
};

export default NewsForm;