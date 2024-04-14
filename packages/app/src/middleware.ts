export { auth as middleware } from '@/lib/auth'
export const config = {
  matcher: ['/my-feed', '/users/:path*'],
}
