---
title: 'Building My Own Homelab: From AI Dependency to Local Superpower'
date: '15 / January / 2026'
tags: ['AI', 'Hardware', 'Deep Learning', 'DIY', 'Open Source']
draft: false
summary: 'My 3-year journey from spending 20k on AI subscriptions to building a custom quad-GPU AI rig for local inference'
---

From August 2022, I tried out DALL·E for the first time and instantly knew we had entered a new world. I tried prompting it to generate a living room with a modern minimal aesthetic, and the output was surprisingly decent. I thought the technology was cool but not particularly practical.

I started experimenting with GPT-4 for basic code completion and writing help. Within a few months, LLMs became central to my workflow. I built applications that used LLMs for everything - budgeting analysis, parenting advice, code generation, health tracking, language learning.

I launched multiple side projects trying to commercialize AI applications. I consulted for companies building AI-powered products. I discovered ElizaOS in late 2023, and realised this was the first framework that made building AI agents approachable for TypeScript developers. I contributed to its ecosystem extensively.

Around that time, around December 2023, I read _Why Machines Learn_ by Melanie Mitchell. I expected a dry theoretical textbook, but it was actually quite accessible. It explained backpropagation, gradient descent, and vector mathematics in layman's terms. I learned about the perceptron, activation functions, and loss surfaces. My background in software development meant I could map these concepts to code I had already written. I started running small models locally on my MacBook, curious to see how they handled basic tasks.

By April 2024, I was actively consuming AI content daily - reading papers, watching benchmarks, following model releases. I subscribed to multiple AI services - Claude API, Cursor Pro, other coding assistants. My usage grew exponentially.

## The Breakpoint

Three months ago, I started realizing I was hopelessly dependent on corporations. I was at their mercy - corporations only care about power, money, and control. I could not access my own data. I could not inspect the models I was using. I could not customize the behaviour. I was limited by their API policies, their usage caps, their pricing tiers.

I was spending thousands monthly on AI subscriptions. Looking back at my detailed usage analysis from October 2025:

- $542 for 2,400 worth of Cursor API credits
- $720 for 3,750 worth of Claude Code API credits
- $520 for additional Cursor subscriptions
- $220 for other AI tools
- **Total: $2,012 for approximately $10,000+ worth of inference value**

Figure 1 shows the breakdown: I was getting about 5x value for my money, but I was paying thousands monthly. More importantly, I had zero ownership. The minute Cursor raised their prices by another 30 percent, my costs would go up immediately. The minute Claude limited context windows, my workflow broke.

Let me dive into what that money actually bought me:

**Cursor Pro**: Primarily for code generation. I used it for React components, backend APIs, debugging complex issues. The model would suggest entire functions, refactor code, write tests. I found it especially good for boilerplate code and standard patterns.

**Claude Code**: This became my go-to for complex reasoning tasks. I used it for architectural decisions, planning large features, explaining complex systems. Claude's ability to reason about codebases made it worth the high cost. I particularly valued its structured thinking ability when planning multi-step changes.

**Other tools**: Various coding assistants for specific tasks - PDF analysis, documentation, bug triage. Most were underused because the cost per task didn't justify constant usage.

The problem became clear: I was paying for inference but not accessing the models directly. I couldn't run custom fine-tuned versions. I couldn't combine models in hybrid workflows. I couldn't inspect the outputs for security concerns.

The solution was obvious to my frustrated self: invest in my own hardware. I started running small models on my MacBook using llama.cpp. I built MCPs for them, experimenting with different quantization levels and configurations. I discovered we're at a point where intelligence can fit on 36GB of RAM. Llama-3-70B is quantized to Q4 and runs decently. Mistral-7x22B fits in similar memory with aggressive quantization.

But I wanted more. I wanted choice. I wanted freedom. I wanted to run multiple models simultaneously without hitting usage limits. I wanted to understand every aspect of my setup. I started running small models on my MacBook, building MCPs for them, discovering we're at a point where intelligence can fit on 36GB of RAM. It's not perfect but it's yours.

