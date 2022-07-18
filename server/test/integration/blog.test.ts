import puppeteer from "puppeteer"
import { createPage, EnhancedPage } from "../utils"

let browser: puppeteer.Browser
let page: EnhancedPage

const homeUrl = "http://localhost:3000"

describe("When not logged in", () => {
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false
    })

    page = await createPage(browser)
    await page.goto(homeUrl)
  })

  test("Cannot create a new blog post", async () => {
    const result = await page.evaluate(() => (
      fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "an unauthorized post",
          content: "She's over-bored and self-assured. Oh no another dirty word."
        })
      }).then(re => re.json())
    ))

    expect(result.error).toEqual("You must log in!")
  })

  test("Cannot view blogs", async () => {
    const result = await page.evaluate(() => (
      fetch("/api/blogs", {
        method: "get",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(re => re.json())
    ))

    expect(result.error).toEqual("You must log in!")
  })

})

describe("When logged in", () => {
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false
    })

    page = await createPage(browser)

    await page.login(homeUrl)
    await page.goto(homeUrl + "/blogs")
    await page.waitForSelector("a[href='/blogs/new']")
  })

  test("Can see a blog creation button from blogs route", async () => {
    const text = await page.$eval("a[href='/blogs/new']", el => el.innerHTML)
    expect(text).toMatch("add")
  })

  test("Navigated to a blog creation form after clicking button for new blog", async () => {
    await page.click("a[href='/blogs/new']")
    await page.waitForSelector("form")

    const pageUrl = page.url()
    expect(pageUrl).toMatch("/blogs/new")

    const blogTitleFieldExists = await page.$eval("form input[name=title]", () => true).catch(() => false)
    const blogContentFieldExists = await page.$eval("form input[name=content]", () => true).catch(() => false)

    expect(blogTitleFieldExists).toEqual(true)
    expect(blogContentFieldExists).toEqual(true)
  })

  describe("And using valid input", () => {
    const title = "my new post"
    const content = [
      "She eyes me like a Pisces when I am weak.",
      "I've been locked inside your heart-shaped box for weeks."
    ].join(" ")

    beforeEach(async () => {
      await page.click("a[href='/blogs/new']")
      await page.waitForSelector("form")
      await page.type("input[name=title]", title)
      await page.type("input[name=content]", content)
      await page.click("button[type=submit]")
    })

    test("Creating a blog takes user to a confirmation page", async () => {
      const text = await page.$eval("h5", el => el.innerHTML)
      expect(text).toEqual("Please confirm your entries")
    })

    test("Creating a blog and confirming, creates a new blog", async () => {
      await page.click("button.green")
      await page.waitForNavigation()

      const url = page.url()
      expect(url).toEqual(homeUrl + "/blogs")

      const newTitle = await page.$eval(".card .card-content .card-title", el => el.innerHTML)
      expect(newTitle).toEqual(title)

      const newContent = await page.$eval(".card .card-content p", el => el.innerHTML)
      expect(newContent).toEqual(content)
    })
  })

  describe("And using invalid input", () => {
    beforeEach(async () => {
      await page.click("a[href='/blogs/new']")
      await page.waitForSelector("form")
      await page.click("button[type=submit]")
    })

    test("The form shows error message(s)", async () => {
      const titleError = await page.$eval(".title .red-text", el => el.innerHTML)
      const contentError = await page.$eval(".content .red-text", el => el.innerHTML)

      expect(titleError).toEqual("You must provide a value")
      expect(contentError).toEqual("You must provide a value")
    })
  })
})

afterEach(async () => {
  await browser.close()
})
