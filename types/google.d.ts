declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    gtag: (...args: any[]) => void;
  }
}

export { };


