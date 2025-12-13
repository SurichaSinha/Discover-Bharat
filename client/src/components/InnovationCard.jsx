import { useAuth } from "../context/AuthContext";

const InnovationCard = ({ innovation, onVote, isUserOwn = false }) => {
  const { user } = useAuth();

  const handleVoteClick = () => {
    if (!user) {
      alert("Please log in to vote on innovations.");
      return;
    }
    onVote(innovation._id);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-[#eadfcf] p-6 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">

        {/* Title + State Badge */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#623b22] mb-2">
            {innovation.title}
          </h3>

          <span
            className="inline-block bg-[#f7e7d2] text-[#8c4b21] text-xs px-3 py-1 
                       rounded-full font-semibold shadow-sm"
          >
            {innovation.state}
          </span>
        </div>

        {/* Voting Section */}
        <div className="flex flex-col items-center ml-6">

          {isUserOwn ? (
            <div className="text-center">
              <div className="text-sm text-green-700 font-medium mb-1">Your Innovation</div>
              <div className="text-3xl font-bold text-green-700">{innovation.votes}</div>
              <div className="text-xs text-gray-500">votes received</div>
            </div>
          ) : user ? (
            <>
              <button
                onClick={handleVoteClick}
                disabled={innovation.voters?.includes(user.id)}
                className={`px-4 py-2 rounded-lg text-white font-semibold mb-2 transition
                  ${
                    innovation.voters?.includes(user.id)
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-[#b35a17] hover:bg-[#9a4d14]"
                  }
                `}
              >
                {innovation.voters?.includes(user.id) ? "✔ Voted" : "👍 Vote"}
              </button>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#b35a17]">{innovation.votes}</div>
                <div className="text-xs text-gray-500">votes</div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Login to vote</div>
              <div className="text-3xl font-bold text-[#b35a17]">{innovation.votes}</div>
              <div className="text-xs text-gray-500">votes</div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-6">
        {innovation.description}
      </p>

      {/* Footer */}
      <div
        className="flex justify-between items-center text-xs text-gray-600 
                   border-t border-[#eadfcf] pt-4"
      >
        <span>
          Submitted by:{" "}
          <span className="font-semibold text-[#623b22]">
            {innovation.submittedBy?.name || "Anonymous"}
          </span>
        </span>

        <span className="text-[#8c4b21] font-medium">
          {new Date(innovation.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default InnovationCard;
