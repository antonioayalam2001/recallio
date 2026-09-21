import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Componente que renderiza texto en Markdown con resaltado de sintaxis (PrismJS)
 * para código fuente (TypeScript, Python, Bash, SQL, JSX, etc.).
 *
 * @component MarkdownContent
 */
export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      Prism.highlightAllUnder(containerRef.current);
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`prose dark:prose-invert max-w-none break-words ${className}`}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-black mb-3 text-primary">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-2 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 text-foreground">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-2 leading-relaxed opacity-90">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-1 italic bg-primary/5 rounded-r-xl my-3 opacity-90">
              {children}
            </blockquote>
          ),
          code({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean; node?: unknown }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md font-mono text-xs font-bold bg-primary/10 text-primary"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className={`language-${match ? match[1] : 'typescript'}`}>
                <code className={`language-${match ? match[1] : 'typescript'}`} {...props}>
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
