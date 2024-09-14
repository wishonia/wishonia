import Image from "next/image"

interface UrlDisplayProps {
  url: string;
}

export function UrlDisplay({ url }: UrlDisplayProps) {
  const hostname = new URL(url).hostname;

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={`https://www.google.com/s2/favicons?sz=32&domain=${hostname}`}
        alt={`${hostname} favicon`}
        width={16}
        height={16}
        className="rounded-sm flex-shrink-0"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 no-underline"
      >
        {hostname}
      </a>
    </div>
  );
}