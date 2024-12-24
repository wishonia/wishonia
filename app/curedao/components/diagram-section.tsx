import Image from 'next/image'

export function DiagramSection() {
  return (
    <div className="container-default home-hero w-container">
      <div className="home-hero-images-wrapper">
        <Image
          src="/globalSolutions/dfda/img/platform-diagram-dark-skinny.svg"
          alt="CureDAO Framework Diagram"
          width={1200}
          height={800}
          className="image home-hero-1"
        />
      </div>
    </div>
  )
} 