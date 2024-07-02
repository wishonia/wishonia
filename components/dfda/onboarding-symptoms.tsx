import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Component() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4">
      <header className="flex w-full items-center justify-between border-b px-4 py-2">
        <div className="flex items-center space-x-2">
          <LogInIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold text-blue-600">SelfDecode</h1>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Let's get to know you better!
        </div>
      </header>
      <main className="flex w-full max-w-4xl flex-col items-center space-y-6 p-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-600">QUESTION 1</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button className="hover:underline">PREV</button>
            <button className="hover:underline">NEXT</button>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Are you experiencing any symptoms or conditions?
        </h3>
        <div className="relative w-full max-w-lg">
          <Input
            type="search"
            placeholder="Search symptoms & conditions"
            className="w-full rounded-md border py-2 pl-10 pr-4"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[
            "Headache",
            "Artery Hardening",
            "High Blood Pressure",
            "Sugar Cravings",
            "High Blood Sugar",
            "Overweight",
            "Underactive Thyroid",
            "Migraines",
            "Insomnia",
            "Hair Loss",
            "Back Pain",
            "Asthma",
            "Gut Inflammation",
            "Diarrhea",
            "Constipation",
            "Bloating",
            "Hemorrhoids",
          ].map((symptom) => (
            <Badge key={symptom} variant="outline" className="px-4 py-2">
              {symptom}
            </Badge>
          ))}
        </div>
        <button className="text-sm text-gray-600 hover:underline">
          + 760 more symptoms & conditions
        </button>
        <div className="flex w-full flex-col items-start space-y-4">
          <div className="text-sm font-semibold text-purple-600">
            8 selected
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Anxiety",
              "Low Energy (Chronic Fatigue)",
              "Cognitive Decline",
              "Acne",
              "Allergies",
              "Food Allergies",
            ].map((selected) => (
              <Badge
                key={selected}
                variant="default"
                className="bg-purple-600 text-white"
              >
                {selected}
              </Badge>
            ))}
            <Badge variant="default" className="bg-purple-600 text-white">
              +2
            </Badge>
          </div>
        </div>
        <div className="flex w-full items-center space-x-4">
          <Button className="bg-blue-600 px-6 py-2 text-white">CONTINUE</Button>
          <button className="text-sm text-gray-600 hover:underline">
            Skip for now
          </button>
        </div>
      </main>
    </div>
  )
}

function LogInIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
