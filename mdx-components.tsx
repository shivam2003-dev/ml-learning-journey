import type { MDXComponents } from "mdx/types";
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { h1: props => <h1 className="mdx-title" {...props}/>, h2: props => <h2 className="mdx-heading" {...props}/>, pre: props => <pre className="mdx-code" {...props}/>, ...components };
}
