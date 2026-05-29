"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { currentUser, setCurrentUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-bold text-gray-900">
          MyBlog
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/authors" className="text-sm text-gray-600 hover:text-gray-900">
            Authors
          </Link>

          {currentUser ? (
            <>
              <Link
                href="/posts/create"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                + Create Post
              </Link>
              <Link href={`/authors/${currentUser._id}`} className="flex items-center gap-2">
                <img
                  src={currentUser.avatar || "/avatar-placeholder.png"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
