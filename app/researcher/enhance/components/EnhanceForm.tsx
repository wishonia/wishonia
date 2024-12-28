'use client'

import { formatDistanceToNow } from 'date-fns'
import { Loader2, Copy, Sun, Moon, History, ArrowLeft, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

import { CustomReactMarkdown } from '@/components/CustomReactMarkdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import { enhanceContent } from '../enhanceActions'


interface ContentVersion {
  content: string;
  timestamp: number;
  isEnhanced: boolean;
}

export default function ContentEnhancer() {
  const [input, setInput] = useState('')
  const [enhancedContent, setEnhancedContent] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const { theme, setTheme } = useTheme()

  // Load versions from localStorage on component mount
  useEffect(() => {
    const savedVersions = localStorage.getItem('contentVersions')
    if (savedVersions) {
      setVersions(JSON.parse(savedVersions))
    }
  }, [])

  const saveVersion = (content: string, isEnhanced: boolean = false) => {
    const newVersion: ContentVersion = {
      content,
      timestamp: Date.now(),
      isEnhanced
    }
    const updatedVersions = [...versions, newVersion]
    setVersions(updatedVersions)
    localStorage.setItem('contentVersions', JSON.stringify(updatedVersions))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEnhancing(true)
    const formData = new FormData(e.currentTarget)
    const content = formData.get('content') as string
    
    try {
      // Always save the current version before enhancement
      if (content.trim()) {
        // Check if this exact content isn't already the latest version
        const latestVersion = versions[versions.length - 1]
        if (!latestVersion || latestVersion.content !== content) {
          saveVersion(content, false)
        }
      }
      
      const response = await enhanceContent(content)
      
      // Save enhanced version if it's different from the input
      if (response.enhancedContent.trim() && response.enhancedContent !== content) {
        saveVersion(response.enhancedContent, true)
      }
      
      setInput(response.enhancedContent)
      setEnhancedContent(response.enhancedContent)
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const deleteVersion = (timestamp: number) => {
    const updatedVersions = versions.filter(v => v.timestamp !== timestamp)
    setVersions(updatedVersions)
    localStorage.setItem('contentVersions', JSON.stringify(updatedVersions))
  }

  const copyToClipboard = async (text: string, format: 'markdown' | 'rich') => {
    if (format === 'markdown') {
      await navigator.clipboard.writeText(text)
    } else {
      // Convert markdown to HTML for rich text copying
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = text
      
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([text], { type: 'text/plain' }),
            'text/html': new Blob([tempDiv.innerHTML], { type: 'text/html' })
          })
        ])
      } catch (err) {
        // Fallback to plain text if rich copy fails
        await navigator.clipboard.writeText(text)
      }
    }
  }

  const restoreVersion = (version: ContentVersion) => {
    setInput(version.content)
    setShowHistory(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const timeAgo = formatDistanceToNow(date, { addSuffix: true })
    return {
      timeAgo,
      fullDate: date.toLocaleString()
    }
  }

  if (showHistory) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Version History
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...versions]
                .sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
                .map((version) => {
                  const { timeAgo, fullDate } = formatDate(version.timestamp)
                  return (
                    <Card key={version.timestamp} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-sm text-muted-foreground"
                            title={fullDate} // Show full date on hover
                          >
                            {timeAgo}
                          </span>
                          {version.isEnhanced && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded">
                              Enhanced
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => restoreVersion(version)}
                          >
                            Restore
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteVersion(version.timestamp)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap">{version.content.substring(0, 200)}...</pre>
                      </div>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Content Enhancer
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowHistory(true)}
                disabled={versions.length === 0}
              >
                <History className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              name="content"
              placeholder="Paste your content here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <div className="flex justify-between items-center mb-4">
              <Button type="submit" disabled={isEnhancing || input.trim() === ''}>
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  'Enhance Content'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {enhancedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Enhanced Content
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => copyToClipboard(enhancedContent, 'markdown')}
                  >
                    Copy as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => copyToClipboard(enhancedContent, 'rich')}
                  >
                    Copy as Rich Text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="relative rounded-md border bg-background p-4">
                  <CustomReactMarkdown>{enhancedContent}</CustomReactMarkdown>
                </div>
              </TabsContent>
              <TabsContent value="markdown">
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto">
                    <code>{enhancedContent}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}