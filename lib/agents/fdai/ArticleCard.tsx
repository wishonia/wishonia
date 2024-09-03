import React from 'react';
import {Article} from '@/lib/agents/fdai/fdaiMetaAnalyzer';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({article}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-2">
                    By {article.author} | {new Date(article.publishedDate).toLocaleDateString()}
                </p>
                <p className="text-muted-foreground text-sm">Score: {article.score.toFixed(2)}</p>
            </CardHeader>
            <CardContent>
                <p className="text-card-foreground mb-4 line-clamp-3">{article.text}</p>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                >
                    Read More
                </a>
            </CardContent>
        </Card>
    );
};

export default ArticleCard;