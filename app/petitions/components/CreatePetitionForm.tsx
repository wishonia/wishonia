'use client'

import { useState } from "react"
import { createPetition, generatePetition } from "../petitionActions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./ImageUpload"
import { MDXEditor } from '@mdxeditor/editor'
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

type Step = 'initial' | 'review' | 'details' | 'preview'

export function CreatePetitionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>('initial')
  const [initialDescription, setInitialDescription] = useState('')
  const [petition, setPetition] = useState<{
    title: string
    summary: string
    content: string
    messageTemplate: string
    callScript: string
  } | null>(null)
  const { theme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  console.log('Current imageUrl:', imageUrl)

  async function handleInitialSubmit() {
    setLoading(true)
    setError(null)
    console.log('Starting petition generation...')
    
    try {
      console.log('Calling generatePetition with:', initialDescription)
      const generatedPetition = await generatePetition(initialDescription)
      
      console.log('Received generated petition:', generatedPetition)
      
      if (!generatedPetition || !generatedPetition.title) {
        console.error('Invalid petition data received')
        throw new Error('Invalid petition data received')
      }
      
      console.log('Setting petition state...')
      setPetition(generatedPetition)
      
      console.log('Changing step...')
      setCurrentStep('review')
      
      console.log('Generation process completed successfully')
    } catch (error: unknown) {
      console.error('Generation error in component:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setError(`Failed to generate petition: ${errorMessage}`)
    } finally {
      console.log('Ending loading state')
      setLoading(false)
    }
  }

  async function handleFinalSubmit() {
    if (!petition) return

    setLoading(true)
    setError(null)
    try {
      const createdPetition = await createPetition({
        ...petition,
        imageUrl: imageUrl || undefined,
        targetCount: 1000,
      })
      if (!createdPetition) {
        throw new Error('Failed to create petition')
      }
      router.push(`/petitions/${createdPetition.id}`)
    } catch (error) {
      console.error('Failed to create petition:', error)
      setError('Failed to create petition. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {currentStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What change would you like to make?</h2>
              <p className="text-gray-600 mb-6">
                Describe the change you want to see and we'll help you create a compelling petition.
              </p>
              <Textarea
                value={initialDescription}
                onChange={(e) => setInitialDescription(e.target.value)}
                placeholder="I want to..."
                className="h-32 mb-4"
              />
              <Button
                onClick={handleInitialSubmit}
                disabled={loading || !initialDescription.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your petition...
                  </>
                ) : (
                  'Create Petition'
                )}
              </Button>
            </Card>
          </motion.div>
        )}

        {currentStep === 'review' && petition && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Review Your Petition</h2>
              <p className="text-gray-600 mb-6">
                We've created a draft petition based on your description. Feel free to edit any part.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={petition?.title}
                    onChange={(e) => setPetition({ ...petition!, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Summary</label>
                  <Textarea
                    value={petition?.summary}
                    onChange={(e) => setPetition({ ...petition!, summary: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <div className={`prose max-w-none ${theme === 'dark' ? 'dark' : ''}`}>
                    <MDXEditor
                      markdown={petition?.content || ''}
                      onChange={(content) => setPetition({ ...petition!, content })}
                      contentEditableClassName={`min-h-[200px] prose ${
                        theme === 'dark' ? 'dark:prose-invert' : ''
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <ImageUpload
                    onUploadComplete={(url) => {
                      console.log('Upload complete, setting imageUrl to:', url)
                      setImageUrl(url)
                    }}
                    folder="petitions"
                  />
                  {imageUrl ? (
                    <div className="mt-2">
                      <img 
                        src={imageUrl} 
                        alt="Petition image" 
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                        onError={(e) => console.error('Image failed to load:', e)}
                        onLoad={() => console.log('Image loaded successfully')}
                      />
                    </div>
                  ) : (
                    <div className="mt-2">No image uploaded yet</div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('initial')}
                    disabled={loading}
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={loading || !petition.title.trim() || !petition.content.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Publish Petition'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 