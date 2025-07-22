import React, { useState, useEffect } from 'react';
import NewsForm from '../components/NewsForm';
import api from '../utils/api';

const EditorDashboard = () => {
  const [myNews, setMyNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyNews();
  }, []);

  const fetchMyNews = async () => {
    try {
      const response = await api.get('/news/editor/my-news');
      setMyNews(response.data);
    } catch (err) {
      setError('Failed to fetch your articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/news/${id}`);
        setMyNews(myNews.filter(news => news._id !== id));
      } catch (err) {
        alert('Failed to delete article');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchMyNews();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <NewsForm
        news={editingNews}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Editor Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          style={styles.createButton}
        >
          Create New Article
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading your articles...</div>
      ) : (
        <div style={styles.articlesList}>
          {myNews.length === 0 ? (
            <div style={styles.noArticles}>
              <p>You haven't created any articles yet.</p>
              <button
                onClick={() => setShowForm(true)}
                style={styles.createButton}
              >
                Create Your First Article
              </button>
            </div>
          ) : (
            <div style={styles.articlesGrid}>
              {myNews.map(article => (
                <div key={article._id} style={styles.articleCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.category}>{article.category}</div>
                    <div style={styles.status}>
                      {article.published ? (
                        <span style={styles.published}>Published</span>
                      ) : (
                        <span style={styles.draft}>Draft</span>
                      )}
                    </div>
                  </div>
                  
                  <h3 style={styles.articleTitle}>{article.title}</h3>
                  <p style={styles.summary}>{article.summary}</p>
                  
                  <div style={styles.articleMeta}>
                    <span>{formatDate(article.createdAt)}</span>
                    <span>{article.views} views</span>
                  </div>
                  
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => {
                        setEditingNews(article);
                        setShowForm(true);
                      }}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    color: '#1a202c'
  },
  createButton: {
    background: '#38a169',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  error: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#4a5568'
  },
  noArticles: {
    textAlign: 'center',
    padding: '4rem',
    color: '#4a5568'
  },
  articlesGrid: {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  },
  articleCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  category: {
    display: 'inline-block',
    background: '#3182ce',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  status: {
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  published: {
    color: '#38a169'
  },
  draft: {
    color: '#ed8936'
  },
  articleTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    color: '#1a202c'
  },
  summary: {
    color: '#4a5568',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  articleMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '1rem'
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  editButton: {
    flex: 1,
    background: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  deleteButton: {
    flex: 1,
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default EditorDashboard;
