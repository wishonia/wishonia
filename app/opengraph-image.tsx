import { ImageResponse } from "next/og"

import {
  sharedDescription,
  sharedImage,
  sharedTitle,
} from "@/app/shared-metadata"
import { OgImage } from "@/components/OgImage"
import { getMediumFont } from "@/lib/utils"

export const runtime = "edge"

export const alt = sharedTitle

export const size = {
  width: sharedImage.width,
  height: sharedImage.height,
}
export const contentType = sharedImage.type

export default async function Image() {
  return new ImageResponse(
    <OgImage title={sharedTitle} description={sharedDescription} />,
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: await getMediumFont(),
          style: "normal",
          weight: 500,
        },
        {
          name: "Space Grotesk",
          data: await getMediumFont(),
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
