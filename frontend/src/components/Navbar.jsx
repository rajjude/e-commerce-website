import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore.js";
import { useState } from "react";

function Navbar() {
  const { logout, user } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";

  const [isImageVisible, setIsImageVisible] = useState(false);

  const handleClick = () => {
    setIsImageVisible(!isImageVisible);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
            >
              E-Commerce
            </Link>

            <nav className="flex flex-wrap items-center gap-4">
              <Link
                to={"/"}
                className=" text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                {" "}
                Home{" "}
              </Link>

              {user && (
                <Link
                  to={"/cart"}
                  className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  <ShoppingCart
                    className="inline-block mr-1 group-hover:text-emerald-400"
                    size={20}
                  />
                  <span className="hidden sm:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transistion duration-300 ease-in-out">
                      {cart?.length}
                    </span>
                  )}
                </Link>
              )}

              {isAdmin && (
                <Link
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                transition duration-300 ease-in-out flex items-center"
                  to={"/secret-dashboard"}
                >
                  <Lock className="inline-block mr-1" size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {user && (
                <div className="relative group flex items-center gap-2">
                  <img
                    src={user?.profile || "/avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-gray-400"
                    onClick={handleClick}
                  />
                  <span className="hidden sm:inline text-gray-300">
                    <Link to={"/profile"}>{user.name || "User"}</Link>
                  </span>
                </div>
              )}

              {user ? (
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                rounded-md flex items-center transition duration-300 ease-in-out"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline ml-2">Log Out</span>
                </button>
              ) : (
                <>
                  <Link
                    to={"/signup"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                  >
                    <UserPlus className="mr-2" size={18} />
                    Sign Up
                  </Link>
                  <Link
                    to={"/login"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                  >
                    <LogIn className="mr-2" size={18} />
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {isImageVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm mx-auto">
            <img
              src={user.profile}
              alt="Profile"
              className="w-full h-auto rounded-lg shadow-lg"
            />

            <X
              size={30}
              className="absolute top-2 right-2 text-white cursor-pointer hover:text-emerald-400"
              onClick={handleClick}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
