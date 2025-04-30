"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { authService } from "../services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/user_details";
const AdminLoginComponent: React.FC = () => {
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setCurrentDateTime(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  console.log(token, user);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!password) {
        throw new Error("Please enter your password");
      }

      const response = await authService.login(
        email + "@mediversal.in",
        password
      );

      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);

        console.log("Login successful:", response.data);
        toast.success("Login successful!");

        router.push("/dashboard");
      } else {
        if (
          response.data.message ===
          "Account is locked due to too many failed attempts."
        ) {
          toast.error(
            "Your account is locked. Please contact the administrator."
          );
        } else {
          toast.error(
            response.data.message || "Login failed. Please try again."
          );
        }
      }
    } catch (error: unknown) {
      console.error("Error during login:", error);

      let errorMsg = "Login failed. Please try again.";

      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col justify-between">
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-sm text-gray-600 pt-14">
        <div className="ml-auto">{currentDateTime}</div>
      </div>

      <div className="flex justify-center items-center flex-1 mt-16">
        <div className="bg-white w-[550px] p-14 rounded">
          <h1 className="text-[#0088B1] text-[40px] font-bold text-left mb-10 font-zak">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#E5E8E9] rounded-r-0 focus:outline-none focus:border-[#0088B1] bg-[#F8F8F8] text-[#161D1F]"
                  placeholder="Enter your official email"
                />
                <span className="bg-[#E8F4F7] text-[#0088B1] p-2 border border-[#E5E8E9] border-l-0 rounded-r shadow-[ -4px_0_6px_0_#E8F4F7 ]">
                  @mediversal.in
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#E5E8E9] rounded focus:outline-none focus:border-[#0088B1] bg-[#F8F8F8] text-[#161D1F]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye size={20} color="#B0B6B8" />
                  ) : (
                    <EyeOff size={20} color="#B0B6B8" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#0088B1] text-white py-3 px-4 rounded-lg hover:bg-[#006d8f] transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="mr-3 size-5 animate-spin"
                      viewBox="0 0 24 24"
                    ></svg>
                    Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center mb-20">
        <p className="text-sm text-[#000000] mb-2">Accredited by</p>
        <div className="flex justify-center gap-4">
          <Image src="/image/NABH.svg" alt="NABH" width={50} height={50} />
          <Image src="/image/NABL.svg" alt="NABL" width={50} height={50} />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginComponent;
