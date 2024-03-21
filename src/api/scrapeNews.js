import axios from 'axios';
import puppeteer from 'puppeteer';

export async function nationalNews() {
	const url = `https://nos.nl/nieuws/binnenland`;
    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
      
    const page = await browser.newPage();
    let href, src, text;
    let tag = 'Binnenland';
    await page.goto(url);
    await page.reload();

    const content = await page.$('#content');
    const ul = await content.$$('.sc-3121948f-0');
    const li = await ul[0].$$('li');
    const a = await li[0].$('a');
    href = await page.evaluate(element => element.href, a);
    const h2 = await a.$('h2');
    text = await page.evaluate(element => element.textContent, h2);
    const img = await li[0].$('img');
    if(img){
    src = await page.evaluate(element => element.src, img);
    }
    else {
        src = 'https://npokennis.nl/images/logo_npo_kennis.jpg';
    }


    await browser.close();

    return {text, src, href, tag};
}

export async function sportNews() {
        const url = `https://nos.nl/sport/laatste`;
        const browser = await puppeteer.launch({
            'args' : [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ]
          });        const page = await browser.newPage();
        let href, src, text;
        let tag = 'Sport';
        await page.goto(url);
        await page.reload();
    
        const content = await page.$('#content');
        const ul = await content.$$('.sc-3121948f-0');
        const li = await ul[0].$$('li');
        const a = await li[0].$('a');
        href = await page.evaluate(element => element.href, a);
        const h2 = await a.$('h2');
        text = await page.evaluate(element => element.textContent, h2);
        const img = await li[0].$('img');
        if(img){
        src = await page.evaluate(element => element.src, img);
        }
        else {
            src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/NOS_logo.svg/1280px-NOS_logo.svg.png';
        }
    
    
        await browser.close();
    
        return {text, src, href, tag};
    
    }
