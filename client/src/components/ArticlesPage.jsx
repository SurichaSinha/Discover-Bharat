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
      const response = await api.get('/articles');
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

      const response = await api.post('/articles', articleData);

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
  
  <div className="max-w-6xl mx-auto px-6 py-10">

    {/* PAGE HEADING */}
    <div className="text-center mb-12">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text 
                     bg-gradient-to-r from-[#8c4b21] to-[#c57a31] mb-3">
        Share Your Knowledge
      </h1>
      <p className="text-gray-600 text-lg">
        Contribute articles about Indian culture, heritage & Swadeshi ideas.
      </p>
      <div className="w-24 h-1 bg-[#c57a31] mx-auto mt-3 rounded-full"></div>
    </div>

    {/* AUTH REQUIRED MESSAGE */}
    {!user ? (
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border border-[#eadfcf] 
                      rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-semibold text-[#623b22] mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in to submit articles for publication.
        </p>
        <a
          href="/login"
          className="bg-[#b35a17] text-white px-8 py-3 rounded-lg shadow hover:bg-[#9a4d14] transition"
        >
          Log In
        </a>
      </div>
    ) : (
      /* ARTICLE SUBMISSION FORM */
      <div className="bg-white/90 backdrop-blur shadow-xl border border-[#eadfcf] rounded-2xl p-8 mb-12">

        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-[#f7dfc8] flex items-center justify-center text-xl">📝</div>
          <h2 className="text-2xl font-bold text-[#623b22]">Write an Article</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Your article will be reviewed before publication. Share factual and respectful content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-semibold text-[#623b22] mb-2">
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#d9c6ae] bg-[#faf5ee] rounded-xl 
                         focus:ring-2 focus:ring-[#b35a17] outline-none"
              placeholder="Enter an engaging title"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm font-semibold text-[#623b22] mb-2">
              Article Content *
            </label>
            <textarea
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#d9c6ae] bg-[#faf5ee] rounded-xl 
                         focus:ring-2 focus:ring-[#b35a17] outline-none"
              placeholder="Write your article here..."
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 100 characters.</p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`p-4 rounded-xl text-sm ${
              message.includes('Error')
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting || formData.content.length < 100}
            className="w-full bg-[#b35a17] text-white py-3 rounded-xl shadow-md 
                       hover:bg-[#9a4d14] disabled:bg-[#d1a27c] disabled:cursor-not-allowed 
                       transition text-lg font-semibold">
            {submitting ? 'Submitting...' : 'Submit Article'}
          </button>
        </form>

        {/* GUIDELINES */}
        <div className="mt-8 p-5 bg-[#fff4e3] rounded-xl border border-[#e6ceb0]">
          <h3 className="font-semibold text-[#623b22] mb-2">Submission Guidelines:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Articles should be original and respectful</li>
            <li>• Focus on Indian culture, heritage, or Swadeshi topics</li>
            <li>• Minimum 100 characters required</li>
            <li>• All submissions are reviewed before publication</li>
          </ul>
        </div>

      </div>
    )}

    {/* PUBLISHED ARTICLES */}
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center text-[#8c4b21] mb-6">Published Articles</h2>

      {/* SEARCH BAR */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title, content, or author..."
            className="w-full px-4 py-3 pl-12 border border-[#d5c3b1] bg-white rounded-xl shadow-sm 
                       focus:ring-2 focus:ring-[#b35a17] outline-none"
          />
          <span className="absolute left-4 top-3 text-gray-500">🔍</span>
        </div>
      </div>

      {/* NO ARTICLES */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-xl shadow-md border border-[#eadfcf]">
          <div className="text-gray-600 text-lg mb-4">No matching articles found.</div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-[#b35a17] text-white px-6 py-2 rounded-lg hover:bg-[#9a4d14] transition"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-center text-gray-700 mb-6">
            Showing <span className="font-semibold">{filteredArticles.length}</span> articles
          </p>

          {/* ARTICLE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <div
                key={article._id}
                className="bg-white rounded-xl shadow-lg border border-[#eadfcf] overflow-hidden 
                           hover:shadow-xl transition-all"
              >
                <div className="bg-[#faf5ee] px-5 py-4 border-b border-[#e6d8c7]">
                  <h3 className="text-lg font-semibold text-[#623b22] mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#a15a2d] font-medium">
                    By {article.authorName || "Anonymous"}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {article.content.length > 120
                      ? article.content.substring(0, 120) + "..."
                      : article.content}
                  </p>

                  <button className="text-[#b35a17] hover:text-[#8c4b21] text-sm font-semibold">
                    Read More →
                  </button>
                </div>

                <div className="px-5 py-3 bg-[#faf5ee] border-t border-[#e6d8c7] text-right text-xs text-gray-600">
                  {new Date(article.createdAt).toLocaleDateString()}
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
