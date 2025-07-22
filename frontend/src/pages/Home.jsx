import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import api from '../utils/api';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Politics', 'Sports', 'Technology', 'Health', 'Entertainment', 'Business', 'World'];

  useEffect(() => {
    fetchNews();
  }, [currentPage, selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await api.get('/news', { params });
      setNews(response.data.news);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (loading && news.length === 0) {
    return (
      <div style={styles.loading}>
        <h2>Loading news...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Latest News</h1>
        
        <div style={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category ? styles.activeCategory : {})
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.newsGrid}>
        {news.map(article => (
          <NewsCard key={article._id} news={article} />
        ))}
      </div>

      {news.length === 0 && !loading && (
        <div style={styles.noNews}>
          <p>No news articles found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={styles.pageButton}
          >
            Next
          </button>
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
    marginBottom: '2rem'
  },
  title: {
    color: '#1a202c',
    marginBottom: '1rem'
  },
  categoryFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  categoryButton: {
    background: '#e2e8f0',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeCategory: {
    background: '#3182ce',
    color: 'white'
  },
  newsGrid: {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#4a5568'
  },
  error: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  noNews: {
    textAlign: 'center',
    padding: '4rem',
    color: '#4a5568'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  pageButton: {
    background: '#3182ce',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  pageInfo: {
    color: '#4a5568'
  }
};

export default Home;