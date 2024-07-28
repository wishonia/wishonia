import React from "react"

import OrbPresentation from "@/components/landingPage/orb-presentation";
import constitutionSlides from "@/components/landingPage/constitution-slides";


export default async function Home() {
  return (
      <main>
          <OrbPresentation slides={constitutionSlides}/>
      </main>
  )
}