## Making the Decision

I considered buying a Mac M3 Ultra with 512GB memory, but months of research convinced me otherwise. I started a 3-month journey researching, purchasing, assembling, and tinkering with a quad 3090 rig.

## My Journey

### August 25, 2025

Buying 4x 3090s tomorrow. Stacking GPU and BTC strategically.

### August 31, 2025

Realizing this is more difficult than expected. These GPUs draw up to 450W each at spikes. I need 2 PSUs, connected via adapters, to separate the GPUs.

### September 6, 2025

How on earth do I fit 4 3090s near this thing? I've never seen bigger GPUs.

### September 16, 2025

This is where things went wrong. I spent over 20 hours setting everything up. The case was carefully planned. The airflow was optimized. All connections were verified. The first run completed successfully.

Then everything crashed.

I opened the system after 22 hours and discovered the problem. One GPU had overheated and failed. I shipped it back to get a replacement. The replacement arrived, I installed it, and it failed immediately. I spent another day troubleshooting only to find a second bad GPU.

That was only the beginning. I fixed the GPUs but then realized one PCIe riser cable was damaged. The riser that connects the motherboard to GPU 2 had snapped. I ordered a replacement and installed it correctly.

Then I hit the power supply problem. My originally planned power supply had enough total wattage, but it couldn't deliver enough PCIe power to 8 GPUs simultaneously. Standard PSUs only provide a limited number of PCIe power cables with a total shared budget. I was trying to feed 8 GPUs, each with 3x 8-pin power connectors. That's 24 PCIe power lines needed. My original 1,200W PSU only had 8 PCIe cables with total capacity for maybe 10 GPUs.

I had to upgrade to dual 1,600W Corsair units and bridge them together with a specialized cable. Even then, I had to be extremely careful about power distribution. The naming convention on the rear of the PSUs is confusing - some cables came from different banks of rails. I spent hours verifying each cable's actual source using a multimeter before I trusted it.

The GPUs themselves were bigger than I expected. They kept hitting each other and the motherboard PCIe slots. I needed PCIe riser cables that could mount at the bottom, top, and corners of the case. Not all cables provide equally good signal integrity at those angles. I ended up buying premium braided cables from a mining-specific supplier.

I also learned about PCIe lane allocation. My EPYC CPU has 128 lanes but they're shared between PCIe slots. Some slots are x16, some are x8. I needed to calculate exactly which GPUs would get x16 bandwidth and which would get x8. Running 8 GPUs at x16 bandwidth would saturate all lanes, so I had to use a mix of x16 and x8. This doesn't matter for most workloads but does impact matrix operations for extremely large models.

Ultimately I got everything working. The delay was frustrating but the knowledge I gained was invaluable. I now understand PCIe depths, power supply capabilities, GPU thermals, and everything else that goes into building a serious machine.

### September 17, 2025

It is a glorious day. All 4 GPUs are live. This was one of the most fun projects I've ever done.

### September 20, 2025

I zip-tied this from scratch. Cost was $100 for the parts.

### September 26, 2025

2 months of research on hardware before doing this. If you want something for LLMs, either go for a Mac or get 2-4x 3090s. The truth about a lot of AI mini machines is that they just don't perform well.

The metrics don't lie. Linux server with 3090s is the best bang for buck out there. Mac Ultras can run huge models but not at any usable speeds.

### October 3, 2025

Yes. I am running a quad 3090 rig. My highest TPS is 4,000 prefill per second and 55 TPS, falling to 15 TPS by the end with llama.cpp. The best is with vLLM, staying consistently at 35 TPS.

Let me walk through what I actually ran. I tested GLM-4.5-Air-AWQ-4bit with vLLM across multiple configurations:

**Basic run:**

- 4 GPUs in tensor parallel
- Default batch size
- No KV cache optimizations

This gave me around 25 TPS at peak, dropping to about 12 TPS as context grew. This was surprisingly fast for early testing.

**Optimized run:**

- Enabled contiguous KV cache
- Adjusted block size based on model
- Better PCIe alignment
- Fresh power from PSU

