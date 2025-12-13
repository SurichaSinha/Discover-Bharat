import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import InnovationCard from './InnovationCard';
import innovation1 from '../image/innovation1.jpeg';
import innovation2 from '../image/innovation2.jpeg';
import innovation3 from '../image/innovation3.jpeg'; 

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
  <div className="flex bg-[#F5EDE2] min-h-screen px-4 md:px-8 py-8">

    {/* LEFT MAIN CONTENT */}
    <div className="flex-1 container mx-auto pr-6">

      <h1 className="text-4xl font-bold text-center mb-10 text-[#8c4b21]">
        Community Innovations
      </h1>
      <div className="w-28 h-1 bg-[#d9b28c] mx-auto mb-10 rounded-full"></div>

      {/* Submit Innovation Form */}
      {!user ? (
        <div className="bg-white rounded-xl shadow-md p-10 mb-10 text-center border border-[#eadfcf]">
          <h2 className="text-xl font-semibold mb-3 text-[#623b22]">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to submit and vote on innovations.
          </p>
          <a
            href="/login"
            className="bg-[#b35a17] text-white px-6 py-2 rounded-lg hover:bg-[#9a4d14] transition"
          >
            Log In
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-[#eadfcf]">
          <h2 className="text-2xl font-semibold mb-6 text-[#623b22]">Share Your Innovation</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-1">
                Innovation Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#dac8b3] rounded-lg bg-[#fdf8f2] 
                           focus:ring-2 focus:ring-[#b35a17] outline-none"
                placeholder="Enter title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-1">
                Description *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#dac8b3] rounded-lg bg-[#fdf8f2]
                           focus:ring-2 focus:ring-[#b35a17] outline-none"
                placeholder="Describe your innovation"
              />
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#623b22] mb-1">
                State/Region *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#dac8b3] rounded-lg bg-[#fdf8f2]
                           focus:ring-2 focus:ring-[#b35a17] outline-none"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#b35a17] text-white py-2.5 rounded-lg hover:bg-[#9a4d14] transition font-semibold"
            >
              {submitting ? "Submitting..." : "Submit Innovation"}
            </button>
          </form>
        </div>
      )}

      {/* User Innovation */}
      {user && userInnovation && (
        <div className="bg-[#f1fbe8] border border-green-200 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Your Innovation
          </h2>
          <InnovationCard innovation={userInnovation} onVote={handleVote} isUserOwn />
        </div>
      )}

      {/* Innovations List */}
      <div className="space-y-6 pb-10">
        <h2 className="text-3xl font-semibold mb-6 text-[#623b22]">
          Recent Innovations
        </h2>

        {innovations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-[#eadfcf]">
            <p className="text-gray-600 text-lg">No innovations yet. Be the first to submit!</p>
          </div>
        ) : (
          innovations.map((innovation) => (
            <InnovationCard
              key={innovation._id}
              innovation={innovation}
              onVote={handleVote}
            />
          ))
        )}
      </div>
    </div>

    {/* RIGHT SIDEBAR */}
    <div className="w-80 hidden lg:block pl-6">

      <div className="sticky top-24 space-y-6">

        {/* Sidebar Title */}
        <h3 className="text-xl font-bold text-[#623b22] mb-3">
          Inspiration Gallery
        </h3>

        {[
          
          innovation1,
          innovation2,
          innovation3
        ].map((img, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={img}
              alt="Innovation Inspiration"
              className="w-full h-52 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        <p className="text-sm text-gray-700 mt-4 italic">
          “Innovation is seeing what everybody has seen, and thinking what nobody has thought.”
        </p>
      </div>
    </div>
  </div>
);
};

export default InnovationPage;
