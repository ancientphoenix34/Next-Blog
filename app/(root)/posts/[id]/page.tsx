import Link from "next/link";
import { notFound } from "next/navigation";
import { PostData } from "@/types";

type Params = { params: Promise<{ id: string }> };

async function getPost(id: string): Promise<PostData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      {/* Category + Title */}
      <div className="mb-6">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {post.category}
        </span>
        <h1 className="mt-2 text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {new Date(post.updatedAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Thumbnail */}
      <img
        src={post.thumbnail}
        alt={post.title}
        className="w-full h-72 object-cover rounded-xl mb-8"
      />

      {/* Rich text content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.description }}
      />

      {/* Back link */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </section>
  );
}
