/* eslint-disable no-console */
const puppeteer = require("puppeteer")

async function checkPuppeteer() {
  try {
    const browser = await puppeteer.launch({
      headless: false
    })

    console.log("navigating to page")
    const page = await browser.newPage()
    console.log("got a page")
    await page.goto("https://google.com/")
    console.log("got there")

    const agent = await browser.userAgent()
    console.log({ agent })

    await browser.close()
  } catch (err) {
    console.warn("failed")
    console.error(err)
    process.exit(1)
  }
}

checkPuppeteer()
