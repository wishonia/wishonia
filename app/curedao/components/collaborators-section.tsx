import Link from 'next/link'
import Image from 'next/image'

export function CollaboratorsSection() {
  const collaborators = [
    [
      { name: 'Foresight Institute', logo: '/placeholder.svg' },
      { name: 'Lifespan.io', logo: '/placeholder.svg' },
      { name: 'Reputable', logo: '/placeholder.svg' },
      { name: 'DeathlessDAO', logo: '/placeholder.svg' }
    ],
    [
      { name: 'AI.GOVERA', logo: '/placeholder.svg' },
      { name: 'Phase3', logo: '/placeholder.svg' },
      { name: 'VitaDAO', logo: '/placeholder.svg' },
      { name: 'Longhack', logo: '/placeholder.svg' }
    ],
    [
      { name: 'OpenCures', logo: '/placeholder.svg' },
      { name: 'Longevity Plan', logo: '/placeholder.svg' },
      { name: 'Basis', logo: '/placeholder.svg' },
      { name: 'Healome.one', logo: '/placeholder.svg' }
    ],
    [
      { name: 'Ageless Partners', logo: '/placeholder.svg' },
      { name: 'Hypertonie.App', logo: '/placeholder.svg' },
      { name: 'Forever', logo: '/placeholder.svg' },
      { name: 'Longevity Tech Fund', logo: '/placeholder.svg' }
    ],
    [
      { name: 'WeaveChain', logo: '/placeholder.svg' },
      { name: 'Ideamarket', logo: '/placeholder.svg' },
      { name: 'Quantimodo', logo: '/placeholder.svg' }
    ]
  ]

  return (
    <section className="py-24 bg-[#13111a]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Collaborators
          </h2>
          <p className="text-neutral-400 mb-4">
            We don't want to duplicate any work that anyone else is doing.<br />
            Our mission is to help researchers and health innovators<br />
            achieve faster results.
          </p>
          <p className="text-neutral-400">
            Please{' '}
            <Link href="/join-us" className="text-white hover:text-[#00ffcc] underline">
              join us
            </Link>
            {' '}and tell us how we can help you.
          </p>
        </div>

        <div className="space-y-16">
          {collaborators.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 items-center justify-items-center"
            >
              {row.map((collaborator, colIndex) => (
                <div 
                  key={colIndex}
                  className="w-full max-w-[200px] flex items-center justify-center"
                >
                  <Image
                    src={collaborator.logo}
                    alt={collaborator.name}
                    width={160}
                    height={60}
                    className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

