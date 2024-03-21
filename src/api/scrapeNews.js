import puppeteer from "puppeteer";

export async function fetchNewsFromNos(url, tag) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setCacheEnabled(false);

    const content = await page.$("#content");
    const ul = await content.$$(".sc-3121948f-0");
    const li = await ul[0].$$("li");
    const a = await li[0].$("a");

    const href = await page.evaluate((element) => element.href, a);
    const h2 = await a.$("h2");
    const text = await page.evaluate((element) => element.textContent, h2);

    const img = await li[0].$("img");
    const src = img 
        ? await page.evaluate((element) => element.src, img) 
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/NOS_logo.svg/1280px-NOS_logo.svg.png"; // Default Image

    await browser.close();

    return { text, src, href, tag };
}



