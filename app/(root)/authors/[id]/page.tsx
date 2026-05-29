import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/shared/PostCard";
import { PostData } from "@/types";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  posts: number;
}

type Params = { params: Promise<{ id: string }> };

async function getAuthor(id: string): Promise<Author | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getAuthorPosts(id: string): Promise<PostData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AuthorPage({ params }: Params) {
  const { id } = await params;

  const [author, posts] = await Promise.all([
    getAuthor(id),
    getAuthorPosts(id),
  ]);

  if (!author) notFound();

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Author profile card */}
      <div className="flex items-center gap-6 mb-10 p-6 bg-white border border-gray-200 rounded-2xl">
        <img
          src={author.avatar || "/avatar-placeholder.png"}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{author.name}</h1>
          <p className="text-gray-500 mt-1">{author.email}</p>
          <p className="text-sm text-blue-600 mt-2 font-medium">
            {author.posts} {author.posts === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      {/* Author's posts */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Posts by {author.name}</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">This author hasn&apos;t published any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/authors" className="text-sm text-blue-600 hover:underline">
          ← All authors
        </Link>
      </div>
    </section>
  );
}
