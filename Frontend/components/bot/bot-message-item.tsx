import { BotMessageSquareIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  // Properly handle React children conversion to string
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

  return !inline && match ? (
    <div className="overflow-x-auto">
      <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div">
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={`overflow-x-auto max-w-[70vw] block ${className}`}>
      {codeString}
    </code>
  );
};

const BotMessageItem: React.FC<BotMessageItemProps> = ({ content, role }) => {
  return (
    <div className="p-2">
      <div className="flex gap-4">
        {role !== "user" && <BotMessageSquareIcon strokeWidth={1.5} />}
      </div>
      {role !== "user" ? (
        <div className="flex items-center gap-2">
          <div className="bg-zinc-200 min-w-16 max-w-max py-2 px-3 rounded-[1rem] rounded-tl-none">
            <div className="whitespace-pre-wrap inline-block px-2 break-words max-w-full">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: ({ node, ...props }) => <CodeBlock {...props} />,
                }}
              >
                {content}
              </Markdown>
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