I saw this jump to 35 TPS sustained. The key was changing the vLLM block size from the default. If the block is too small, I lost efficiency. If too large, I wasted memory.

**llama.cpp run:**

- gguf format quantization
- mmap enabled for faster loading
- parallel batching
- basic options: --contiguous -b 512

This ran slower initially. Prefill was around 1,000 TPS but then degraded significantly. By the end of a 4k token sequence, I was down to about 10 TPS. The issue is in the inference loop - each token requires decoding and attention across the entire context, and llama.cpp does this sequentially.

**Speculative decoding:**
I tried using a smaller model to draft tokens that a larger model then verified. This helped a bit but added complexity. The overhead didn't pay off for my workload.

**KV cache experimentation:**
I tested both FP16 and Q4 kv_cache. FP16 gave better quality but used 2x the memory. Q4 reduced memory pressure but introduced some quality degradation. For long contexts, FP16 was worth it if you had the VRAM.

Ultimately, my quad 3090 rig gave me access to Claude-quality performance locally. I could run GLM-4.5-Air with full context and decent speed, Qwen-72B for reasoning tasks, mini models for code completion. I reached the point where I feel comfortable never touching a proprietary model again.

I spent about 2 weeks tweaking settings. Along the way I learned:

**PCIe alignment matters:** Running vLLM with GPUs not in PCIe x8 slots wastes bandwidth. I tested different layouts and found consistent PCIe 3.0 x8 gave 60% of x16 performance. The difference was dramatic in large model inference.

**KV cache tuning:** Different models benefit from different KV cache configurations. GLM-4.5 responds better to larger blocks. Qwen handles smaller blocks efficiently. Get this wrong and you waste 20-30% of your VRAM.

**Quantization selection:** Not all quantizations are equal. Q4_K_S was terrible quality. Q6_K was good but memory intensive. Q5_K_M was the sweet spot for GLM-4.5. Different models required different quantizations even within the same quantization scheme.

**Batching strategies:** Single prompt batching was inefficient. I needed to support multiple concurrent requests with different context sizes. vLLM handles this automatically but requires careful sizing of worker pools.

The journey to performance optimization was fascinating. Small changes made big differences. Getting these right felt like unlocking the system's true potential.

### November 7, 2025

I needed 2 more GPUs. Then another 2.

### November 14, 2025

The prophecy has been fulfilled. 8x 3090s = 192GB VRAM. I cap GPUs at 200W each. The whole rig is about 1,200W on full power - about the same as a mini AC unit.

I am in computer heaven.

### November 21. 2025

Since moving to 8x 3090, I've used MiniMax-Reap-162B more than Claude and GPT today. With SGLang:

- 3,500 TPS for prompt processing
- ~50 TPS for prompt generation
- Running in Claude Code with MCP hooks, subagents, skills
- Running in Chatbox

The difference in my workflow has been dramatic. Before, I would write a prompt and wait for Claude to respond. Now, I can have the model continuously refining code while I think about the next issue. The agent capabilities let the model autonomously read files, make changes, test using tools, and iterate. This kind of work was impossible with API-based access.

My current OpenAI-compatible endpoint serves multiple models simultaneously. GLM-4.5-Air handles code completion. MiniMax handles complex reasoning. Hermes handles unrestricted queries. A simple router forwards requests to the appropriate model based on the task. I run everything as a Docker container with GPU passthrough, accessing the GPUs directly for maximum performance.

The throughput numbers sound impressive but the real value is in reliability and consistency. I no longer hit rate limits. I don't worry about API downtime. I can scale horizontally by adding more GPUs instead of asking for more tokens from corporate APIs. When I finish a task, I can save the entire conversation history including all code changes without hitting length limits.

## Hardware Specifications

**Quad 3090 Setup:**

- 4x RTX 3090 (24GB each = 96GB VRAM total)
- 2x 1,600W Corsair PSUs
- EPYC 7443P CPU
- 512GB DDR4 RAM
- ASRock Romed8-2T motherboard
- 6TB NVMe storage
- Corsair AX1600i PSU
- Thermal Core p90 open tower

