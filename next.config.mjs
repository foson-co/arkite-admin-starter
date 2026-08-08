/** @type {import('next').NextConfig} */
export default {
  // The hosted live demo (starter.foson.co) is a static export on GitHub
  // Pages; the CI demo build removes app/api first. Normal dev/build keeps
  // the server and API routes.
  ...(process.env.NEXT_PUBLIC_STATIC_DEMO === '1' ? { output: 'export', trailingSlash: true } : {}),
}
