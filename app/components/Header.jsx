export default function Header() {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dragons Trending</h1>
      <nav>
        <a href="/" className="mx-2 hover:text-yellow-400">Home</a>
        <a href="/admin/login" className="mx-2 hover:text-yellow-400">Admin</a>
      </nav>
    </header>
  );
}