**Cost Breakdown:**

- 8x RTX 3090: $7,118.64
- 512GB DDR4: $2,224.61
- ASRock Romed8-2T: $902.63
- EPYC 7443P: $739.01
- 2TB Samsung NVMe: $194.38
- 4TB Samsung NVMe: $358.16
- 2x 1,600W Corsair PSUs: $723.00

**Minimum viable setup:**
2x 3090s with 64GB RAM = $3,000 USD

## Performance Metrics

On my 4x 3090 rig with vLLM:

- Prefill: 3,000-4,000 TPS
- Generation: 35-50 TPS with optimized settings
- Context window: Successfully running 180k context on 6x 3090s (174GB VRAM with full context)

With my quad 3090 rig, I can run:

- GPT-OSS-120B
- Qwen 3 Coder
- GLM 4.5 Air
- Smaller image models
- Control my 3D printer
- Build my own recommendation algorithm

## The Models I Trust

### S Tier Models (Local)

**GLM-4.5V**: This is my daily driver for vision tasks. I use it for screenshot analysis, document browsing, and identifying UI elements. The model excels at understanding visual context and can follow instructions like explain what you see or extract the button text from this screenshot.

**GLM-4.5-Air**: This is the golden standard for coding at home. I run it locally in AWQ-4bit quantization across 4 GPUs using vLLM. The performance feels identical to Claude on code generation tasks. I use it daily for React components, TypeScript configuration, backend logic, and debugging. The real advantage is context - I can load entire codebases into context and ask complex questions about the architecture. It also understands MCP tools and can invoke them.

**MiniMax-M2.1**: This is the best agentic model I have found for local inference. It has distinct interleaved thinking capabilities similar to Claude's style. When given a complex task, it breaks down the problem into steps, solves sub-problems, and then synthesizes the answer. It's incredible for multi-step coding workflows where the model needs to call multiple APIs, read files, modify code, and verify changes. My experience with MiniMax was so positive that I now run it exclusively for more complex workflows.

### A Tier

- **Hermes-70B**: The only model that tells you anything you want without any priming or jailbreaking. Freedom and knowledge above all else.
- **Qwen-next-80B**: For most tasks
- **GPT-OSS-120B**: For STEM work

### B Tier

- **Gemma line**
- **llama line**

## Software & Scaffolding

I've tested three main options:

**vLLM** (recommended configuration):

```bash
vllm serve /mnt/llm_models/GLM-4.5-Air-AWQ-4bit \
  --tensor-parallel-size 4 \
  --pipeline-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 131072 \
  --gpu-memory-utilization 0.95 \
  --max-num-batched-tokens 4096 \
  --enable-chunked-prefill
```

This setup gave me consistent 35 TPS on quad 3090s. Key optimizations:

- Enable contiguous KV cache to reduce memory overhead
- Set appropriate block size for the specific model
- Tune GPU memory utilization based on available VRAM
- Enable chunked prefill for better batching of large contexts

**exLlamaV3**:

```bash
# Requires custom JSON config file for all settings
# Supports multiple quantization formats (GGUF, EXL3)
# Much faster in some benchmarks but significantly harder to configure
```

Pros:

- Outstanding performance on certain models
- Supports direct GGUF loading
- Great for running multiple quantization levels
- More flexible quantization schemes

Cons:

- Difficult setup process
- Complex configuration requirements
- Limited documentation for advanced features
- Fewer integration options with AI frameworks
- Not as battle-tested as vLLM

**llama.cpp**:

```bash
llm-ggml-vulkan \
  /models/glm-4.5-f16-q4.gguf \
  --contiguous \
  -b 512 \
  -ngl 99 \
  -sm V \
  --ctx-size 16384
```

Pros:

- Simple installation and setup
- Cross-platform compatibility
- Good starting point for experimentation
- Supports extremely large models with creative memory management

Cons:

