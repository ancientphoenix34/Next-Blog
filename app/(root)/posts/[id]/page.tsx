import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostData } from "@/types";
import PostActions from "@/components/shared/PostActions";

type Params = { params: Promise<{ id: string }> };

async function getPost(id: string): Promise<PostData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Post not found | MyBlog" };
  return {
    title: `${post.title} | MyBlog`,
    description: post.description.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl">

        {/* Thumbnail */}
        <div className="relative w-full h-72 rounded-t-2xl overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Category + Title */}
          <div className="mb-6">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              {post.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
            <PostActions postId={post._id} creatorId={post.creator} />
          </div>

          {/* Rich text content */}
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              ← Back to all posts
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
