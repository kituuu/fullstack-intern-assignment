"use client";

import { useState } from "react";
import { setToken, setUser } from "@/redux/auth/auth.slice";

import { useAppDispatch } from "@/redux/store";
import useAuthSession from "@/hooks/useAuthSession";
import axios from "axios";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { user, loading } = useAuthSession();
  const handleLogin = async () => {
    try {
      toast.loading("Logging in...");
      const response = await axios.post("/api/auth/user/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        dispatch(setToken(response.data.authToken));
        dispatch(setUser({ username: response.data.username }));
        setUsername("");
        setPassword("");
        toast.dismiss();
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.error ||
            "An error occurred during login. Please try again."
        );
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {loading && <center>Checking Session...</center>}
        {user && (
          <div>
            <h2 className="text-xl font-bold text-green-600">
              Welcome, {user.username}
            </h2>
          </div>
        )}{" "}
        {!user && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
        {!loading && (
          <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
            <h3 className="text-lg font-semibold">
              The hook should be usable like this:{" "}
            </h3>
            <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
              <code>
                {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
