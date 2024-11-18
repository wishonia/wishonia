'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Loader2, Github, AlertCircle } from 'lucide-react'
import { Organization, Repository, FileItem, ExistingArticle } from './types'
import { OrganizationSelector } from './OrganizationSelector'
import { RepositorySelector } from './RepositorySelector'
import { FileBrowser } from './FileBrowser'
import { 
  fetchGithubOrganizations, fetchGithubRepositories, fetchGithubFiles, 
  fetchExistingArticles, createArticle, deleteGithubAccount
} from '@/app/github/githubActions'

const STORAGE_KEYS = {
  ORG: 'github-explorer-org',
  REPO: 'github-explorer-repo'
} as const

interface GitHubExplorerProps {
  accessToken: string | null
}

function LoadingState() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Fetching Repos from GitHub...</span>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="h-12 bg-muted/50 animate-pulse rounded-md" />
          <div className="h-12 bg-muted/50 animate-pulse rounded-md" />
          <div className="h-12 bg-muted/50 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function GitHubExplorer({ accessToken }: GitHubExplorerProps) {
  const { data: session, status: sessionStatus } = useSession()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [authError, setAuthError] = useState<boolean>(false)
  const [existingArticles, setExistingArticles] = useState<ExistingArticle[]>([])
  const [error, setError] = useState<string | null>(null)
  const [scopeError, setScopeError] = useState<boolean>(false)
  const requiredScopes = ['read:org', 'repo', 'user', 'read:user', 'user:email']

  const [initializing, setInitializing] = useState(true)

  const handleReconnectGithub = async () => {
    if (!session?.user?.id) {
      console.error('No user session found')
      return
    }

    try {
      // Clear stored preferences but don't delete the account
      localStorage.removeItem(STORAGE_KEYS.ORG)
      localStorage.removeItem(STORAGE_KEYS.REPO)
      
      console.log('Initiating new GitHub sign in with additional scopes...')
      await signIn('github', { 
        callbackUrl: window.location.href,
        scope: 'read:org repo user read:user user:email' 
      })
    } catch (error) {
      console.error('Error during GitHub reconnection:', error)
      setError('Failed to reconnect GitHub account. Please try again.')
    }
  }

  useEffect(() => {
    const loadSavedPreferences = async () => {
      if (!accessToken) {
        setLoading(false)
        setInitializing(false)
        return
      }

      try {
        console.log('GitHubExplorer: Fetching organizations...')
        const orgs = await fetchGithubOrganizations(accessToken)
        console.log('GitHubExplorer: Fetched organizations count:', orgs?.length)
        setOrganizations(orgs)

        const savedOrg = localStorage.getItem(STORAGE_KEYS.ORG)
        const savedRepo = localStorage.getItem(STORAGE_KEYS.REPO)

        if (savedOrg && orgs.some(org => org.login === savedOrg)) {
          setSelectedOrg(savedOrg)
          const repos = await fetchGithubRepositories(accessToken, savedOrg)
          setRepositories(repos)

          if (savedRepo && repos.some((repo: Repository) => repo.name === savedRepo)) {
            setSelectedRepo(savedRepo)
            const [filesResult, existingArticlesResult] = await Promise.all([
              fetchGithubFiles(accessToken, savedOrg, savedRepo),
              fetchExistingArticles(savedOrg, savedRepo)
            ])
            setFiles(filesResult)
            setExistingArticles(existingArticlesResult)
          }
        } else if (orgs.length > 0) {
          const firstOrg = orgs[0].login
          setSelectedOrg(firstOrg)
          const repos = await fetchGithubRepositories(accessToken, firstOrg)
          setRepositories(repos)
        }
      } catch (err) {
        console.error('GitHubExplorer Error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        
        // Check if error is related to authentication or scopes
        if (errorMessage.includes('authentication failed') || 
            errorMessage.includes('invalid') || 
            errorMessage.includes('expired')) {
          setAuthError(true)
          setScopeError(true)
        } else {
          setError(errorMessage)
        }
      } finally {
        setLoading(false)
        setInitializing(false)
      }
    }

    if (sessionStatus === 'authenticated' && initializing) {
      loadSavedPreferences()
    } else if (sessionStatus !== 'loading') {
      setInitializing(false)
    }
  }, [accessToken, sessionStatus])

  useEffect(() => {
    if (selectedOrg) {
      localStorage.setItem(STORAGE_KEYS.ORG, selectedOrg)
    }
  }, [selectedOrg])

  useEffect(() => {
    if (selectedRepo) {
      localStorage.setItem(STORAGE_KEYS.REPO, selectedRepo)
    }
  }, [selectedRepo])

  const handleOrgSelect = async (org: string) => {
    setSelectedOrg(org)
    setSelectedRepo('')
    setFiles([])
    setCurrentPath([])
    setExistingArticles([])
    setLoading(true)
    try {
      const repos = await fetchGithubRepositories(accessToken, org)
      setRepositories(repos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleRepoSelect = async (repo: string) => {
    setSelectedRepo(repo)
    setCurrentPath([])
    setFiles([])
    setExistingArticles([])
    setLoading(true)
    try {
      const [filesResult, existingArticlesResult] = await Promise.all([
        fetchGithubFiles(accessToken, selectedOrg, repo),
        fetchExistingArticles(selectedOrg, repo)
      ])
      setFiles(filesResult)
      setExistingArticles(existingArticlesResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleFileNavigation = async (path: string) => {
    setCurrentPath(path.split('/').filter(Boolean))
    setLoading(true)
    try {
      const filesResult = await fetchGithubFiles(accessToken, selectedOrg, selectedRepo, path)
      setFiles(filesResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleArticleCreation = async (file: FileItem) => {
    try {
      setLoading(true)
      await createArticle(accessToken, session, selectedOrg, selectedRepo, file)
      // Fetch updated articles after creation
      const updatedArticles = await fetchExistingArticles(selectedOrg, selectedRepo)
      setExistingArticles(updatedArticles)
      alert('Article created successfully!')
    } catch (error) {
      console.error('Error creating article:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session && session.user) {
      //deleteOldGithubAccounts(session.user.id)
    }
  }, [session])

  if (sessionStatus === 'loading' || initializing) {
    return <LoadingState />
  }

  if (!session) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">GitHub Explorer</h2>
        <p className="mb-4">Please sign in to access your GitHub repositories.</p>
        <Button onClick={() => signIn('github')} className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </Button>
      </div>
    )
  }

  if (loading && !error && !authError) {
    return <LoadingState />
  }

  if (authError || scopeError) {
    return (
      <div className="p-6 border rounded-lg bg-background">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">GitHub Access Update Required</h2>
            <p className="text-muted-foreground">
              We need additional permissions to access your GitHub repositories. 
              Please reconnect your GitHub account to grant the following permissions:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
              {requiredScopes.map(scope => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
            <Button 
              onClick={handleReconnectGithub}
              className="mt-4 flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              Reconnect GitHub Account
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (authError || error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">GitHub Explorer</h2>
        <p className="mb-4">
          {authError ? 'Your GitHub access token has expired or is invalid. Please sign in again with GitHub to refresh your access.' : error}
        </p>
        <Button onClick={() => {
          localStorage.removeItem(STORAGE_KEYS.ORG)
          localStorage.removeItem(STORAGE_KEYS.REPO)
          signIn('github')
        }} className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          Reconnect GitHub Account
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto">
      {/* Header Section with Dropdowns */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <OrganizationSelector
              organizations={organizations}
              selectedOrg={selectedOrg}
              onSelect={handleOrgSelect}
              disabled={loading}
            />

            {selectedOrg && (
              <RepositorySelector
                repositories={repositories}
                selectedRepo={selectedRepo}
                onSelect={handleRepoSelect}
                disabled={loading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Files Browser */}
      {selectedRepo && accessToken && (
        <FileBrowser
          files={files}
          repoName={selectedRepo}
          orgName={selectedOrg}
          accessToken={accessToken}
          currentPath={currentPath}
          existingArticles={existingArticles}
          onNavigate={handleFileNavigation}
          onCreateArticle={handleArticleCreation}
        />
      )}
    </div>
  )
}
