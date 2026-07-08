import { Page } from '@playwright/test'

/**
 * Intercepts requests matching urlPattern and fulfills them with an error
 * status, simulating a genuine server error response. This is distinct from
 * context.setOffline(true), which cuts off network access entirely rather
 * than returning an error from the server.
 */
export const simulateServerError = (
  page: Page,
  urlPattern: string,
  status = 500
) => page.route(urlPattern, route => route.fulfill({ status, body: '' }))
