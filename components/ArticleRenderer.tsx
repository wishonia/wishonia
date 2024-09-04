import {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Clock, Tag, Folder, Link2} from 'lucide-react'
import {ReportOutput} from '@/lib/agents/researcher/researcher'
import {CustomReactMarkdown} from "@/components/CustomReactMarkdown";

export default function ArticleRenderer(props: ReportOutput) {
    const [expandedResult, setExpandedResult] = useState<string | null>(null)

    const {
        title,
        description,
        content,
        sources,
        tags,
        category,
        readingTime,
        searchResults
    } = props

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <Separator className="my-4 mx-auto w-[90%]" />
                    <CardContent>
                        <CustomReactMarkdown>
                            {content}
                        </CustomReactMarkdown>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Folder className="w-4 h-4"/>
                                <span>{category}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4"/>
                                <span>{readingTime} min read</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Tag className="w-4 h-4"/>
                                {tags?.map((tag, index) => (
                                    <Badge key={index} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {sources?.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center space-x-2 text-blue-500 hover:underline">
                                            <Link2 className="w-4 h-4"/>
                                            <span>{source.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {searchResults?.map((result, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-lg font-semibold">
                                <a href={result.url} target="_blank" rel="noopener noreferrer"
                                   className="text-blue-500 hover:underline">
                                    {result.title}
                                </a>
                            </h3>
                            {result.publishedDate && (
                                <p className="text-sm text-muted-foreground">
                                    Published on: {new Date(result.publishedDate).toLocaleDateString()}
                                </p>
                            )}
                            <p className="mt-1">
                                {expandedResult === result.id ? result.text : `${result.text.slice(0, 150)}...`}
                                {result.text.length > 150 && (
                                    <button
                                        onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                                        className="ml-2 text-blue-500 hover:underline"
                                    >
                                        {expandedResult === result.id ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </p>
                            {index < (searchResults.length - 1) && <Separator className="my-4"/>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}