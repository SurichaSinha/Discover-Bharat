import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#623b22] text-xl">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e8] py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white border border-[#eddcc7] shadow-lg rounded-2xl p-10">

        {/* Avatar + Title */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-[#b35a17] text-white flex items-center justify-center text-4xl font-bold shadow">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <h1 className="text-3xl font-bold text-[#623b22] mt-4">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>

          <div className="w-20 h-1 bg-[#c57a31] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* User Info Section */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[#623b22] font-semibold mb-1">Name</label>
            <input
              type="text"
              value={user.name || ""}
              disabled
              className="w-full px-4 py-2 border border-[#eadfcf] rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#623b22] font-semibold mb-1">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-4 py-2 border border-[#eadfcf] rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-[#623b22] font-semibold mb-1">Role</label>
            <input
              type="text"
              value={user.role || "User"}
              disabled
              className="w-full px-4 py-2 border border-[#eadfcf] rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save Button (Future - if you add editing) */}
        
      </div>
    </div>
  );
};

export default Profile;
