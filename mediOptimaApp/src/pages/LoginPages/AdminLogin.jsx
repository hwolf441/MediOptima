import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import PurpleLogo from "../../assets/LandingPage/LogoPurple.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Prefill adminId if remembered
  useEffect(() => {
    const rememberedAdminId = localStorage.getItem("rememberedAdminId");
    if (rememberedAdminId) {
      setFormData((prev) => ({ ...prev, adminId: rememberedAdminId }));
    }
  }, []);

  const { mutate: loginAdmin, isLoading } = useMutation({
    mutationFn: (credentials) => authApi.loginAdmin(credentials),
    onSuccess: (data) => {
    
      login(data.token, data.role); 
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.adminId.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Store adminId if "Remember me" is checked
    if (e.target.elements["remember-me"].checked) {
      localStorage.setItem("rememberedAdminId", formData.adminId);
    } else {
      localStorage.removeItem("rememberedAdminId");
    }

    loginAdmin({
      staffId: formData.adminId.trim(),
      password: formData.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Branding Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="text-center space-y-6">
            <img
              src={PurpleLogo}
              alt="Hospital Logo"
              className="w-48 mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold">Admin Portal</h2>
            <p className="text-blue-100 mt-2">
              Secure access to hospital management system
            </p>
            <div className="mt-8">
              <div className="h-1 w-16 bg-blue-400 mx-auto mb-4"></div>
              <p className="text-sm text-blue-200">
                For authorized administrators only
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-600 mt-2">
              Please enter your credentials to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="adminId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin ID
              </label>
              <input
                type="text"
                id="adminId"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your admin ID"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                  defaultChecked={!!localStorage.getItem("rememberedAdminId")}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Mobile Branding */}
          <div className="md:hidden mt-8 pt-6 border-t border-gray-200 text-center">
            <img
              src={PurpleLogo}
              alt="Hospital Logo"
              className="w-32 mx-auto mb-4"
            />
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Hospital Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
