import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">SNAP Tools</h1>
      <div className="space-x-8">
        <Link href="/calculator" className="text-xl text-blue-600 hover:underline">
          Calculator & Unit Converter
        </Link>
        <Link href="/csveditor" className="text-xl text-blue-600 hover:underline">
          CSV Editor
        </Link>
        <Link href="/cronparser" className="text-xl text-blue-600 hover:underline">
          Cron Parser
        </Link>
        <Link href="/diff" className="text-xl text-blue-600 hover:underline">
          Diff Tool
        </Link>
        <Link href="/clock" className="text-xl text-blue-600 hover:underline">
          Clock, Timer and Stopwatch
        </Link>
        <Link href="/agecalculator" className="text-xl text-blue-600 hover:underline">
          Age Calculator
        </Link>
        <Link href="/passwordgenerator" className="text-xl text-blue-600 hover:underline">
          Password Generator
        </Link>
        <Link href="/qrcode" className="text-xl text-blue-600 hover:underline">
          QR Code Generator
        </Link>
      </div>
    </div>
  );
}
