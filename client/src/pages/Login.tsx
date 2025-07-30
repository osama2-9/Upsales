import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { axiosInstance } from "@/api/axios";
import { useUser } from "@/recoil/useUser";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const {setUserAtom} = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const resetForm=()=>{
    setFormData({
        email:"",
        password:"",
    })
    setErrors({
        email:"",
        password:"",
    })
    setServerError("")
}

  const handleSubmit = async () => {
   resetForm();
    setIsLoading(true);
    if (!formData.email || !formData.password) {
      if (!formData.email) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      }
      if (!formData.password) {
        setErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      }
      return setIsLoading(false);
    }
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      const data = await response.data;
     setUserAtom(data.user);
     navigate("/");
    } catch (error: any) {
      console.log(error);
      resetForm();
      setServerError(error.response.data.error);
    }
    finally{

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Please sign in to your account
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {errors.email}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-accent hover:text-accent-foreground rounded-r-md transition-colors"
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
                  <AlertDescription className="text-xs">
                    {errors.password}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            {serverError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {serverError}
                  </AlertDescription>
                </Alert>
              )}

            <div className="flex items-center justify-between">
            
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

           

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to={'/signup'}
                className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                

              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
