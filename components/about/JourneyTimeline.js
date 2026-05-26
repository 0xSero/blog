import { SlideUp } from '@/lib/transitions/SlideUp'

export default function JourneyTimeline({ items }) {
  return (
    <div className="relative mx-auto max-w-4xl border-y border-border-subtle">
      <div className="absolute bottom-10 left-4 top-10 w-px bg-border-subtle" aria-hidden="true" />
      {items.map((item, index) => (
        <SlideUp key={item.era} delay={index * 0.08}>
          <article className="grid grid-cols-[2rem_1fr] gap-6 border-b border-border-subtle py-8 last:border-b-0 md:gap-8 md:py-10">
            <div className="relative z-10 flex justify-center pt-1">
              <span className="h-3 w-3 rounded-full border-2 border-accent-subtle bg-surface-base shadow-[0_0_20px_rgba(196,168,130,0.16)]" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-sm uppercase tracking-[0.14em] text-text-muted">
                {item.era}
              </p>
              <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-text-primary md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-text-secondary md:text-lg md:leading-9">
                {item.description}
              </p>
              <p className="mt-5 font-mono text-sm leading-7 text-text-muted">{item.insight}</p>
            </div>
          </article>
        </SlideUp>
      ))}
    </div>
  )
}
