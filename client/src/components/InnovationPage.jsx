import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import InnovationCard from './InnovationCard';

const InnovationPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    state: ''
  });

  const [states, setStates] = useState([
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'Punjab', 'West Bengal', 'Delhi', 'Other'
  ]);
  const [userInnovation, setUserInnovation] = useState(null);

  console.log('InnovationPage render - formData:', formData, 'states:', states);

  const fetchStates = useCallback(async () => {
    try {
      console.log('Fetching states...');
      const response = await api.get('/api/states');
      console.log('States API response:', response.data);

      // Extract state names for dropdown
      const stateNames = response.data.map(state => state.name);
      console.log('State names:', stateNames);

      if (stateNames.length > 0) {
        // Use states from database if available
        setStates(stateNames);
      }
      // If no states in database, keep the default states that are already set
    } catch (error) {
      console.error('Error fetching states:', error);
      // Fallback to hardcoded states if API fails
      setStates([
        'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
        'Gujarat', 'Rajasthan', 'Punjab', 'West Bengal', 'Delhi', 'Other'
      ]);
    }
  }, []); // No dependencies needed for API call

  const fetchInnovations = useCallback(async () => {
    try {
      const response = await api.get('/api/innovations');
      const allInnovations = response.data;

      if (user) {
        // Separate user's own innovation from others
        const userOwnInnovation = allInnovations.find(innovation =>
          innovation.submittedBy && innovation.submittedBy._id === user.id
        );
        const otherInnovations = allInnovations.filter(innovation =>
          !innovation.submittedBy || innovation.submittedBy._id !== user.id
        );

        setUserInnovation(userOwnInnovation);
        setInnovations(otherInnovations);
      } else {
        setInnovations(allInnovations);
      }
    } catch (error) {
      console.error('Error fetching innovations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStates();
    fetchInnovations();
  }, [user, fetchStates, fetchInnovations]); // Include all dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Form input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log('Updated formData:', { ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to submit an innovation.');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.state) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/innovations', formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        state: ''
      });
      // Refresh innovations to show the new one in user's section
      await fetchInnovations();
      alert('Innovation submitted successfully!');
    } catch (error) {
      console.error('Error submitting innovation:', error);
      if (error.response?.status === 401) {
        alert('Please log in to submit an innovation.');
      } else {
        alert('Error submitting innovation. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (innovationId) => {
    try {
      const response = await api.post(`/api/innovations/vote/${innovationId}`);
      // Update the innovation's vote count in the local state
      setInnovations(prev => prev.map(innovation =>
        innovation._id === innovationId
          ? { ...innovation, votes: response.data.votes }
          : innovation
      ));

      // Also update userInnovation if it's the user's own innovation being voted on
      if (userInnovation && userInnovation._id === innovationId) {
        setUserInnovation(prev => ({ ...prev, votes: response.data.votes }));
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting. You may have already voted or need to log in.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Loading innovations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Community Innovations
      </h1>

      {/* Submit Innovation Form */}
      {!user ? (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to submit and vote on innovations.
          </p>
          <a
            href="/login"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Log In
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Share Your Innovation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Innovation Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter innovation title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your innovation in detail"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State/Region *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {console.log('Rendering dropdown with states:', states, 'current formData.state:', formData.state)}
              <option value="">Select a state</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Innovation'}
          </button>
        </form>
        </div>
      )}

      {/* User's Innovation Section */}
      {user && userInnovation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Your Innovation</h2>
          <InnovationCard
            innovation={userInnovation}
            onVote={handleVote}
            isUserOwn={true}
          />
        </div>
      )}

      {/* Innovations List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Recent Innovations</h2>
        {innovations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-500 text-lg">No innovations yet. Be the first to share!</div>
          </div>
        ) : (
          innovations.map(innovation => (
            <InnovationCard
              key={innovation._id}
              innovation={innovation}
              onVote={handleVote}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default InnovationPage;
