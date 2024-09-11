import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

type ArticleSearchBoxProps = {
    searchQuery: string
    setSearchQuery: (query: string) => void
    isLoading: boolean
}

export default function ArticleSearchBox({ searchQuery, setSearchQuery, isLoading }: ArticleSearchBoxProps) {
    return (
        <div className="mb-6">
            <Input
                type="search"
                placeholder="Search articles..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full max-w-md"
            />
            {isLoading && (
                <div className="mt-2 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}
        </div>
    )
}