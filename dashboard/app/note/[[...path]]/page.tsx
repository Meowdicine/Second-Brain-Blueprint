import { readFileSync, existsSync } from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExternalMarkdownLink } from "@/components/common/external-markdown-link";

const REPO_ROOT = path.join(process.cwd(), "..");

function isPathSafe(relativePath: string): boolean {
  const normalized = path.normalize(relativePath);
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) return false;
  return true;
}

interface NotePageProps {
  params: Promise<{ path?: string[] }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path ?? [];
  if (pathSegments.length === 0) {
    notFound();
  }

  const relativePath = pathSegments.join("/");
  if (!isPathSafe(relativePath)) {
    notFound();
  }

  const withExt = relativePath.endsWith(".md") ? relativePath : `${relativePath}.md`;
  const fullPath = path.resolve(REPO_ROOT, withExt);
  const relativeToRoot = path.relative(REPO_ROOT, fullPath);
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    notFound();
  }

  if (!existsSync(fullPath)) {
    notFound();
  }

  const content = readFileSync(fullPath, "utf-8");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-slate-700/70 bg-slate-900/80 backdrop-blur-md">
        <div className="flex h-14 items-center gap-4 px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground truncate flex-1">
            {withExt}
          </span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <article className="note-prose max-w-none text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <ExternalMarkdownLink href={href}>{children}</ExternalMarkdownLink>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
