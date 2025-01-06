import { useUserStore } from "../stores/useUserStore.js";
import { Link } from "react-router-dom";
function Profile() {
  const { user, logout } = useUserStore();

  console.log(user);
  const onLogout = () => {
    logout();
  };

  function formatMongoDate(createdAt) {
    // Ensure the input is a Date object
    const date = new Date(createdAt);

    // Format the date (e.g., DD-MM-YYYY)
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto mt-10 bg-gray-800 text-gray-300 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.profile || "avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-emerald-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="mt-8 flex flex-col items-center">
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase">
                  Full Name
                </h3>
                <p className="mt-1 text-base font-medium">
                  {user.name || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase">
                  Email
                </h3>
                <p className="mt-1 text-base font-medium">
                  {user.email || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase">
                  Gender
                </h3>
                <p className="mt-1 text-base font-medium capitalize">
                  {user.gender || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase">
                  Member Since
                </h3>
                <p className="mt-1 text-base font-medium">
                  {formatMongoDate(user.createdAt) || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Link
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow transition"
            to={"/"}
          >
            Home
          </Link>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow transition"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
