export const logPageView = (url: string) => {
  // Implementation for your analytics platform
  // Example with Google Analytics
  (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_path: url,
  })
}

export const logEvent = (action: string, category: string, label: string) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  })
}

