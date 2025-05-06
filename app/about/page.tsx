import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-islamic-primary dark:text-islamic-accent">
          About MasjidQuran
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learn more about our mission to facilitate collaborative Quran reading
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Why we created MasjidQuran</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              MasjidQuran was created with a simple yet profound mission: to make it easier for Muslims around the world
              to collectively complete readings of the Holy Quran.
            </p>
            <p>
              In many communities, it's a tradition to complete the Quran collectively during special times like Ramadan
              or when someone passes away. However, organizing and tracking these collective readings can be
              challenging, especially across different locations.
            </p>
            <p>
              Our platform provides a simple, accessible way for hundreds or even thousands of believers to participate
              in a shared Quran reading, with each person taking responsibility for a specific portion. Together, we can
              complete the Quran in a day, a week, or a month, sharing in the blessings and rewards.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the collaborative reading process</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="p-3 bg-islamic-light dark:bg-islamic-dark/30 rounded-md">
                <span className="font-medium">Join a Khatm (Complete Reading)</span>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  Browse active Khatms or join the current community reading.
                </p>
              </li>
              <li className="p-3 bg-islamic-light dark:bg-islamic-dark/30 rounded-md">
                <span className="font-medium">Select Your Portion</span>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  Choose a para (juz) or specific ruku that hasn't been claimed yet.
                </p>
              </li>
              <li className="p-3 bg-islamic-light dark:bg-islamic-dark/30 rounded-md">
                <span className="font-medium">Read Your Portion</span>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  Take your time to read your selected portion with understanding.
                </p>
              </li>
              <li className="p-3 bg-islamic-light dark:bg-islamic-dark/30 rounded-md">
                <span className="font-medium">Mark as Completed</span>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  Once finished, mark your portion as completed to update the community progress.
                </p>
              </li>
              <li className="p-3 bg-islamic-light dark:bg-islamic-dark/30 rounded-md">
                <span className="font-medium">Celebrate Completion</span>
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  When all portions are read, the community celebrates the completion of a Khatm.
                </p>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a Para or Juz?</AccordionTrigger>
                <AccordionContent>
                  A Para (also called Juz) is one of thirty parts of roughly equal length into which the Quran is
                  divided. This division makes it easier to read the entire Quran over a period of time, such as the
                  month of Ramadan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What is a Ruku?</AccordionTrigger>
                <AccordionContent>
                  A Ruku is a smaller division within a Para. Each Para contains multiple Rukus, which are sections
                  marked for prayer and recitation purposes. The number of Rukus varies in each Para.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is a Khatm?</AccordionTrigger>
                <AccordionContent>
                  A Khatm refers to a complete reading of the Quran from beginning to end. In our platform, a Khatm is a
                  collaborative effort where multiple people each read a portion to collectively complete the entire
                  Quran.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How long does it take to complete a Khatm?</AccordionTrigger>
                <AccordionContent>
                  The time to complete a Khatm depends on the goal set by the community. It can be completed in a day, a
                  week, or a month, depending on how many participants are involved and how quickly they read their
                  portions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I participate in multiple Khatms?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can participate in multiple Khatms simultaneously. You can select different portions in
                  different Khatms based on your reading capacity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Is there a specific translation I should use?</AccordionTrigger>
                <AccordionContent>
                  You can use any authentic translation of the Quran that you are comfortable with. Our platform focuses
                  on tracking the portions read rather than specifying which translation to use.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Have questions or suggestions? Reach out to us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">support@masjidquran.com</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Social Media</h3>
                <p className="text-sm text-muted-foreground">@masjidquran on Twitter and Instagram</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

