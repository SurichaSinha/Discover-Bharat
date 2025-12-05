import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ArticlesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Articles display and search
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.authorName && article.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  }, [articles, searchTerm]);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/api/articles');
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Please log in to submit an article.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage('Please fill in both title and content');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const articleData = {
        ...formData,
        authorName: user.name || user.email
      };

      const response = await api.post('/api/articles', articleData);

      if (response.status === 201) {
        setMessage('Article submitted successfully! It will be reviewed by our team before publication.');
        setFormData({
          title: '',
          content: ''
        });
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      if (error.response?.status === 401) {
        setMessage('Please log in to submit an article.');
      } else if (error.response?.status === 400) {
        setMessage('Please check your input and try again.');
      } else {
        setMessage('Error submitting article. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Share Your Knowledge
      </h1>

      {!user ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to submit articles for publication.
          </p>
          <a
            href="/login"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Log In
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Write an Article</h2>
        <p className="text-gray-600 mb-6">
          Share your insights about Indian culture, heritage, or Swadeshi initiatives.
          Your article will be reviewed before publication.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter an engaging title"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your article content here..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum 100 characters. You can use basic formatting.
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || formData.content.length < 100}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Article'}
          </button>
        </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Submission Guidelines:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Articles should be original and respectful</li>
              <li>• Focus on Indian culture, heritage, or Swadeshi topics</li>
              <li>• Minimum 100 characters required</li>
              <li>• All submissions are reviewed before publication</li>
            </ul>
          </div>
        </div>
      )}

      {/* Articles Display Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-600">
          Published Articles
        </h2>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles by title, content, or author..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm ? 'No articles found matching your search.' : 'No published articles yet.'}
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-6 text-gray-600">
              {searchTerm ? (
                <p>Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchTerm}"</p>
              ) : (
                <p>Showing all {filteredArticles.length} published article{filteredArticles.length !== 1 ? 's' : ''}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Article Header */}
                  <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 overflow-hidden text-ellipsis">
                      {article.title.length > 50 ? `${article.title.substring(0, 50)}...` : article.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      By {article.authorName || 'Anonymous'}
                    </p>
                  </div>

                  {/* Article Content Preview */}
                  <div className="p-4">
                    <p className="text-gray-700 text-sm mb-3">
                      {article.content.length > 120 ? `${article.content.substring(0, 120)}...` : article.content}
                    </p>

                    {/* Read More Button */}
                    <button
                      onClick={() => {/* TODO: Navigate to full article */}}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Read More →
                    </button>
                  </div>

                  {/* Article Footer */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-right">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
