import ArticleSearchAndGrid from "@/components/article/ArticleSearchAndGrid";

export default function ArticleList() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Articles</h1>
            <ArticleSearchAndGrid />
        </div>
    )
}