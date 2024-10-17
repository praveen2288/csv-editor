import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">SNAP Tools</h1>
      <div className="space-x-8">
        <Link href="/csveditor" className="text-xl text-blue-600 hover:underline">
          CSV Editor
        </Link>
        <Link href="/cronparser" className="text-xl text-blue-600 hover:underline">
          Cron Parser
        </Link>
      </div>
    </div>
  );
}
