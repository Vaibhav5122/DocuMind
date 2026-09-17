"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, isStreaming }: MarkdownRendererProps) {
  if (!content && isStreaming) {
    return (
      <span className="inline-block w-2 h-4 bg-primary/70 animate-pulse ml-0.5 rounded-xs" />
    );
  }

  // Parse lines and code blocks
  const elements = parseMarkdown(content);

  return (
    <div className="space-y-3 leading-relaxed text-sm md:text-base text-foreground break-words font-normal">
      {elements}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-primary/70 animate-pulse ml-1 align-middle rounded-xs" />
      )}
    </div>
  );
}

function parseMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];
  let listItems: { ordered: boolean; text: string }[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    const isOrdered = listItems[0].ordered;
    const ListTag = isOrdered ? "ol" : "ul";
    nodes.push(
      <ListTag
        key={`list-${nodes.length}`}
        className={`my-2 space-y-1 pl-6 ${
          isOrdered ? "list-decimal" : "list-disc"
        }`}
      >
        {listItems.map((item, idx) => (
          <li key={idx} className="text-foreground/90">
            {formatInlineText(item.text)}
          </li>
        ))}
      </ListTag>,
    );
    listItems = [];
  };

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const rows = tableRows.slice(1);
    nodes.push(
      <div key={`table-${nodes.length}`} className="my-3 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              {header.map((col, idx) => (
                <th key={idx} className="px-3 py-2 font-semibold">
                  {formatInlineText(col.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-muted/20">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2">
                    {formatInlineText(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code blocks
    if (line.startsWith("```")) {
      flushList();
      flushTable();
      if (inCodeBlock) {
        // End of code block
        nodes.push(
          <CodeBlock
            key={`code-${nodes.length}`}
            language={codeBlockLang}
            code={codeBlockLines.join("\n")}
          />,
        );
        codeBlockLines = [];
        inCodeBlock = false;
        codeBlockLang = "";
      } else {
        // Start of code block
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Check tables: | col1 | col2 |
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList();
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|");
      // Skip markdown divider line |---|---|
      const isDivider = cells.every((c) => /^[\s-:]+$/.test(c));
      if (!isDivider) {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Check list items
    const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (unorderedMatch) {
      flushTable();
      listItems.push({ ordered: false, text: unorderedMatch[2] });
      continue;
    }

    if (orderedMatch) {
      flushTable();
      listItems.push({ ordered: true, text: orderedMatch[2] });
      continue;
    }

    flushList();

    // Headers
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${nodes.length}`} className="font-semibold text-base sm:text-lg mt-4 mb-1 text-foreground">
          {formatInlineText(line.slice(4))}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${nodes.length}`} className="font-bold text-lg sm:text-xl mt-5 mb-1.5 text-foreground border-b border-border/40 pb-1">
          {formatInlineText(line.slice(3))}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${nodes.length}`} className="font-bold text-xl sm:text-2xl mt-5 mb-2 text-foreground border-b border-border/50 pb-1.5">
          {formatInlineText(line.slice(2))}
        </h1>,
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className="border-l-4 border-primary/60 pl-4 py-1 italic text-muted-foreground my-2 bg-muted/20 rounded-r"
        >
          {formatInlineText(line.slice(2))}
        </blockquote>,
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${nodes.length}`} className="my-1.5 leading-relaxed">
        {formatInlineText(line)}
      </p>,
    );
  }

  // Flush remaining blocks
  if (inCodeBlock && codeBlockLines.length > 0) {
    nodes.push(
      <CodeBlock
        key={`code-${nodes.length}`}
        language={codeBlockLang}
        code={codeBlockLines.join("\n")}
      />,
    );
  }
  flushList();
  flushTable();

  return nodes;
}

function formatInlineText(text: string): React.ReactNode[] {
  // Matches inline code `code`, bold **bold** or __bold__, italic *italic* or _italic_
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const matchStart = match.index;

    if (matchStart > lastIdx) {
      parts.push(text.slice(lastIdx, matchStart));
    }

    if (raw.startsWith("`") && raw.endsWith("`")) {
      parts.push(
        <code
          key={`code-${matchStart}`}
          className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-primary font-medium border border-border/50"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (
      (raw.startsWith("**") && raw.endsWith("**")) ||
      (raw.startsWith("__") && raw.endsWith("__"))
    ) {
      parts.push(
        <strong key={`strong-${matchStart}`} className="font-semibold text-foreground">
          {raw.slice(2, -2)}
        </strong>,
      );
    } else if (
      (raw.startsWith("*") && raw.endsWith("*")) ||
      (raw.startsWith("_") && raw.endsWith("_"))
    ) {
      parts.push(
        <em key={`em-${matchStart}`} className="italic">
          {raw.slice(1, -1)}
        </em>,
      );
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length > 0 ? parts : [text];
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-border bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm">
      <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-800/80 border-b border-neutral-700/60 text-xs text-neutral-400">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
