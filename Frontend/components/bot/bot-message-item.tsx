import { BotMessageSquareIcon, CheckIcon, CopyIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import "@/app/github-markdown-light.css";

interface BotMessageItemProps {
  content: string;
  role: string;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className = "",
  children,
}) => {
  const match = /language-(\w+)/.exec(className || "");

  const getCodeString = (children: ReactNode): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children.map((child) => getCodeString(child)).join("");
    }
    if (children && typeof children === "object" && "props" in children) {
      return getCodeString(children.props.children);
    }
    return String(children || "");
  };

  const codeString = getCodeString(children).trim();
  const [copied, setCopied] = useState(false);

  return !inline && match ? (
    <div className="overflow-x-auto bg-white p-1 border-2 border-gray-300 rounded-sm">
      <div className="mt-1 mx-3 flex justify-between">
        <p>{match[1]}</p>
        <button
          title="Copy"
          onClick={() => {
            navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
          type="button"
          className="rounded-sm hover:bg-black/10 p-2 text-xs"
        >
          {copied ? (
            <p className="flex self-center">
              <CheckIcon className="size-4" /> Copied
            </p>
          ) : (
            <p className="flex self-center">
              <CopyIcon className="size-4" /> Copy code
            </p>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        customStyle={{
          backgroundColor: "transparent",
          border: "none",
        }}
        style={vs}
        language={match[1]}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      className={`${className} italic p-0.5 bg-neutral-100 font-mono text-gray-700 rounded-[4px] max-w-4 break-words whitespace-pre-wrap`}
    >
      {codeString}
    </code>
  );
};

const BotMessageItem: React.FC<BotMessageItemProps> = ({ content, role }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-2">
      <div className="flex gap-4">
        {role !== "user" && <BotMessageSquareIcon strokeWidth={1.5} />}
      </div>
      {role !== "user" ? (
        <div className="flex items-center gap-2">
          <div className="bg-zinc-200 min-w-16 max-w-max py-2 px-3 rounded-[1rem] rounded-tl-none">
            <div className="whitespace-pre-wrap inline-block px-2 py-4 break-words max-w-full">
              <Markdown
                className="markdown-body"
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={{
                  code: ({ node, ...props }) => <CodeBlock {...props} />,
                }}
              >
                {content}
              </Markdown>
            </div>
            <div className="">
              <button
                title="Copy"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                type="button"
                className="rounded-sm hover:bg-black/10 p-2"
              >
                {copied ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <CopyIcon className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row-reverse items-center gap-2">
          <div className="bg-lime-300 min-w-16 max-w-max py-2 px-3 rounded-[1rem] rounded-tr-none">
            <p className="whitespace-pre-wrap inline-block px-2 break-all max-w-[70vw] sm:max-w-[30vw]">
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotMessageItem;
