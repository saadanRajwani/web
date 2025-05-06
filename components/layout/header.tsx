import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-islamic-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-lg text-islamic-primary">MasjidQuran</span>
        </Link>
        <div className="ml-auto">
          <MainNav />
        </div>
      </div>
    </header>
  )
}

