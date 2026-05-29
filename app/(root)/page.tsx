import PostCard from "@/components/shared/PostCard";
import { PostData } from "@/types";

async function getPosts(): Promise<PostData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}


export default async function HomePage() {
  const posts = await getPosts();

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to write one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id.toString()} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
