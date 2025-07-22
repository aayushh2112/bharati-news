import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.card}>
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
        <div style={styles.category}>{news.category}</div>
        <h3 style={styles.title}>
          <Link to={`/news/${news._id}`} style={styles.titleLink}>
            {news.title}
          </Link>
        </h3>
        <p style={styles.summary}>{news.summary}</p>
        <div style={styles.meta}>
          <span>By {news.author?.name}</span>
          <span>{formatDate(news.createdAt)}</span>
          <span>{news.views} views</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  content: {
    padding: '1.5rem'
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
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    lineHeight: '1.5'
  },
  titleLink: {
    color: '#1a202c',
    textDecoration: 'none'
  },
  summary: {
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#718096'
  }
};

export default NewsCard;
