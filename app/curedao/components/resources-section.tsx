'use client'

import { GithubIcon, FileTextIcon, UsersIcon, MessageSquareIcon, Building2Icon, GraduationCapIcon, FileCode2Icon, BarChart2Icon, RefreshCwIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'

export function ResourcesSection() {
  const resources = [
    {
      icon: <GithubIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "GitHub Repository",
      href: "#"
    },
    {
      icon: <FileTextIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Technical Documentation",
      href: "#"
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "Working Groups",
      href: "#"
    },
    {
      icon: <MessageSquareIcon className="w-6 h-6 text-[#ff8866]" />,
      title: "Discussion Forums",
      href: "#"
    },
    {
      icon: <Building2Icon className="w-6 h-6 text-[#ff4895]" />,
      title: "Partnership Opportunities",
      href: "#"
    },
    {
      icon: <GraduationCapIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Educational Materials",
      href: "#"
    },
    {
      icon: <FileCode2Icon className="w-6 h-6 text-[#0088ff]" />,
      title: "Implementation Guides",
      href: "#"
    },
    {
      icon: <BarChart2Icon className="w-6 h-6 text-[#ff8866]" />,
      title: "Success Metrics",
      href: "#"
    },
    {
      icon: <RefreshCwIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "Progress Updates",
      href: "#"
    },
    {
      icon: <MailIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Contact Information",
      href: "#"
    }
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Resources
        </h2>
        <p className="text-neutral-400">
          Everything you need to get started and stay informed
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {resources.map((resource, index) => (
          <Link 
            key={index} 
            href={resource.href}
            className="bg-[#1d1a27] rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
              {resource.icon}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#00ffcc] transition-colors">
              {resource.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
} 