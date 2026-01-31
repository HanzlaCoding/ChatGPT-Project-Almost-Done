import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Apple, Loader2, Eye, EyeOff } from "lucide-react";
import ImageSlider from "../components/ImageSlider";
import { authApi } from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  // 1. State Management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // <--- New Success State
  const [showPassword, setShowPassword] = useState(false);

  // 2. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess(""); // Clear success message if they type again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Reset status

    // Basic Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.post("/login", formData);
      console.log("Login Success:", res.data);

      // Store token
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 1. Set Success Message
      setSuccess("Login successful! Redirecting...");

      // 2. Wait 1.5 seconds so user can read the message, then redirect
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
      setIsLoading(false); // Stop loading only on error (keep it running on success for smooth transition)
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#2d2d39] p-4 font-sans overflow-hidden">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-4xl bg-[#1e1e24] shadow-2xl min-h-175">
        {/* Left Side - Image Slider */}
        <div className="hidden w-1/2 lg:block relative bg-[#1e1e24]">
          <ImageSlider />
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col justify-center bg-[#1e1e24] p-8 lg:w-1/2 lg:p-16">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="mb-2 text-3xl font-heading font-medium text-white">
              Log in
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#a5a6f6] hover:underline">
                Create account
              </Link>
            </p>

            {/* --- ERROR MESSAGE --- */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <span className="block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            {/* --- SUCCESS MESSAGE --- */}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-20"
                />

                {/* Password Controls Container */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#a5a6f6] hover:underline whitespace-nowrap"
                  >
                    Forgot?
                  </Link>
                </div>
              </div>

              <button
                disabled={isLoading || success} // Disable if loading OR if success (prevent double submit)
                className="flex w-full items-center justify-center rounded-xl bg-[#6c5dd3] p-4 text-sm font-medium text-white hover:bg-[#5b4eb8] transition-colors shadow-lg shadow-[#6c5dd3]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {success ? "Redirecting..." : "Logging in..."}
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            <div className="my-8 flex items-center justify-between gap-4">
              <div className="h-px w-full bg-[#2b2b36]"></div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Or log in with
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
  <button
    type="button"
    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#2b2b36] bg-transparent text-sm font-medium text-white hover:bg-[#2b2b36] transition-colors"
  >
    {icon}
    {label}
  </button>
);

export default Login;
