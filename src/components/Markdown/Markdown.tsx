import ReactMarkdown, { Options } from 'react-markdown'

// react-markdown v10 dropped the `className` and `linkTarget` props it used
// to accept directly (see https://github.com/remarkjs/react-markdown/blob/main/changelog.md).
// This wraps it with the equivalent behavior this app relies on everywhere:
// a `.markdown` class on a containing element (for the global styles defined
// in mui-theme.ts), and links that open in a new tab.
const MarkdownLink = (props: React.ComponentProps<'a'>) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content -- content comes from props.children at render time
  <a {...props} target="_blank" rel="noopener noreferrer" />
)

export const Markdown = (props: Options) => (
  <div className="markdown">
    <ReactMarkdown {...{ components: { a: MarkdownLink }, ...props }} />
  </div>
)