- Performance degrades rapidly with increasing context
- Sequential inference limits throughput
- Requires manual tuning for optimal performance
- 30-50% slower than vLLM on similar hardware

**UI Flexibility**:
The big question was which frontend to pair with vLLM. I tested several options:

**LM Studio**: The interface is beautiful with visual model selection and parameter tuning. However, it only supports llama.cpp under the hood, so you're not getting the full vLLM performance. Nice for casual experimentation, not for production workloads.

**3 Sparks**: Apple-specific application with good Mac integration. Supports multiple models but the UI clutters 起 for power users. Not my preference for frequent use.

**JanAI**: Decent feature set but lacks the polish of commercial alternatives. Performance is sufficient but not impressive.

**Custom Integration**: I ultimately built my own frontend using FastAPI and WebSocket connections directly to vLLM's OpenAI-compatible server. This gives me full control over the interface and ensures I'm running at 100% performance. If you have coding skills, this approach is worth the investment.

**UI Options:**

- **LM Studio**: Great UX but locked into llama.cpp
- **3 Sparks**: Apple app supporting local LLMs
- **JanAI**: Fine but lacks many features

## Why I Switched

In six months I analyzed $10,000+ worth of AI credits:

| Platform                | Inference Value | Cost       | Value Ratio |
| ----------------------- | --------------- | ---------- | ----------- |
| Cursor                  | $2,400          | $542       | 4.4x        |
| Claude                  | $3,750          | $720       | 5.2x        |
| **Subscriptions Total** | **~$10,000**    | **$1,950** | **5.1x**    |

This doesn't include on-premise inference costs. With my homelab, I own everything. No per-token costs. No rate limits. No corporate control.

## Practical Use Cases

### Private Home RAG

This is my most valuable use case by far. I call this "AI-First Personal Knowledge Management." I've built a RAG system that indexes everything I care about - financial records from multiple banks, legal documents, scanned contracts, photos of physical documents, my writing, personal messages, and important emails.

The system uses MiniMax-M2.1 for the query engine. I've vectorized millions of documents across multiple datasets. When I need to find something, I can ask natural language questions and the system retrieves relevant passages including source documents. I can not only find information but also have the AI analyze it, summarize, generate insights, and create structured reports.

For example, I recently asked: "Show me all expenses from last month that were unusual." The system found specific transactions, explained the context, and suggested budget optimizations. This would be impossible with traditional search without weeks of manual processing.

**Technical Details:**

- Database: PostgreSQL with pgvector extension
- Embedding model: BGE-M3 (dense + sparse + multi-vector)
- Indexing: HNSW index for fast retrieval
- Refresh rate: Every 4 hours for active data
- Storage: 1.2TB of indexed documents

### Codebase Analysis and Automation

I use GLM-4.5-Air to analyze and refactor entire codebases. I can upload multi-million line projects and ask complex architectural questions. The model understands code structure, file relationships, and project organization. It can generate comprehensive documentation, identify code smells, suggest refactoring approaches, and even implement changes with proper testing.

I've built an AI pair programming system that:

- Reads the entire codebase into context
- Understands existing patterns and conventions
- Suggests incremental refactoring changes
- Generates corresponding tests
- Verifies changes don't break functionality

**Technical Implementation:**

- Sliding window context of 100k tokens
- Hierarchical indexing for efficient retrieval
- Structured prompts that include context preamble
- Tool integration for running tests and validations

### Real-World Case Study

I recently helped a friend optimize their personal finances using local models. We integrated multiple bank accounts, investment portfolios, and expense tracking. The AI analyzed spending patterns, identified optimization opportunities, and generated personalized savings recommendations. The entire process took about 20 minutes versus weeks of manual analysis.

### Multi-Agent Workflows

I use Roocode Orchestrator to create sophisticated multi-agent systems:

- An orchestrator model coordinates task breakdown
- Specialized agent models handle specific domains (coding, security, research)
- Subagents access different tools and data sources
- The entire system acts autonomously within defined parameters

**Example workflow:**

