const projectsData = [
  // Open Source AI/ML Tools
  {
    title: 'AI Data Extraction Toolkit',
    description:
      'Extract conversation histories from Claude Code, Cursor, Codex, Windsurf, and Trae for ML training and analysis.',
    imgSrc: '/static/images/ai-extraction.png',
    href: 'https://github.com/0xSero/ai-data-extraction',
    tags: ['AI', 'Python', 'Open Source'],
  },
  {
    title: 'Open Orchestra',
    description:
      'Multi-agent orchestration plugin with hub-and-spoke architecture, Neo4j memory, and 22+ tool APIs for worker coordination.',
    imgSrc: '/static/images/open-orchestra.png',
    href: 'https://github.com/0xSero/open-orchestra',
    tags: ['AI', 'Agents', 'TypeScript'],
  },
  {
    title: 'Azul',
    description:
      'Terminal-based web browser in Rust with AI chat integration, multi-engine search, and tool-calling for hands-free browsing.',
    imgSrc: '/static/images/azul.png',
    href: 'https://github.com/0xSero/Azul',
    tags: ['Rust', 'TUI', 'AI'],
  },
  {
    title: 'Mem-Layer',
    description:
      'Graph-based AI memory system with scoped isolation, temporal awareness, and MCP server support for persistent context.',
    imgSrc: '/static/images/mem-layer.png',
    href: 'https://github.com/0xSero/mem-layer',
    tags: ['AI', 'Graphs', 'Python'],
  },
  {
    title: 'Browser-AI (Azzta Agent)',
    description:
      'Chrome extension for AI-driven browser automation with orchestrator mode, vision support, and safety guardrails.',
    imgSrc: '/static/images/browser-ai.png',
    href: 'https://github.com/0xSero/browser-ai',
    tags: ['AI', 'Chrome', 'Automation'],
  },
  {
    title: 'MiniMax-M2 Proxy',
    description:
      'Translation proxy enabling 229B MoE models to work with OpenAI/Anthropic SDKs with interleaved thinking support.',
    imgSrc: '/static/images/minimax-proxy.png',
    href: 'https://github.com/0xSero/minimax-m2-proxy',
    tags: ['AI', 'LLM', 'Python'],
  },
  {
    title: 'Codex Local',
    description:
      'Fork of OpenAI Codex CLI with multi-agent orchestration, parallel tool execution, and local LLM support.',
    imgSrc: '/static/images/codex-local.png',
    href: 'https://github.com/0xSero/codex-local',
    tags: ['AI', 'Rust', 'Agents'],
  },
  {
    title: 'Home RAG',
    description:
      'Knowledge graph RAG system combining vector embeddings with Neo4j for semantic search and multi-hop reasoning.',
    imgSrc: '/static/images/home-rag.png',
    href: 'https://github.com/0xSero/home-rag',
    tags: ['AI', 'RAG', 'Python'],
  },

  // Major Open Source Contributions
  {
    title: 'ElizaOS',
    description:
      'Core contributor: led Biome migration, resolved linting issues, improved startup configuration. 17k+ stars.',
    imgSrc: '/static/images/elizaos.png',
    href: 'https://github.com/elizaOS/eliza',
    tags: ['AI', 'Agents', 'Contributor'],
  },
  {
    title: 'Synpress',
    description:
      'Contributor: MetaMask wait functions, race condition fixes, CI improvements for Web3 E2E testing.',
    imgSrc: '/static/images/synpress.jpg',
    href: 'https://github.com/synpress-io/synpress',
    tags: ['Testing', 'E2E', 'Contributor'],
  },

  // Client Work & Collaborations
  {
    title: 'ZKSync - Governance RSS',
    description:
      'Real-time governance event monitor handling 80k-160k daily RPC calls, turning on-chain activity into RSS feeds.',
    imgSrc: '/static/images/zksync.png',
    href: 'https://feed.zknation.io/',
    tags: ['Governance', 'ZKSync', 'Infrastructure'],
  },
  {
    title: 'Ethereum Foundation - IVCNotes',
    description:
      'Privacy-preserving digital notes using ZK proofs, IVC, and MPC for the PSE research team.',
    imgSrc: '/static/images/ef.png',
    href: 'https://ethereum.foundation/',
    tags: ['ZK', 'Research', 'Rust'],
  },
  {
    title: 'Gitcoin',
    description: 'Research and development for cross-chain donations and LTIP grant mechanisms.',
    imgSrc: '/static/images/gitcoin.png',
    href: 'https://gitcoin.co',
    tags: ['Grants', 'Cross-chain', 'Research'],
  },
  {
    title: 'POKT Network',
    description:
      'Website modernization, CMS development, data migration, and infrastructure research.',
    imgSrc: '/static/images/pokt.jpg',
    href: 'https://pokt.network',
    tags: ['Infrastructure', 'Web', 'CMS'],
  },

  // DeFi & Web3 Tools
  {
    title: 'Deploy SuperToken',
    description: 'One-click UI for deploying Superfluid supertokens from any ERC20 on any network.',
    imgSrc: '/static/images/supertoken.png',
    href: 'https://github.com/0xSero/deploy-supertoken',
    tags: ['DeFi', 'Superfluid', 'React'],
  },
  {
    title: 'Superfluid Console',
    description:
      'Developer explorer for the Superfluid Protocol with advanced querying and analytics.',
    imgSrc: '/static/images/superfluid.png',
    href: 'https://console.superfluid.finance',
    tags: ['DeFi', 'Explorer', 'TypeScript'],
  },
  {
    title: 'Sequencer Monitor',
    description:
      'MakerDAO sequencer monitoring with Discord alerts for workable jobs across networks.',
    imgSrc: '/static/images/sequencer.png',
    href: 'https://github.com/0xSero/Sequencer-Monitor',
    tags: ['MakerDAO', 'Monitoring', 'TypeScript'],
  },
  {
    title: 'Tellor Finance - Fund a Feed',
    description: 'Decentralized on-chain tipping and reporting system for oracle data feeds.',
    imgSrc: '/static/images/tellor.png',
    href: 'https://fundafeed.herokuapp.com/',
    tags: ['Oracle', 'DeFi', 'React'],
  },

  // Media & Community
  {
    title: 'Ethers Club Podcast',
    description: 'Conversations with builders, researchers, and thinkers across crypto and AI.',
    imgSrc: '/static/images/EthersClub.png',
    href: 'https://podcast.ethers.club',
    tags: ['Podcast', 'Community', 'Media'],
  },

  // New Projects
  {
    title: 'Open Queue',
    description:
      'Queue messages while AI assistants is thinking. Prevents context confusion from interrupting mid-response by holding messages until model is ready.',
    imgSrc: '/static/images/open-queue.png',
    href: 'https://github.com/0xSero/open-queue',
    tags: ['AI', 'Developer Tools', 'TypeScript'],
  },
  {
    title: 'MiniMax Agent (ACP)',
    description:
      'Integration of MiniAgent with Agent Communication Protocol for Zed editor. Full agent execution loop with persistent memory, Claude skills, and MCP tool support.',
    imgSrc: '/static/images/mini-agent-acp.png',
    href: 'https://github.com/MiniMax-AI/Mini-Agent',
    tags: ['AI', 'Agents', 'Python'],
  },

  // Earlier Projects
  {
    title: 'Metagame',
    description:
      'MetaOS - an open-source framework for running decentralized societies and coordination.',
    imgSrc: '/static/images/metagame.png',
    href: 'https://metagame.wtf/',
    tags: ['DAO', 'Coordination', 'TypeScript'],
  },
  {
    title: 'Alluo Finance',
    description: 'DCA and yield optimization in a trustless, decentralized application.',
    imgSrc: '/static/images/alluo.jpg',
    href: 'https://app.alluo.finance/',
    tags: ['DeFi', 'Yield', 'React'],
  },
  {
    title: 'DebtDAO',
    description: 'Revenue-based collateralized borrowing and lending on Ethereum Mainnet.',
    imgSrc: '/static/images/debt-dao.png',
    href: 'https://debtdao.finance/',
    tags: ['DeFi', 'Lending', 'Ethereum'],
  },
]

export default projectsData
