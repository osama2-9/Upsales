import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { axiosInstance } from "@/api/axios";
import { useUser } from "@/recoil/useUser";
import { Link, useNavigate } from "react-router-dom";

export default function SignupForm() {
  const { setUserAtom } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{ name: string; email: string; password: string }>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name: string; email: string; password: string }>({
    name: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setErrors({ name: "", email: "", password: "" });
    setServerError("");
  };

  const handleSubmit = async () => {
    resetForm();
    setIsLoading(true);

    let valid = true;
    if (!formData.name) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      valid = false;
    }
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      valid = false;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      valid = false;
    }
    if (!valid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      const data = response.data;
      setUserAtom(data.user);
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setServerError(error.response?.data?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Sign up to get started</p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your name"
              />
              {errors.name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            {serverError && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{serverError}</AlertDescription>
              </Alert>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full h-10 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to={'/login'} className="font-medium text-primary hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
