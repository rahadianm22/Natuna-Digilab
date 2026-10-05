import Link from "next/link";

// The last line of a docs page: where a reader usually goes next, so no page is a dead end.
export default function NextPage({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <nav aria-label="Next page" className="mt-20 border-t border-gray-200 pt-8">
      <Link href={href} className="group inline-flex min-h-11 flex-col justify-center rounded-md">
        <span className="text-sm text-gray-700">Next</span>
        <span className="text-xl font-bold text-gray-900 underline-offset-4 group-hover:text-blue-800 group-hover:underline">{title}</span>
        <span className="mt-1 text-sm text-gray-700">{note}</span>
      </Link>
    </nav>
  );
}
