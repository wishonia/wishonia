'use client'

import { signIn } from 'next-auth/react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface GitHubConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GitHubConnectModal({ isOpen, onClose }: GitHubConnectModalProps) {
  const handleConnect = () => {
    signIn('github', {
      callbackUrl: window.location.href,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect GitHub Account</DialogTitle>
          <DialogDescription>
            To view this documentation, you need to connect your GitHub account to access the repository contents.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={handleConnect} variant="outline">
            <Icons.github className="mr-2 h-4 w-4" />
            Connect GitHub Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 