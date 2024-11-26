"use client"

import { useEffect, useState } from "react"
import type { Account } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ConnectionsListProps {
  connectedAccounts: Account[]
}

export function ConnectionsList({ connectedAccounts }: ConnectionsListProps) {
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Record<string, any> | null>(null)
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  if (process.env.NODE_ENV === 'development') {
    console.log("ConnectionsList received accounts:", {
      connectedAccounts,
      providers: connectedAccounts.map((acc) => acc.provider),
    })
  }

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await (await fetch("/api/auth/providers")).json()
        setProviders(providers)
      } catch (error) {
        console.error("Failed to load providers:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to load authentication providers. Please try again later.",
        })
      }
    }
    loadProviders()

    if (typeof window !== "undefined") {
      setCallbackUrl(window.location.href)
    }
  }, [toast])

  if (!providers) return null

  const handleConnect = async (providerId: string) => {
    if (isLoading) return; // Prevent rapid repeated clicks
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in before connecting accounts.",
      })
      return
    }

    try {
      setIsLoading(providerId)

      localStorage.setItem("afterLoginRedirect", window.location.href)

      const result = await signIn(providerId, {
        callbackUrl: window.location.href,
        redirect: true,
        error: "/auth/error",
      })

    } catch (error) {
      console.error(`Failed to connect ${providerId}:`, error)
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: `Failed to connect to ${providerId}. Please try again later.`,
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleDisconnect = async (providerId: string) => {
    try {
      setIsLoading(providerId)

      const response = await fetch("/api/auth/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: providerId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to disconnect account")
      }

      // Refresh the page to show updated connections
      window.location.reload()
    } catch (error) {
      console.error(`Failed to disconnect ${providerId}:`, error)
      toast({
        variant: "destructive",
        title: "Disconnection Failed",
        description: `Failed to disconnect ${providerId}. Please try again later.`,
      })
    } finally {
      setIsLoading(null)
    }
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return <Icons.google className="h-6 w-6" />
      case "github":
        return <Icons.github className="h-6 w-6" />
      case "dfda":
        return <Icons.shield className="h-6 w-6" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {Object.values(providers).map((provider: any) => {
        const isConnected = connectedAccounts.some(
          (account) => account.provider === provider.id
        )

        return (
          <div
            key={provider.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              {getProviderIcon(provider.id)}
              <div>
                <p className="font-medium">{provider.name}</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <Button
              variant={isConnected ? "destructive" : "secondary"}
              onClick={() => {
                if (isConnected) {
                  handleDisconnect(provider.id)
                } else {
                  handleConnect(provider.id)
                }
              }}
              disabled={isLoading === provider.id}
            >
              {isLoading === provider.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConnected ? "Disconnecting..." : "Connecting..."}
                </>
              ) : isConnected ? (
                "Disconnect"
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
