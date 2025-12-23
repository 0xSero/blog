import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="rounded-lg bg-surface-inset px-2 py-1 text-xs font-medium text-accent-subtle transition-colors hover:text-text-primary">
        {text}
      </a>
    </Link>
  )
}

export default Tag
