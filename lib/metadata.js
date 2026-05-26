import siteMetadata from '@/data/siteMetadata'

export function absoluteUrl(path = '') {
  if (!path) return siteMetadata.siteUrl
  if (path.startsWith('http')) return path
  return `${siteMetadata.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function absoluteImages(images = []) {
  const imageList = images.length === 0 ? [siteMetadata.socialBanner] : images
  return imageList.map((image) => absoluteUrl(image))
}

export function createPageMetadata({
  title = siteMetadata.title,
  description = siteMetadata.description,
  path = '',
  images = [siteMetadata.socialBanner],
  absoluteTitle = false,
  rssPath,
}) {
  const resolvedTitle = absoluteTitle ? { absolute: title } : title
  const url = absoluteUrl(path)
  const resolvedImages = absoluteImages(images)

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: url,
      ...(rssPath
        ? {
            types: {
              'application/rss+xml': absoluteUrl(rssPath),
            },
          }
        : {}),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: resolvedImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImages,
    },
  }
}

export function createArticleMetadata({
  title,
  description,
  path,
  images = [],
  publishedTime,
  modifiedTime,
}) {
  const url = absoluteUrl(path)
  const resolvedImages = absoluteImages(images)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime,
      modifiedTime,
      images: resolvedImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImages,
    },
  }
}
