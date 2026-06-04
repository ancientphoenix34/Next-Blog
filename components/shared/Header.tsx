"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Header() {
  const { currentUser, setCurrentUser } = useUser();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message="You will be signed out of your account."
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Backdrop — closes menu when tapping outside */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu} />
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between relative">

          <Link href="/" className="text-xl font-bold text-gray-900">
            MyBlog
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
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
                <Link href="/profile" className="flex items-center gap-2">
                  <Image
                    src={currentUser.avatar || "/avatar-placeholder.svg"}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </Link>
                <button
                  onClick={() => setShowConfirm(true)}
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

          {/* Mobile burger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 relative z-50"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>

          {/* Mobile dropdown — floats over content */}
          {menuOpen && (
            <div className="md:hidden absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">

              {currentUser ? (
                <>
                  {/* Profile — first */}
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50"
                  >
                    <Image
                      src={currentUser.avatar || "/avatar-placeholder.svg"}
                      alt={currentUser.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover shrink-0"
                    />
                    <span className="text-xs font-medium text-gray-800 truncate">{currentUser.name}</span>
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <Link href="/" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link href="/authors" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    Authors
                  </Link>
                  <Link href="/posts/create" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    + Create Post
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Logout — last */}
                  <button
                    onClick={() => { closeMenu(); setShowConfirm(true); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link href="/authors" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    Authors
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <Link href="/login" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    Login
                  </Link>
                  <Link href="/register" onClick={closeMenu} className="block px-3 py-1.5 text-xs text-blue-600 font-medium hover:bg-blue-50">
                    Register
                  </Link>
                </>
              )}

            </div>
          )}

        </div>
      </header>
    </>
  );
}
