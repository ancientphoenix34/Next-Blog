export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MyBlog. All rights reserved.
      </div>
    </footer>
  );
}
