import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Phone, Users, FileText, UserPlus, PhoneCall, Bell, CheckCircle } from "lucide-react"
import { savePhoneNumber } from "./actions"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getServerSession } from "next-auth/next"
import { PhoneNumberInput } from "./components/PhoneNumberInput"
import Link from "next/link"

export default async function Page() {
  const session = await getServerSession()

  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Heart className="h-6 w-6 text-primary" />
              <span>HeartLine</span>
            </div>
            <nav className="ml-auto flex gap-4 sm:gap-6">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">How it works</Button>
              <Button variant="ghost">FAQ</Button>
              <Link href="/phone-friend/schedules">
                <Button variant="default">Get Started</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16 md:px-6">
          <section className="mb-20 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Stay Connected with Your Loved Ones
            </h1>
            <p className="mx-auto mb-8 max-w-[700px] text-xl text-muted-foreground">
              HeartLine: Daily check-ins that bring peace of mind and keep seniors connected, anytime, anywhere.
            </p>
            <Card className="mx-auto max-w-md">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">Try Our Live Demo</h2>
                <PhoneNumberInput isLoggedIn={!!session?.user} />
              </CardContent>
            </Card>
          </section>

          <section className="mb-20">
            <h2 className="mb-8 text-center text-3xl font-bold">Why Choose HeartLine?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Phone className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">Daily Check-in Calls</h3>
                  <p className="text-muted-foreground">Friendly conversations that brighten your loved one's day</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Users className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">Care Circle</h3>
                  <p className="text-muted-foreground">Keep up to 5 family members informed and connected</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <FileText className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">AI-Powered Summaries</h3>
                  <p className="text-muted-foreground">Receive detailed updates on every conversation</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="mb-8 text-center text-3xl font-bold">How HeartLine Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">1. Sign Up</h3>
                <p className="text-muted-foreground">Create an account and add your loved one's details</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <PhoneCall className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">2. Daily Calls</h3>
                <p className="text-muted-foreground">Our agents make friendly check-in calls at the chosen time</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bell className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">3. Stay Informed</h3>
                <p className="text-muted-foreground">Receive updates and alerts about your loved one's well-being</p>
              </div>
            </div>
          </section>

          <section className="mb-20 rounded-lg bg-primary p-8 text-primary-foreground">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Get Early Access to HeartLine</h2>
              <p className="mb-8 text-xl">
                Join our waitlist today and be among the first to experience peace of mind with HeartLine's daily check-ins.
              </p>
              <Link href="/phone-friend/schedules">
                <Button size="lg" variant="secondary">Get Started</Button>
              </Link>
            </div>
          </section>

          <section className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the check-in call work?</AccordionTrigger>
                <AccordionContent>
                  A HeartLine agent calls your loved ones daily, engaging them in friendly conversations and alerting you if they can't be reached.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What if my loved one doesn't answer?</AccordionTrigger>
                <AccordionContent>
                  If your loved one doesn't answer, we'll try again 3 times within the next hour and leave a voice message. If we don't hear back from them and they don't answer the call, we'll alert the care circle immediately.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is the conversation secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we use bank-level encryption to protect all personal data and conversations, ensuring the highest level of security and privacy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can we change the call time?</AccordionTrigger>
                <AccordionContent>
                  You can easily adjust call times through your account settings anytime to fit your loved one's schedule.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>What if my loved one goes on vacation?</AccordionTrigger>
                <AccordionContent>
                  Our Vacation Mode feature allows you to pause the service temporarily without canceling your subscription, ensuring flexibility for your loved one's lifestyle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Is this like an automated robocall?</AccordionTrigger>
                <AccordionContent>
                  Not at all. Our well-trained, compassionate agents make personal calls and engage in friendly, meaningful conversations tailored to your loved one's interests and needs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </main>
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <Heart className="h-6 w-6 text-primary" />
              <p className="text-center text-sm leading-loose md:text-left">
                Built with love by HeartLine. © 2023 HeartLine Inc. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Terms of Service</Button>
              <Button variant="ghost" size="sm">Privacy Policy</Button>
              <Button variant="ghost" size="sm">Contact Us</Button>
            </div>
          </div>
        </footer>
      </div>
  )
}