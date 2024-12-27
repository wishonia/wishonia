'use client'

import { GithubIcon, UsersIcon, Building2Icon } from 'lucide-react'
import { ContributeToBlueprintButton } from './contribute-to-blueprint-button'

export function JoinSection() {
  const roles = [
    {
      icon: <GithubIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "For Contributors",
      items: [
        "Join our GitHub repository",
        "Participate in working groups",
        "Review and comment on proposals",
        "Submit amendments",
        "Share expertise in your field"
      ]
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "For Advocates",
      items: [
        "Get your unique referral link",
        "Share the mission with your network",
        "Earn rewards for expanding participation",
        "Host discussion groups",
        "Build local support"
      ]
    },
    {
      icon: <Building2Icon className="w-6 h-6 text-[#0088ff]" />,
      title: "For Organizations",
      items: [
        "Partner with CureDAO",
        "Contribute resources or expertise",
        "Help spread awareness",
        "Implement pilot programs",
        "Support development efforts"
      ]
    }
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          I Want You!
        </h2>
        <p className="text-neutral-400 mb-8">
          We're drafting humanity's Blueprint for a World Without Disease on GitHub. 
          Join brilliant minds across disciplines to shape the future of healthcare.
        </p>
        <ContributeToBlueprintButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <div key={index} className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              {role.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{role.title}</h3>
            <ul className="space-y-3">
              {role.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-neutral-400 flex items-start">
                  <span className="text-[#00ffcc] mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
} 