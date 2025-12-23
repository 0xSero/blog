import Link from '@/components/Link'

const featuredProjects = [
  {
    title: 'AI Data Extraction',
    description: 'Extract conversations from Claude Code, Cursor, Codex, Windsurf for ML training',
    href: 'https://github.com/0xSero/ai-data-extraction',
    tags: ['Python', 'AI'],
  },
  {
    title: 'Open Orchestra',
    description: 'Hub-and-spoke multi-agent orchestration with Neo4j memory and 22+ tool APIs',
    href: 'https://github.com/0xSero/open-orchestra',
    tags: ['TypeScript', 'Agents'],
  },
  {
    title: 'Azul',
    description: 'Terminal web browser in Rust with AI chat, multi-engine search, and tool-calling',
    href: 'https://github.com/0xSero/Azul',
    tags: ['Rust', 'TUI'],
  },
  {
    title: 'Mem-Layer',
    description: 'Graph-based AI memory with scoped isolation and MCP server support',
    href: 'https://github.com/0xSero/mem-layer',
    tags: ['Python', 'Graphs'],
  },
  {
    title: 'Browser-AI',
    description: 'Chrome extension for AI browser automation with orchestrator mode and vision',
    href: 'https://github.com/0xSero/browser-ai',
    tags: ['Chrome', 'Automation'],
  },
  {
    title: 'Codex Local',
    description: 'Fork of OpenAI Codex with multi-agent orchestration and local LLM support',
    href: 'https://github.com/0xSero/codex-local',
    tags: ['Rust', 'Agents'],
  },
]

export default function FeaturedProjects() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featuredProjects.map((project) => (
        <Link
          key={project.title}
          href={project.href}
          className="group bg-surface-elevated/50 relative rounded-xl border border-border-subtle p-5 transition-all hover:border-border-strong hover:bg-surface-elevated"
        >
          <div className="mb-2">
            <h3 className="font-medium text-text-primary transition-colors group-hover:text-accent-subtle">
              {project.title}
            </h3>
          </div>
          <p className="mb-3 text-sm text-text-secondary">{project.description}</p>
          <div className="flex gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-surface-inset px-2 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <svg
            className="absolute right-4 top-4 h-4 w-4 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
      ))}
    </div>
  )
}
