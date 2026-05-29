import Link from "next/link";
import { IPost } from "@/types";
import { PostData } from "@/types";

interface PostCardProps {
  post: PostData;
}


export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/posts/${post._id}`}>
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {post.category}
        </span>
        <Link href={`/posts/${post._id}`}>
          <h2 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {post.description.replace(/<[^>]*>/g, "")}
        </p>
        <div className="mt-3 text-xs text-gray-400">
          {new Date(post.updatedAt).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
