import {MarkdownPage} from "@/interfaces/markdownPage";
// @ts-ignore
import {markdownPages} from "@/lib/markdownPages";
import {LinkCard} from "@/components/link-card";

export default async function MarkdownPageList() {
    return (
        <div className="mx-auto max-w-xl py-8">
            <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1>
            {markdownPages.map((mdPage: MarkdownPage, idx: any) => (
                <LinkCard navItem={{
                    title: mdPage.name,
                    tooltip: mdPage.description,
                    disabled: false,
                    external: false,
                    img: mdPage.featuredImage,
                    icon: undefined,
                    href: mdPage.url.toString()
                }} key={idx} {...mdPage} />
            ))}
        </div>
    )
}