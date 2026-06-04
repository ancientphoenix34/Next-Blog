"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  postId: string;
  creatorId: string;
}

export default function PostActions({ postId, creatorId }: Props) {
  const { currentUser, setCurrentUser } = useUser();
  const router = useRouter();

  if (!currentUser || currentUser._id !== creatorId) return null;

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;

    await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`,
      { method: "DELETE" },
      currentUser,
      setCurrentUser
    );

    router.push("/");
  };

  return (
    <div className="flex gap-3 mt-6">
      <Link
        href={`/posts/${postId}/edit`}
        className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
      >
        Delete
      </button>
    </div>
  );
}
