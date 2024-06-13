"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post("/api/auth/user/register", {
        email,
        username,
        password,
      });

      if (response.data.success) {
        setEmail("");
        setUsername("");
        setPassword("");
        router.push("/");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 mt-4 border rounded-md"
          />
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
            onClick={handleRegister}
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
