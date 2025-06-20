import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* This script removes fdprocessedid attributes that cause hydration errors */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Run after the page loads
              window.addEventListener('load', function() {
                // Find all elements with fdprocessedid attribute and remove it
                document.querySelectorAll('[fdprocessedid]').forEach(function(element) {
                  element.removeAttribute('fdprocessedid');
                });
              });
            })();
          `
        }} />
      </body>
    </Html>
  );
}
