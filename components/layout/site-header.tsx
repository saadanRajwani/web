"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from 'next/navigation'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { MenuIcon, User, X, Shield } from "lucide-react"

export function SiteHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check if user is admin - adjust based on your actual admin check logic
  const isAdmin = session?.user?.email === "admin@example.com"

  const isActive = (path: string) => pathname === path

  const closeMenu = () => setIsMenuOpen(false)
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
    { name: "Quran Reader", href: "/quran-reader" },
  ]
  
  // Add admin link if user is admin
  const adminNavItem = isAdmin ? [{ name: "Admin", href: "/admin" }] : []
  const combinedNavigation = [...navigation, ...adminNavItem]
  
  const authLinks = session ? [
    { name: "Profile", href: "/profile" },
    { name: "Sign Out", href: "#", onClick: () => signOut({ callbackUrl: "/" }) }
  ] : [
    { name: "Sign In", href: "/sign-in" },
    { name: "Sign Up", href: "/sign-up" }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <Icons.logo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">MasjidQuran</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Navigate</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-2">
                    {combinedNavigation.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink 
                            className={cn(
                              navigationMenuTriggerStyle(), 
                              "w-full justify-start",
                              isActive(item.href) && "bg-accent text-accent-foreground"
                            )}
                          >
                            {item.name === "Admin" && (
                              <Shield className="mr-2 h-4 w-4 text-islamic-primary" />
                            )}
                            {item.name}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {session ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="relative rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium hidden lg:inline-block">{session.user?.name?.split(' ')[0]}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="default" size="sm" className="bg-islamic-primary hover:bg-islamic-dark">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <Link 
                  href="/" 
                  className="flex items-center space-x-2" 
                  onClick={closeMenu}
                >
                  <Icons.logo className="h-8 w-8" />
                  <span className="font-bold">MasjidQuran</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeMenu}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex flex-col gap-4 mt-8">
                <h4 className="text-sm font-semibold text-muted-foreground">Navigation</h4>
                <div className="flex flex-col space-y-2">
                  {combinedNavigation.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center text-lg transition-colors hover:text-foreground/80 rounded-md p-2",
                        isActive(item.href) 
                          ? "bg-accent text-accent-foreground font-medium" 
                          : "text-foreground/70"
                      )}
                    >
                      {item.name === "Admin" && (
                        <Shield className="mr-2 h-5 w-5 text-islamic-primary" />
                      )}
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <h4 className="text-sm font-semibold text-muted-foreground mt-6">Account</h4>
                <div className="flex flex-col space-y-2">
                  {authLinks.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                        closeMenu();
                      }}
                      className={cn(
                        "flex items-center text-lg transition-colors hover:text-foreground/80 rounded-md p-2",
                        isActive(item.href) 
                          ? "bg-accent text-accent-foreground font-medium" 
                          : "text-foreground/70"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
              
              {session && (
                <div className="mt-auto pb-4 pt-6 border-t">
                  <div className="flex items-center gap-3 px-2">
                    <div className="rounded-full bg-muted p-1">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 