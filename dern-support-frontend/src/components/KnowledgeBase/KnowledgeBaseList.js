import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const KnowledgeBaseList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://localhost:7121/api/KnowledgeBase/${id}`);
        setArticles(articles.filter(article => article.knowledgeBaseArticleId !== id));
        Swal.fire('Deleted!', 'The article has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Failed!', 'Failed to delete the article.', 'error');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'The article is safe :)', 'info');
    }
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Knowledge Base Articles</h1>

      {/* Button to create new article */}
      <div className="text-center mb-4">
        <Link to="/CreateKnowledgeBaseArticle" className="btn btn-success">Create New Article</Link>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search articles by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="text-center"><div className="spinner-border" role="status"></div></div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {filteredArticles.length === 0 && !loading && <div className="alert alert-info text-center">No articles found.</div>}
      
      {filteredArticles.length > 0 && (
        <div className="row">
          {filteredArticles.map(article => (
            <div key={article.knowledgeBaseArticleId} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text"><strong>Category:</strong> {article.category}</p>
                  <p className="card-text"><strong>Created:</strong> {new Date(article.dateCreated).toLocaleDateString()}</p>
                  <p className="card-text"><strong>Updated:</strong> {new Date(article.dateUpdated).toLocaleDateString()}</p>
                  <Link to={`/article/${article.knowledgeBaseArticleId}`} className="btn btn-primary mr-2">Read More</Link>
                  {role === 'Technician' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(article.knowledgeBaseArticleId)}
                    >
                      Delete
                    </button>
                  )}
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