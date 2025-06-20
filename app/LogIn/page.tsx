"use client";

import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";
import axios from "axios";

interface LoginResponse {
    token: string;
    user: any;
}

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/main');
        }
    }, [isAuthenticated, router]);

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isServerDown, setIsServerDown] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setIsServerDown(false);

        try {
            await login(formData.email, formData.password);
            // The login function in AuthContext will handle the redirect
        } catch (err: any) {
            console.error("Login error:", err);

            if (err.message?.includes("Network Error")) {
                setIsServerDown(true);
                setError("Unable to connect to the server. Please check your internet connection.");
            } else if (err.response?.status === 500) {
                setIsServerDown(true);
                setError("Server error. Please try again later.");
            } else {
                setError(err.response?.data?.message || "An error occurred during login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        const mockUser = {
            _id: "demo123",
            username: "Demo User",
            email: formData.email || "demo@example.com",
        };

        // Store mock token and user data in localStorage
        localStorage.setItem("token", "demo-token-123");
        localStorage.setItem("user", JSON.stringify(mockUser));
        router.push("/main"); // Redirect to main page
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">LogIn</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                        {isServerDown && (
                            <div className="mt-2 text-sm">
                                <p>The database connection is currently unavailable.</p>
                                <p className="mt-1">
                                    If you're the developer: Please whitelist your IP address in MongoDB Atlas.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </div>

                    {isServerDown && (
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Continue with Demo Mode
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Demo mode bypasses authentication for development purposes
                            </p>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <p>
                            Don't have an account?{" "}
                            <Link href="/SignIn" className="text-blue-500 hover:text-blue-700">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
