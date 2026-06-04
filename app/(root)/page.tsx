import PostCard from "@/components/shared/PostCard";
import { PostData } from "@/types";

export const metadata = {
  title: "Home | MyBlog",
  description: "Browse the latest posts across all categories on MyBlog",
};

type SearchParams = { searchParams: Promise<{ category?: string }> };

async function getPosts(category?: string): Promise<PostData[]> {
  const url = category
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/categories/${category}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage({ searchParams }: SearchParams) {
  const { category } = await searchParams;
  const posts = await getPosts(category);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {category ? `${category} Posts` : "Latest Posts"}
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
