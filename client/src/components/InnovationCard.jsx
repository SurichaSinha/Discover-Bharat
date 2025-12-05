import { useAuth } from '../context/AuthContext';

const InnovationCard = ({ innovation, onVote, isUserOwn = false }) => {
  const { user } = useAuth();

  const handleVoteClick = () => {
    if (!user) {
      alert('Please log in to vote on innovations.');
      return;
    }
    onVote(innovation._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header with title and state */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {innovation.title}
          </h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full font-medium">
            {innovation.state}
          </span>
        </div>

        {/* Vote Section */}
        <div className="flex flex-col items-center ml-4">
          {isUserOwn ? (
            <div className="text-center">
              <div className="text-sm text-green-600 font-medium mb-2">Your Innovation</div>
              <div className="text-2xl font-bold text-green-600">{innovation.votes}</div>
              <div className="text-sm text-gray-500">votes received</div>
            </div>
          ) : user ? (
            <>
              <button
                onClick={handleVoteClick}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium mb-2"
                disabled={innovation.voters?.includes(user.id)}
              >
                {innovation.voters?.includes(user.id) ? '✅ Voted' : '👍 Vote'}
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{innovation.votes}</div>
                <div className="text-sm text-gray-500">votes</div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Login to vote</div>
              <div className="text-2xl font-bold text-green-600">{innovation.votes}</div>
              <div className="text-sm text-gray-500">votes</div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {innovation.description}
      </p>

      {/* Footer with submitter and date */}
      <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        <div>
          {innovation.submittedBy ? (
            <span>Submitted by: {innovation.submittedBy.name || 'Anonymous'}</span>
          ) : (
            <span>Anonymous submission</span>
          )}
        </div>
        <div>
          {new Date(innovation.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default InnovationCard;
