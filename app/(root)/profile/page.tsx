"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";
import { CurrentUser } from "@/types";

export default function ProfilePage() {
    const router = useRouter();
    const { currentUser, setCurrentUser } = useUser();

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    if (!currentUser) {
        router.push("/login");
        return null;
    }

    // ── Avatar update ──────────────────────────────────────────────────────────
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarSubmit = async () => {
        if (!avatar) return;
        setAvatarLoading(true);
        setError("");

        const form = new FormData();
        form.append("avatar", avatar);

        const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/change-avatar`,
            { method: "POST", body: form },
            currentUser,
            setCurrentUser
        );

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Failed to update avatar");
            setAvatarLoading(false);
            return;
        }

        // Update context so header reflects new avatar immediately
        setCurrentUser({ ...currentUser, avatar: data.avatar });
        setAvatar(null);
        setAvatarPreview("");
        setSuccess("Avatar updated successfully");
        setAvatarLoading(false);
    };

    // ── Profile update ─────────────────────────────────────────────────────────
    const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword && newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        setProfileLoading(true);

        const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/edit-user`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    currentPassword,
                    newPassword: newPassword || undefined,
                }),
            },
            currentUser,
            setCurrentUser
        );

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Failed to update profile");
            setProfileLoading(false);
            return;
        }

        // Sync updated name/email into context + localStorage
        const updated: CurrentUser = { ...currentUser, name: data.name, email: data.email };
        setCurrentUser(updated);
        setSuccess("Profile updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setProfileLoading(false);
    };

    return (
        <section className="max-w-2xl mx-auto px-4 py-10 space-y-10">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            {/* Avatar section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
                <div className="flex items-center gap-6">
                    <img
                        src={avatarPreview || currentUser.avatar || "/avatar-placeholder.svg"}
                        alt={currentUser.name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1 space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {avatar && (
                            <button
                                onClick={handleAvatarSubmit}
                                disabled={avatarLoading}
                                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {avatarLoading ? "Uploading..." : "Save Photo"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile details section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <hr className="border-gray-200" />
                    <p className="text-xs text-gray-400">Leave password fields empty to keep current password</p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </section>
    );
}
