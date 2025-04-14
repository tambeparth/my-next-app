"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Edit3, LogOut, User, MapPin, Mail, Award, Check, X } from "lucide-react";

interface UserProfile {
    id: string;
    username: string;
    email: string;
    bio?: string;
    location?: string;
    avatar: string;
    interests?: string[];
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({
        id: "",
        username: "",
        email: "",
        bio: "",
        location: "",
        avatar: "/avatar-svgrepo-com.svg",
        interests: [],
    });
    const [tempInterests, setTempInterests] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/LogIn");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = (response.data as { user: UserProfile }).user;
                setProfile(userData);
                setFormData({
                    id: userData.id || "",
                    username: userData.username || "",
                    email: userData.email || "",
                    bio: userData.bio || "",
                    location: userData.location || "",
                    avatar: userData.avatar || "/avatar-svgrepo-com.svg",
                    interests: Array.isArray(userData.interests) ? userData.interests : [],
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                router.push("/LogIn");
            }
        };

        fetchProfile();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInterestKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tempInterests.trim()) {
            e.preventDefault();
            setFormData((prev) => ({
                ...prev,
                interests: [...(prev.interests || []), tempInterests.trim()],
            }));
            setTempInterests("");
        }
    };

    const removeInterest = (index: number) => {
        setFormData((prev) => {
            const newInterests = [...(prev.interests || [])];
            newInterests.splice(index, 1);
            return { ...prev, interests: newInterests };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/LogIn");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:5000/api/profile/update",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedUser = (response.data as { user: UserProfile }).user;
            setProfile(updatedUser);
            setFormData({
                id: updatedUser.id || "",
                username: updatedUser.username || "",
                email: updatedUser.email || "",
                bio: updatedUser.bio || "",
                location: updatedUser.location || "",
                avatar: updatedUser.avatar || "/avatar-svgrepo-com.svg",
                interests: Array.isArray(updatedUser.interests) ? updatedUser.interests : [],
            });
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(
                error instanceof Error && 'response' in error
                    ? `Error: ${(error as any).response?.data?.message || "Failed to update profile"}`
                    : "An unexpected error occurred. Please try again."
            );
        }
    };

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md animate-fade-in">
                            <div className="flex items-center">
                                <Check className="h-5 w-5 mr-2" />
                                <p>{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold">Profile Settings</h1>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-6 animate-pulse">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20 h-20 rounded-full bg-gray-200" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                                <div className="h-8 bg-gray-200 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                <img
                                                    src={formData.avatar}
                                                    alt={formData.username}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/avatar-svgrepo-com.svg";
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-2 rounded-full shadow-md hover:bg-indigo-600 transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-semibold text-gray-800">Change Avatar</h2>
                                            <p className="text-sm text-gray-500">Recommended size: 200x200px</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                rows={3}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.interests?.map((interest, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {interest}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeInterest(index)}
                                                            className="ml-2 text-indigo-500 hover:text-indigo-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={tempInterests}
                                                    onChange={(e) => setTempInterests(e.target.value)}
                                                    onKeyDown={handleInterestKeyDown}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                    placeholder="Add interest and press Enter"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md flex items-center"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {/* Profile Header */}
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                <img
                                                    src={profile?.avatar || "/avatar-svgrepo-com.svg"}
                                                    alt={profile?.username || "Profile"}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/avatar-svgrepo-com.svg";
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-md">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{profile?.username}</h2>
                                            <p className="text-indigo-600 flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {profile?.location || "Unknown location"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Profile Details */}
                                    <div className="space-y-5">
                                        <div>
                                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                                <Mail className="h-4 w-4 mr-2" />
                                                <span>Email</span>
                                            </div>
                                            <p className="text-gray-800 pl-6">{profile?.email}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                                <User className="h-4 w-4 mr-2" />
                                                <span>Bio</span>
                                            </div>
                                            <p className="text-gray-800 pl-6">
                                                {profile?.bio || "No bio provided yet. Tell us about yourself!"}
                                            </p>
                                        </div>

                                        {profile?.interests?.length ? (
                                            <div>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Award className="h-4 w-4 mr-2" />
                                                    <span>Interests</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pl-6">
                                                    {profile.interests.map((interest, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                                        >
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Member since April 2025
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}