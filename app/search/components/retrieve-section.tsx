import React from 'react'
import { Section } from '@/app/search/components/section'
import { SearchResults } from '@/app/search/components/search-results'
import { SearchResults as SearchResultsType } from '@/lib/types/index'

interface RetrieveSectionProps {
  data: SearchResultsType
}

const RetrieveSection: React.FC<RetrieveSectionProps> = ({ data }) => {
  return (
    <Section title="Sources">
      <SearchResults results={data.results} />
    </Section>
  )
}

export default RetrieveSection
