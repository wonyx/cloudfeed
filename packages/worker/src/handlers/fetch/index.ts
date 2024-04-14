import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'
import { Bindings } from './bindings'
import feeds from './feeds'

declare module 'hono' {
  interface ContextVariableMap {
    userId?: string
  }
}
export const app = new Hono<{ Bindings: Bindings }>().basePath('/api')
const mw = createMiddleware(async (c, next) => {
  try {
    let authToken = c.req.header('Authorization')
    authToken = authToken?.startsWith('Bearer ')
      ? authToken.slice(7)
      : authToken
    if (!authToken) {
      const message = 'No auth token provided'
      throw new Error(message)
    }
    const decodedPayload = await verify(authToken, c.env.CLOUD_FEED_JWT_SECRET)
    if (!decodedPayload.sub) {
      throw new Error('No sub in payload')
    }
    c.set('userId', decodedPayload.sub)
  } catch (e) {
    let message: string
    if (e instanceof Error) {
      message = `hono mw error: ${e.message}`
    } else {
      message = `hono mw unknown error`
    }
    throw new HTTPException(401, { message, cause: e })
  }
  await next()
})
app.onError((err, c) => {
  console.error(err.message, err.stack)
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  return c.newResponse('Internal server error', 500)
})
app.use(mw)
const routes = app.route('/feeds', feeds)
export type AppType = typeof routes
