import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Import Link from React Router

const KnowledgeBaseList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://localhost:7121/api/KnowledgeBase');
        setArticles(response.data);
      } catch (error) {
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Knowledge Base Articles</h1>
      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {articles.length === 0 && !loading && <div className="alert alert-info text-center">No articles found.</div>}
      {articles.length > 0 && (
        <div className="row">
          {articles.map(article => (
            <div key={article.knowledgeBaseArticleId} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text"><strong>Category:</strong> {article.category}</p>
                  <p className="card-text"><strong>Created:</strong> {new Date(article.dateCreated).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Updated:</strong> {new Date(article.dateUpdated).toLocaleDateString()}</p>
                  <Link to={`/article/${article.knowledgeBaseArticleId}`} className="btn btn-primary">Read More</Link> {/* Updated Link */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseList;