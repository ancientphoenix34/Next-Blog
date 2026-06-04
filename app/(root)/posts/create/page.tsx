"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";
import { Category } from "@/types";

const CATEGORIES: Category[] = [
  "Agriculture", "Business", "Education", "Entertainment",
  "Art", "Investment", "Weather", "Uncategorized",
];

export default function CreatePostPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUser();

  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail]     = useState<File | null>(null);
  const [preview, setPreview]         = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!thumbnail) {
      setError("Please select a thumbnail image");
      return;
    }

    if (description.replace(/<[^>]*>/g, "").trim().length < 12) {
      setError("Description must be at least 12 characters");
      return;
    }

    setLoading(true);

    const form = new FormData(e.currentTarget);
    form.set("description", description);
    form.set("thumbnail", thumbnail);

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
      { method: "POST", body: form },
      currentUser,
      setCurrentUser
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to create post");
      setLoading(false);
      return;
    }

    router.push(`/posts/${data._id}`);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
          {preview && (
            <img src={preview} alt="Preview" className="mb-2 w-full h-48 object-cover rounded-lg" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnail}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </section>
  );
}
