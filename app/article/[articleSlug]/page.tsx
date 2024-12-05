import { ArticleContent } from './components/ArticleContent'

export default function ArticlePage({ params }: { params: { articleSlug: string } }) {
  const articleSlug = decodeURIComponent(params.articleSlug)
  
  return <ArticleContent articleSlug={articleSlug} />
}