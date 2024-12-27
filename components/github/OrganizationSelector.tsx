import { useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Organization } from './types'

interface Props {
  organizations: Organization[]
  selectedOrg: string
  onSelect: (org: string) => void
  disabled?: boolean
}

export function OrganizationSelector({ organizations, selectedOrg, onSelect, disabled }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrgs = organizations.filter(org =>
    org.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-2 block">Organization</label>
      <Select
        value={selectedOrg}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>
          {filteredOrgs.map((org) => (
            <SelectItem key={org.id} value={org.login}>
              <div className="flex items-center gap-2">
                <img
                  src={org.avatar_url}
                  alt={org.login}
                  className="w-5 h-5 rounded-full"
                />
                <span>{org.login}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
