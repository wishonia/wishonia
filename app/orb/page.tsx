import React from "react"

import constitutionSlides from "@/components/landingPage/constitution-slides";
import OrbPresentation from "@/components/landingPage/orb-presentation";


export default async function Home() {
  return (
      <main>
          <OrbPresentation slides={constitutionSlides}/>
      </main>
  )
}