1. Orchestrator breaks down the task into sub-problems
2. Coding agent writes code using GLM-4.5-Air
3. Security agent reviews the code using a smaller specialized model
4. Research agent gathers background information from documents
5. Recommendations are synthesized by the orchestrator

Each workflow stays within cost-free boundaries while delivering enterprise-grade capabilities.

## The Future

Looking at the landscape, I see several clear directions for expansion. My ultimate goal is to maximize the operational freedom and performance of my homelab.

### DeepSeek-v3.2 Plans

DeepSeek-v3.2 has impressive architecture and I'm preparing to make it the next centerpiece of my rig. Here's my technical plan:

**Target Configuration:**

- Run on 8 GPUs with tensor parallelism
- AWQ 4-bit quantization for maximum throughput
- 120GB+ VRAM capacity
- 4K-16K TPS prefill, 60-80 TPS generation (projected)

**Optimization Strategy:**

- Use SGLang for serving (better for varied model architectures)
- Implement speculative decoding with a faster draft model
- Deduplication techniques to reduce redundant computations
- Model parallelism across multiple GPUs for efficient load distribution

**Expected Value:**
This model should replace several commercial APIs for specific use cases. The 120 parameter model with strong reasoning capabilities makes it an excellent choice for complex workflows. My estimation is that this single upgrade will replace at least $500 in API costs per month.

### Infrastructure Evolution

**Next Phase:**

1. Complete DeepSeek integration and optimization
2. Add support for more quantization schemes (GPTQ, AWQ variants)
3. Implement model auto-scaling based on workload
4. Build monitoring dashboards for performance metrics

**Long-Term Vision:**
I'm planning to expand to 12 GPUs for even larger models. AWQ 4-bit models in this range should support 150-200 parameter open weights. This would put me in the territory where I no longer need to choose between performance and capabilities. The diminishing returns from additional GPUs will be minimal compared to the value of having access to state-of-the-art models.

### Research and Development

I'm building an internal AI research pipeline that:

- REAPs new open models before they're released publicly
- Quantizes them for local deployment
- Benchmarks them across different scenarios
- Publishes results to help the community

This pipeline already powers my model recommendations and technical blog posts. I'm extending it to include more rigorous evaluation frameworks and custom benchmarks that reflect real-world workflows rather than synthetic tasks.

### Community Contribution

I plan to release multiple pieces of infrastructure:

- A quantization pipeline for common models
- Configuration templates for vLLM serving
- Documentation for building production local models
- Open-source components of my custom frontend

The entire open source ecosystem that made homelab access possible owes nothing to corporate goodwill. It exists because of dedicated individuals building, sharing, and improving. I want to contribute to that ecosystem 的力量.

### Measurement and Continuous Improvement

I've started tracking comprehensive metrics about my setup:

- Cost per token across all models
- Performance benchmarks with different configurations
- Model quality comparisons on standardized tests
- Uptime and reliability statistics

This data-informed approach helps me make better decisions about hardware upgrades, model selection, and configuration changes. The numbers tell a clearer story than subjective impressions.

The next twelve months will likely involve significant expansion. The cost of not owning my own AI infrastructure keeps growing daily. Frictionless, unlimited access to frontier models at home is becoming indispensable for my work and personal projects.

## Key Takeaways

1. **Research saves money and frustration**: 2 months of research prevented 我 from buying MagSafe-only setups or underpowered machines

2. **Standard cases don't work with large GPUs**: Use custom racks or crypto-mining server chassis

3. **Power is your limiting factor**: 1,200W is the practical ceiling. Measure everything before buying

4. **Speed matters**: llama.cpp initial speeds might feel good but context degradation destroys quality

5. **vLLM is the path**: Complex setup vs blazing fast performance. Worth every hour

6. **Your data stays yours**: This is freedom. Not perfect, but yours.

7. **Don't settle for corporate AI**: If you use AI daily, build your own infrastructure. It pays off quickly.

The future is fast, efficient, local. And I'm building it.

---

_This post was compiled from tweets and research spanning August-December 2025._
