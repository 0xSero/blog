// ============================================================================
// PATTERN: FLOWING CRACKS
// Branching crack-like patterns that pulse and flow
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  glow: 'hsla(40, 25%, 88%, 0.2)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
}

export const config = {
  key: 'cracks',
  name: 'Flowing Cracks',
  cycleMs: 7500,
  clearRadius: 0.22,
}

export class FlowingCracks {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.branches = []
    this.nodes = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const branchCount = 8
    const maxRadius = Math.min(cx, cy) - 30

    for (let b = 0; b < branchCount; b++) {
      const baseAngle = (b / branchCount) * Math.PI * 2
      const startDist = this.clearRadius * 1.1
      const endDist = maxRadius

      const segments = 7
      const branchPoints = []

      for (let s = 0; s < segments; s++) {
        const t = s / (segments - 1)
        const dist = startDist + (endDist - startDist) * t
        const angle = baseAngle + Math.sin(t * Math.PI * 2) * 0.15

        const x = cx + Math.cos(angle) * dist
        const y = cy + Math.sin(angle) * dist

        branchPoints.push({
          x,
          y,
          dist,
          baseAngle: angle,
          t,
          branchIndex: b,
          segmentIndex: s,
        })
      }

      const branch = {
        branchIndex: b,
        points: branchPoints,
        phase: b * 0.12,
        splitAngle: Math.sin(b * 1.5) * 0.4,
      }

      this.branches.push(branch)

      for (let s = 0; s < branchPoints.length - 1; s++) {
        this.nodes.push(branchPoints[s])
      }
    }

    for (let b = 0; b < branchCount; b++) {
      const branch = this.branches[b]
      const splitBranchCount = 2 + Math.floor(Math.abs(Math.sin(b * 0.8)) * 2)

      for (let s = 1; s < splitBranchCount + 1; s++) {
        if (s >= branch.points.length - 1) break

        const splitT = s / branch.points.length
        const splitPoint = branch.points[s]

        const splitAngle = splitPoint.baseAngle + branch.splitAngle * (s % 2 === 0 ? 1 : -1)
        const startDist = splitPoint.dist
        const endDist = startDist + Math.min(cx, cy) * 0.25

        const subSegments = 5
        const subPoints = []

        for (let ss = 0; ss < subSegments; ss++) {
          const st = ss / (subSegments - 1)
          const dist = startDist + (endDist - startDist) * st
          const angle = splitAngle + Math.sin(st * Math.PI) * 0.2

          const x = cx + Math.cos(angle) * dist
          const y = cy + Math.sin(angle) * dist

          subPoints.push({
            x,
            y,
            dist,
            baseAngle: angle,
            t: splitT + st * (1 - splitT) * 0.3,
            branchIndex: b,
            isSubBranch: true,
          })
        }

        const subBranch = {
          branchIndex: b,
          points: subPoints,
          phase: b * 0.12 + 0.06,
          parentBranch: branch,
        }

        this.branches.push(subBranch)

        for (let ss = 0; ss < subPoints.length - 1; ss++) {
          this.nodes.push(subPoints[ss])
        }
      }
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const wavePhase = t * Math.PI * 2 * 0.5

    this.branches.forEach((branch) => {
      const branchProgress = clamp((progress - branch.phase * 0.4) * 1.5, 0, 1)
      if (branchProgress < 0.01) return

      const points = branch.points
      if (points.length < 2) return

      const pulse = envelope((t + branch.phase * 0.5) % 1)

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]

        const segmentProgress = i / (points.length - 1)
        const segmentReveal = clamp((branchProgress - segmentProgress * 0.2) * 1.4, 0, 1)
        if (segmentReveal < 0.01) continue

        const wave1 = envelope((wavePhase - segmentProgress * 0.8) % 1)
        const wave2 = envelope((wavePhase * 0.6 + p1.dist * 0.01) % 1)

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)

        const segments = Math.max(
          3,
          Math.floor(Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / 15)
        )

        for (let s = 1; s <= segments; s++) {
          const segT = s / segments
          const x = p1.x + (p2.x - p1.x) * segT
          const y = p1.y + (p2.y - p1.y) * segT

          const perpX = -(p2.y - p1.y) / (p2.dist - p1.dist + 0.001)
          const perpY = (p2.x - p1.x) / (p2.dist - p1.dist + 0.001)

          const waveOffset = Math.sin(segT * Math.PI * 2 + wavePhase) * 4 * (0.5 + wave1 * 0.5)
          const drawX = x + perpX * waveOffset
          const drawY = y + perpY * waveOffset

          ctx.lineTo(drawX, drawY)
        }

        ctx.globalAlpha = alpha * 0.08 * segmentReveal
        ctx.strokeStyle = palette.glow
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.globalAlpha = alpha * (0.25 + wave2 * 0.15) * segmentReveal
        ctx.strokeStyle = palette.ink
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    })

    this.nodes.forEach((node) => {
      const nodeProgress = clamp((progress - node.t * 0.3) * 1.4, 0, 1)
      if (nodeProgress < 0.01) return

      const distFromCenter = Math.sqrt((node.x - this.centerX) ** 2 + (node.y - this.centerY) ** 2)
      if (distFromCenter < this.clearRadius * 0.85) return

      const pulse = envelope((t + node.t * 0.5) % 1)
      const size = 1.5 + pulse * 2
      const intensity = pulse

      ctx.globalAlpha = alpha * 0.15 * intensity * nodeProgress
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(node.x, node.y, size + 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = alpha * (0.4 + intensity * 0.3) * nodeProgress
      ctx.fillStyle = palette.ink
      ctx.beginPath()
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
      ctx.fill()

      if (intensity > 0.6) {
        ctx.globalAlpha = ((alpha * 0.4 * (intensity - 0.6)) / 0.4) * nodeProgress
        ctx.fillStyle = palette.highlightBright
        ctx.beginPath()
        ctx.arc(node.x - size * 0.2, node.y - size * 0.2, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.restore()
  }
}

export default FlowingCracks
