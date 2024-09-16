'use client';

import Link from 'next/link';
export default function MainSection() {
    return (
        <div>
      <h1>Main Page</h1>
      <p>This is the main content of the page.</p>
      <Link href="/membership-pkgs">
        <button className="mt-4 p-2 bg-blue-500 text-white rounded">
          View all package
        </button>
      </Link>
    </div>
    )
}