import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/news/${id}`);
      setNews(response.data);
    } catch (err) {
      setError('Failed to fetch news article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading article...</h2>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={styles.error}>
        <h2>Article not found</h2>
        <p>{error}</p>
        <Link to="/" style={styles.backLink}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to News</Link>
      
      <article style={styles.article}>
        <div style={styles.category}>{news.category}</div>
        <h1 style={styles.title}>{news.title}</h1>
        
        <div style={styles.meta}>
          <span>By {news.author?.name}</span>
          <span>{formatDate(news.createdAt)}</span>
          <span>{news.views} views</span>
        </div>

        {news.imageUrl && (
          <img 
            src={news.imageUrl} 
            alt={news.title}
            style={styles.image}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        <div style={styles.content}>
          {news.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} style={styles.paragraph}>
                {paragraph}
              </p>
            )
          ))}
        </div>
      </article>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#4a5568'
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#e53e3e'
  },
  backLink: {
    color: '#3182ce',
    textDecoration: 'none',
    marginBottom: '2rem',
    display: 'inline-block'
  },
  article: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  category: {
    display: 'inline-block',
    background: '#3182ce',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '1rem',
    lineHeight: '1.3'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1rem'
  },
  image: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#2d3748'
  },
  paragraph: {
    marginBottom: '1.5rem'
  }
};

export default NewsDetail;