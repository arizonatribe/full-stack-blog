import puppeteer from "puppeteer"
import { createAnonymousUserSession } from "../utils"

let browser: puppeteer.Browser
let page: puppeteer.Page

const homeUrl = "http://localhost:3000"

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  })

  page = await browser.newPage()
})

test("Check the text of the page header", async () => {
  await page.goto(homeUrl)
  const text = await page.$eval("a.brand-logo", el => el.innerHTML)

  expect(text).toEqual("Blogster")
})

test("Starts OAuth flow on clicking 'Login'", async () => {
  await page.goto(homeUrl)
  await page.click("ul li a[href='/auth/google']")

  const currentUrl = page.url()

  expect(currentUrl).toMatch("https://accounts.google.com")
})

test("Can authenticate a test user", async () => {
  const { sig, session } = await createAnonymousUserSession()

  await page.goto(homeUrl)
  await page.setCookie({ name: "session", value: session })
  await page.setCookie({ name: "session.sig", value: sig })

  await page.goto(homeUrl)
  await page.waitForSelector("ul li a[href='/auth/logout']")

  const text = await page.$eval("ul li a[href='/auth/logout']", el => el.innerHTML)
  expect(text).toEqual("Logout")
})

afterEach(async () => {
  await browser.close()
})
