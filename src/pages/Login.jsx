import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

function Login({ login }) {
  toastr.options = {
    "positionClass": "toast-bottom-right"
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://aksamedia-backend.carroo.my.id/api/login",
        {
          username: username,
          password: password,
        }
      );
      if (response.data.data.token) {
        sessionStorage.setItem("token", response.data.data.token);
        sessionStorage.setItem(
          "admin",
          JSON.stringify(response.data.data.admin)
        );
        login();
        toastr.success("Login Successfully");
        navigate("/");
      } else {
        toastr.error("Something went wrong");
      }
    } catch (error) {
      toastr.error("use username:admin and password:admin123 for login");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg border shadow-md m-2 dark:border-gray-700 border-gray-300 mt-12">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight dark:text-slate-50 text-black mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <div className="flex flex-wrap mb-3">
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                Username
              </label>
              <input
                className="w-full h-10 rounded-md border dark:border-gray-600 border-gray-300 bg-slate-50 dark:bg-gray-900 text-black dark:text-gray-200 px-3 py-2 text-sm"
                placeholder="admin"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap">
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                Password
              </label>
              <input
                className="w-full h-10 rounded-md border dark:border-gray-600 border-gray-300 bg-slate-50 dark:bg-gray-900 text-black dark:text-gray-200 px-3 py-2 text-sm"
                placeholder="admin123"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center p-6">
            <button
              className="w-full items-center justify-center rounded-md text-sm font-medium dark:bg-slate-600 bg-black dark:hover:bg-slate-700 hover:bg-black/90 text-slate-50 h-10 px-4 py-2"
              type="submit"
            >
              {loading ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300 flex justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 24a12 12 0 0012-12h-4a8 8 0 01-8 8v4z"
                      ></path>
                    </svg>
                    Loading...
                  </p>
                </>
              ) : (
                <>Login</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
