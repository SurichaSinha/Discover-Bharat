import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminArticles = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingArticles();
    }
  }, [user]);

  const fetchPendingArticles = async () => {
    try {
      const response = await api.get('/api/articles?status=pending');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching pending articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (articleId) => {
    setApproving(articleId);
    try {
      const response = await api.put(`/api/articles/approve/${articleId}`);

      if (response.status === 200) {
        // Remove the approved article from the pending list
        setArticles(prev => prev.filter(article => article._id !== articleId));
        alert('Article approved and published successfully!');
      }
    } catch (error) {
      console.error('Error approving article:', error);
      alert('Error approving article. Please try again.');
    } finally {
      setApproving(null);
    }
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Loading pending articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Article Review Panel
      </h1>

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Admin Controls</h2>
          <p className="text-blue-700">
            Review and approve articles submitted by community members.
            Approved articles will be published and visible to all users.
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-lg">No pending articles to review.</div>
          <p className="text-gray-400 mt-2">All caught up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">
              Pending Articles ({articles.length})
            </h2>
          </div>

          {articles.map(article => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Article Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>By: {article.authorName || 'Anonymous'}</span>
                      <span>Submitted: {new Date(article.createdAt).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending Review
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApprove(article._id)}
                    disabled={approving === article._id}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-medium ml-4"
                  >
                    {approving === article._id ? 'Approving...' : 'Approve & Publish'}
                  </button>
                </div>
              </div>

              {/* Article Content Preview */}
              <div className="px-6 py-4">
                <div className="text-gray-700 leading-relaxed max-h-48 overflow-hidden">
                  {article.content.length > 500
                    ? `${article.content.substring(0, 500)}...`
                    : article.content
                  }
                </div>
                {article.content.length > 500 && (
                  <div className="mt-2 text-sm text-gray-500">
                    (Content truncated for preview)
                  </div>
                )}
              </div>

              {/* Article Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{article.content.length} characters</span>
                  <span>Status: Pending Publication</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
