import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeatureBoxProps {
  title: string
  desc: string
  color: string
  icon: React.ElementType
  media: string
  index: number
  onClick: () => void
}

const getVideoEmbedUrl = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const vimeoRegex = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
  const dailymotionRegex = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/

  let match = url.match(youtubeRegex)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }

  match = url.match(vimeoRegex)
  if (match && match[3]) {
    return `https://player.vimeo.com/video/${match[3]}`
  }

  match = url.match(dailymotionRegex)
  if (match && (match[2] || match[4])) {
    const videoId = match[4] || match[2]
    return `https://www.dailymotion.com/embed/video/${videoId}`
  }

  return null
}

const MediaContent = ({ media }: { media: string }) => {
  const videoUrl = getVideoEmbedUrl(media)
  if (videoUrl) {
    return (
      <iframe
        className="w-full aspect-video rounded-lg mb-4"
        src={videoUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      ></iframe>
    )
  } else if (media.endsWith('.gif') || media.match(/\.(jpeg|jpg|png|webp)$/i)) {
    return (
      <Image 
        src={media} 
        alt="" 
        width={300} 
        height={200} 
        className="w-full h-auto rounded-lg mb-4" 
      />
    )
  } else {
    return null
  }
}

export const FeatureBox: React.FC<FeatureBoxProps> = ({ title, desc, color, icon: Icon, media, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl border-4 border-black ${color} p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none block w-full text-left`}
      >
        <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
        <MediaContent media={media} />
        <Icon className="mb-4 h-12 w-12" />
        <h3 className="mb-2 text-2xl font-black">{title}</h3>
        <p className="font-bold">{desc}</p>
        <ArrowRight className="mt-4 h-6 w-6 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  )
}