import Link from "next/link";
import { Category } from "@/types";

const CATEGORIES: Category[] = [
  "Agriculture", "Business", "Education", "Entertainment",
  "Art", "Investment", "Weather", "Uncategorized",
];

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: "#0c0c22" }}>
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">

        {/* Category links */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className="px-5 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: "#252542",
                color: "#d8e6e7",
              }}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center text-sm font-light" style={{ color: "#d8e6e7" }}>
          © {new Date().getFullYear()} – Blog. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}
