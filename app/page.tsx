import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Users, Award, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-islamic-pattern-light bg-islamic-light dark:bg-islamic-dark">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 animate-fadeIn">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Collaborative Quran Reading
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join hundreds of believers to collectively complete the Quran together as a community.
              </p>
            </div>
            <div className="space-x-4 animate-fadeIn animation-delay-1">
              <Button asChild size="lg" className="bg-islamic-primary hover:bg-islamic-dark">
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 border-islamic-primary text-islamic-primary">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl islamic-border py-4">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our platform makes it easy to participate in a community-wide Quran reading effort.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="animate-enter animate-enter-delay-1">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-islamic-light dark:bg-islamic-dark/50">
                  <BookOpen className="h-6 w-6 text-islamic-primary" />
                </div>
                <h3 className="text-xl font-bold">Select a Para</h3>
                <p className="text-muted-foreground">
                  Choose a para or specific ruku from the Quran that you'd like to read.
                </p>
              </CardContent>
            </Card>
            <Card className="animate-enter animate-enter-delay-2">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-islamic-light dark:bg-islamic-dark/50">
                  <Users className="h-6 w-6 text-islamic-primary" />
                </div>
                <h3 className="text-xl font-bold">Join the Community</h3>
                <p className="text-muted-foreground">
                  Become part of a global community working together to complete the Quran.
                </p>
              </CardContent>
            </Card>
            <Card className="animate-enter animate-enter-delay-3">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-islamic-light dark:bg-islamic-dark/50">
                  <Clock className="h-6 w-6 text-islamic-primary" />
                </div>
                <h3 className="text-xl font-bold">Set Your Pace</h3>
                <p className="text-muted-foreground">
                  Choose daily, weekly, or monthly goals for completing the Quran together.
                </p>
              </CardContent>
            </Card>
            <Card className="animate-enter animate-enter-delay-3">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-islamic-light dark:bg-islamic-dark/50">
                  <Award className="h-6 w-6 text-islamic-primary" />
                </div>
                <h3 className="text-xl font-bold">Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Track your progress and earn spiritual rewards for your contributions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-islamic-light dark:bg-islamic-dark/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-2 animate-enter">
              <h3 className="text-3xl md:text-4xl font-bold text-islamic-primary">1,240+</h3>
              <p className="text-muted-foreground text-center">Active Participants</p>
            </div>
            <div className="flex flex-col items-center space-y-2 animate-enter animate-enter-delay-1">
              <h3 className="text-3xl md:text-4xl font-bold text-islamic-primary">56</h3>
              <p className="text-muted-foreground text-center">Completed Khatms</p>
            </div>
            <div className="flex flex-col items-center space-y-2 animate-enter animate-enter-delay-2">
              <h3 className="text-3xl md:text-4xl font-bold text-islamic-primary">24</h3>
              <p className="text-muted-foreground text-center">Countries Represented</p>
            </div>
            <div className="flex flex-col items-center space-y-2 animate-enter animate-enter-delay-3">
              <h3 className="text-3xl md:text-4xl font-bold text-islamic-primary">3,500+</h3>
              <p className="text-muted-foreground text-center">Paras Read This Month</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Join Our Community?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Start contributing to our collective Quran reading effort today.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-islamic-primary hover:bg-islamic-dark">
                <Link href="/dashboard">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

