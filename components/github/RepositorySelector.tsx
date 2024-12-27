import { useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Repository } from './types'

interface Props {
  repositories: Repository[]
  selectedRepo: string
  onSelect: (repo: string) => void
  disabled?: boolean
}

export function RepositorySelector({ repositories, selectedRepo, onSelect, disabled }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-2 block">Repository</label>
      <Select
        value={selectedRepo}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a Repository" className="text-left">
            {selectedRepo}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>
          {filteredRepos.map((repo) => (
            <SelectItem key={repo.id} value={repo.name}>
              <div className="flex flex-col items-start">
                <div className="font-medium">{repo.name}</div>
                {repo.description && (
                  <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {repo.description}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
