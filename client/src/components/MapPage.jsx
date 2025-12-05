import { useState, useEffect } from 'react';
import api from '../api/axios';

const MapPage = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateDetails, setStateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/api/states');
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateClick = async (stateId) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/api/states/${stateId}`);
      setStateDetails(response.data);
    } catch (error) {
      console.error('Error fetching state details:', error);
      setStateDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleListClick = (state) => {
    setSelectedState(state._id);
    handleStateClick(state._id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Loading states...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Explore India
          </h1>

          {/* State Grid */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">States of India</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the rich cultural heritage, traditions, and diversity of India's states and union territories.
                Click on any state to explore its unique characteristics, cuisine, crafts, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {states.map((state) => (
                <div
                  key={state._id}
                  onClick={() => handleListClick(state)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedState === state._id
                      ? 'bg-blue-50 border-blue-500 shadow-lg scale-105'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{state.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Capital:</span> {state.capital || 'N/A'}
                    </p>
                    {state.overview && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {state.overview.length > 80
                          ? `${state.overview.substring(0, 80)}...`
                          : state.overview
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {states.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No states available</div>
                <p className="text-gray-400">Please check back later as we populate state information.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel - Now below the grid on mobile, side on desktop */}
      <div className="w-full lg:w-96 mt-8 lg:mt-0 lg:ml-6">
        <div className="bg-white rounded-lg shadow-lg overflow-y-auto">
          {detailsLoading ? (
            <div className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading state details...</p>
              </div>
            </div>
          ) : stateDetails ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
                {stateDetails.name}
              </h2>

              <div className="space-y-6">
                {stateDetails.overview && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{stateDetails.overview}</p>
                  </div>
                )}

                {stateDetails.capital && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Capital City
                    </h3>
                    <p className="text-gray-700 text-lg font-medium">{stateDetails.capital}</p>
                  </div>
                )}

                {stateDetails.culture && stateDetails.culture.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Cultural Heritage
                    </h3>
                    <ul className="space-y-2">
                      {stateDetails.culture.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stateDetails.food && stateDetails.food.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Famous Cuisine
                    </h3>
                    <ul className="space-y-2">
                      {stateDetails.food.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2 mt-1">🍛</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stateDetails.crafts && stateDetails.crafts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Traditional Crafts
                    </h3>
                    <ul className="space-y-2">
                      {stateDetails.crafts.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">🎨</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stateDetails.cities && stateDetails.cities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Major Cities
                    </h3>
                    <ul className="space-y-2">
                      {stateDetails.cities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-2 mt-1">🏙️</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stateDetails.sustainability && stateDetails.sustainability.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Green Initiatives
                    </h3>
                    <ul className="space-y-2">
                      {stateDetails.sustainability.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">🌱</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">State Information</h2>
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-600 leading-relaxed">
                  Click on any state card above to explore its rich cultural heritage,
                  traditional crafts, famous cuisine, and unique characteristics that make
                  each state special in India's diverse tapestry.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
