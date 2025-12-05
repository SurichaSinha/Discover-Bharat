import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BookmarkButton = ({ stateId }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if state is bookmarked when component mounts or user changes
  useEffect(() => {
    if (user && user.bookmarks) {
      setIsBookmarked(user.bookmarks.includes(stateId));
    }
  }, [user, stateId]);

  const handleBookmark = async () => {
    if (!user) {
      alert('Please log in to bookmark states');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/auth/bookmark/${stateId}`);

      if (response.data.bookmarked !== undefined) {
        setIsBookmarked(response.data.bookmarked);
      }

      // You could show a toast notification here
      console.log(response.data.msg);
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('Error updating bookmark. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
        isBookmarked
          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating...
        </span>
      ) : (
        <span className="flex items-center">
          {isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;
