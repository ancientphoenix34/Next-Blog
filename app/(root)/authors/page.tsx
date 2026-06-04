import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Authors | MyBlog",
  description: "Browse all authors on MyBlog",
};

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  posts: number;
}

async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Authors</h1>

      {authors.length === 0 ? (
        <p className="text-gray-500">No authors yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Link
              key={author._id}
              href={`/authors/${author._id}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <Image
                src={author.avatar || "/avatar-placeholder.svg"}
                alt={author.name}
                width={56}
                height={56}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h2 className="font-semibold text-gray-900">{author.name}</h2>
                <p className="text-sm text-gray-500">{author.posts} {author.posts === 1 ? "post" : "posts"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
