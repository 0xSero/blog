'use client'

import RouteError from '@/components/app/RouteError'

export default function Error({ error, reset }) {
  return <RouteError error={error} reset={reset} title="The article failed to load" />
}
