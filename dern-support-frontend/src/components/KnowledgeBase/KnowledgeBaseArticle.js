import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const KnowledgeBaseArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://localhost:7121/api/KnowledgeBase/${id}`);
        setArticle(response.data);
      } catch (error) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title">{article.title}</h1>
          <h5 className="card-subtitle mb-3 text-muted">Category: {article.category}</h5>
          <p className="card-text"><strong>Problem Description:</strong> {article.problemDescription}</p>
          <p className="card-text"><strong>Solution:</strong> {article.solution}</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseArticle;