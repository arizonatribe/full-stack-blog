import { Browser, Page } from "puppeteer"
import { createAnonymousUserSession } from "./user"

export interface EnhancedPage extends Page {
  login(homeUrl: string): Promise<void>
}

export async function createPage(browser: Browser): Promise<EnhancedPage> {
  const page = await browser.newPage() as EnhancedPage

  async function login(homeUrl: string = "http://localhost:3000") {
    const { sig, session } = await createAnonymousUserSession()

    await page.goto(homeUrl)
    await page.setCookie({ name: "session", value: session })
    await page.setCookie({ name: "session.sig", value: sig })

    await page.goto(homeUrl)
    await page.waitForSelector("ul li a[href='/auth/logout']")
  }

  page.login = login

  return page
}

export class PageWithLogin {
  page: Page

  static async build(browser: Browser) {
    const page = await browser.newPage() as any
    const enhancedPage = new PageWithLogin(page)
    return new Proxy(enhancedPage, {
      get(target: any, property: string): any {
        return target[property] ?? page[property]
      }
    }) as EnhancedPage
  }

  constructor(page: Page) {
    this.page = page
  }

  async login(homeUrl: string = "http://localhost:3000") {
    const { sig, session } = await createAnonymousUserSession()

    await this.page.goto(homeUrl)
    await this.page.setCookie({ name: "session", value: session })
    await this.page.setCookie({ name: "session.sig", value: sig })

    await this.page.goto(homeUrl)
  }
}
