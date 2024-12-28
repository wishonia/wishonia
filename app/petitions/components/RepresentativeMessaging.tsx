'use client'

import { Representative } from '@prisma/client'
import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { findRepresentatives } from '@/lib/services/civic-api'

interface RepresentativeMessagingProps {
  petitionTitle: string
  defaultMessageTemplate: string
  defaultCallScript: string
}

export function RepresentativeMessaging({
  petitionTitle,
  defaultMessageTemplate,
  defaultCallScript
}: RepresentativeMessagingProps) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null)
  const [showCallScript, setShowCallScript] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function lookupRepresentatives() {
    setLoading(true)
    setError(null)
    try {
      const reps = await findRepresentatives(address)
      setRepresentatives(reps)
      if (reps.length === 0) {
        setError('No representatives found for this address')
      }
    } catch (error) {
      console.error('Failed to lookup representatives:', error)
      setError('Failed to lookup representatives. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getPersonalizedMessage(rep: Representative) {
    return defaultMessageTemplate
      .replace('[REP_NAME]', rep.name)
      .replace('[OFFICE]', rep.office)
      .replace('[PETITION_TITLE]', petitionTitle)
  }

  function getPersonalizedCallScript(rep: Representative) {
    return defaultCallScript
      .replace('[REP_NAME]', rep.name)
      .replace('[OFFICE]', rep.office)
      .replace('[PETITION_TITLE]', petitionTitle)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Your Representatives</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button 
            onClick={lookupRepresentatives}
            disabled={loading || !address.trim()}
          >
            {loading ? 'Looking up...' : 'Find Representatives'}
          </Button>
        </div>
        {error && (
          <div className="text-red-600 mt-2">
            {error}
          </div>
        )}
      </div>

      {representatives.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {representatives.map((rep) => (
            <Card key={rep.id} className="p-4">
              <div className="flex items-start gap-4">
                {rep.photoUrl && (
                  <img 
                    src={rep.photoUrl} 
                    alt={rep.name}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium">{rep.name}</h3>
                  <p className="text-sm text-gray-600">{rep.office}</p>
                  {rep.party && (
                    <p className="text-sm text-gray-600">{rep.party}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {rep.phones.map((phone) => (
                  <div key={phone} className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRep(rep)
                        setShowCallScript(true)
                      }}
                    >
                      📞 {phone}
                    </Button>
                  </div>
                ))}

                {rep.emails.map((email) => (
                  <div key={email}>
                    <a
                      href={`mailto:${email}?subject=Regarding: ${petitionTitle}&body=${encodeURIComponent(
                        getPersonalizedMessage(rep)
                      )}`}
                      className="text-blue-600 hover:underline"
                    >
                      ✉️ {email}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCallScript && selectedRep && (
        <Card className="p-4">
          <h3 className="font-medium mb-2">Call Script for {selectedRep.name}</h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {getPersonalizedCallScript(selectedRep)}
            </pre>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowCallScript(false)}
          >
            Close Script
          </Button>
        </Card>
      )}
    </div>
  )
} 