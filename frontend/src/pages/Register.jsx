import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Apple, Eye, EyeOff, Loader2 } from "lucide-react";
import ImageSlider from "../components/ImageSlider";
import { useContext, useState } from "react";
import { authApi } from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  // 1. Unified State
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  // 2. UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Initialize as string (empty)

  // 3. Dynamic Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (error) setError("");
  };

  // 4. Client-Side Validation Helper
  const validateForm = () => {
    if (!formData.firstname || !formData.lastname)
      return "Full name is required.";
    if (!formData.username) return "Username is required.";
    if (!formData.email.includes("@")) return "Please enter a valid email.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // A. Run Validation first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Stop here if validation fails
    }

    setIsLoading(true);

    try {

      const res = await authApi.post("/register", formData, {
        withCredentials: true,
      });
      // Optional: Show success message or redirect immediately
      navigate("/login");
    } catch (err) {

      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#2d2d39] p-4 font-sans overflow-hidden">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-4xl bg-[#1e1e24] shadow-2xl min-h-175">
        {/* Left Side */}
        <div className="hidden w-1/2 lg:block relative bg-[#1e1e24]">
          <ImageSlider />
        </div>

        {/* Right Side */}
        <div className="flex w-full flex-col justify-center bg-[#1e1e24] p-8 lg:w-1/2 lg:p-16">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="mb-2 text-3xl font-heading font-medium text-white">
              Create an account
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-[#a5a6f6] hover:underline">
                Log in
              </Link>
            </p>

            {/* Error Message Display */}
            {/* C. Check if error exists before rendering */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <InputField
                    name="firstname"
                    placeholder="First name"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    name="lastname"
                    placeholder="Last name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <InputField
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />

              <InputField
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="relative">
                <InputField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-xl bg-[#6c5dd3] p-4 text-sm font-medium text-white hover:bg-[#5b4eb8] transition-colors shadow-lg shadow-[#6c5dd3]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="my-8 flex items-center justify-between gap-4">
              <div className="h-px w-full bg-[#2b2b36]"></div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Or register with
              </span>
              <div className="h-px w-full bg-[#2b2b36]"></div>
            </div>

            <div className="flex gap-4">
              <SocialButton
                icon={
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="h-5 w-5"
                  />
                }
                label="Google"
              />
              <SocialButton
                icon={<Apple className="h-5 w-5" />}
                label="Apple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const InputField = ({ type = "text", className = "", ...props }) => (
  <input
    type={type}
    className={`w-full rounded-xl bg-[#2b2b36] border border-[#2b2b36] p-4 text-sm text-white placeholder-gray-500 focus:border-[#6c5dd3] focus:outline-none transition-colors ${className}`}
    {...props}
  />
);

const SocialButton = ({ icon, label }) => (
  <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#2b2b36] bg-transparent text-sm font-medium text-white hover:bg-[#2b2b36] transition-colors">
    {icon}
    {label}
  </button>
);

export default Register;
