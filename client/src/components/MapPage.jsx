import { useState, useEffect } from 'react';
import api from '../api/axios';
import mapbanner from '../image/mapbanner.jpg';
import IndiaMap from "../components/IndiaMap";

const MapPage = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateDetails, setStateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/api/states');
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateClick = async (id) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/api/states/${id}`);
      setStateDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
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
      <div className="flex justify-center py-12 text-xl text-gray-700">
        Loading states...
      </div>
    );
  }

  return (
    <div className="flex bg-[#F5EDE2] min-h-screen ">

      {/* LEFT MAIN AREA */}
      <div className="flex-1 p-6">

        {/* TOP HERO BANNER */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-xl mb-12">
          <img
            src={mapbanner}
            alt="India Heritage"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          <h1 className="absolute bottom-4 left-6 text-4xl font-bold text-white drop-shadow-lg">
            Explore India
          </h1>
        </div>

        <IndiaMap
            onStateClick={async (stateName) => {
            try {
              const res = await api.get(`/api/states/byName/${stateName}`);
              setSelectedState(res.data._id);
              setStateDetails(res.data);
            } catch (error) {
              console.error("State fetch error", error);
              }
            console.log("Clicked state:", stateName);
          }
          
        }
/>


        {/* CARD GRID */}
        <div className="bg-white rounded-xl shadow-xl p-7 border border-[#e7d8c7]">

          <h2 className="text-3xl font-semibold text-center text-[#A34417] mb-5">
            States of India
          </h2>

          <p className="text-gray-700 text-center mb-8">
            Discover culture, heritage, cuisine & cities.
          </p>

          {/* GRID OF STATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {states.map((state) => (
              <div
                key={state._id}
                onClick={() => handleListClick(state)}
                className={`
                  p-5 rounded-xl border bg-white cursor-pointer 
                  transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1
                  ${
                    selectedState === state._id
                      ? "border-[#A34417] shadow-2xl bg-[#FFF7F1] scale-105"
                      : "border-gray-300"
                  }
                `}
              >
                <h3 className="text-xl font-bold text-[#0E3B3A] mb-2 text-center">
                  {state.name}
                </h3>

                <p className="text-center text-sm text-gray-600 mb-2">
                  <span className="font-medium">Capital:</span> {state.capital || "N/A"}
                </p>

                {state.overview && (
                  <p className="text-gray-700 text-sm text-center">
                    {state.overview.substring(0, 70)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="w-96 bg-white shadow-2xl rounded-l-3xl p-6 border-l border-gray-300 hidden lg:block">

        {detailsLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-12 w-12 border-4 border-[#A34417] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading details...</p>
          </div>
        ) : stateDetails ? (
          <>

            <h2 className="text-3xl font-bold text-center text-[#A34417] mb-6 underline underline-offset-4 decoration-[#E2B38A]">
              {stateDetails.name}
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">

              {stateDetails.overview && (
                <section className="pb-2 border-b border-gray-300">
                  <h3 className="font-semibold text-lg text-[#0E3B3A] mb-1">Overview</h3>
                  <p>{stateDetails.overview}</p>
                </section>
              )}

              {stateDetails.culture?.length > 0 && (
                <section className="pb-2 border-b border-gray-300">
                  <h3 className="font-semibold text-lg text-[#0E3B3A] mb-1">Cultural Heritage</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {stateDetails.culture.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </section>
              )}

              {stateDetails.food?.length > 0 && (
                <section className="pb-2 border-b border-gray-300">
                  <h3 className="font-semibold text-lg text-[#0E3B3A] mb-1">Famous Cuisine</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {stateDetails.food.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </section>
              )}

              {stateDetails.cities?.length > 0 && (
                <section className="pb-2">
                  <h3 className="font-semibold text-lg text-[#0E3B3A] mb-1">Major Cities</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    {stateDetails.cities.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </section>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 opacity-70">
            <div className="text-7xl mb-4">🗺️</div>
            <p className="text-gray-700 text-lg">Select a state to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
