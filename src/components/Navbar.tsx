import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-card/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold font-[family-name:var(--font-shippori)] bg-gradient-to-r from-[#1e3a5f] via-[#2a5a8f] to-[#d4508d] bg-clip-text text-transparent">
              Kana Pro
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
