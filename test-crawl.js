import 'dotenv/config.js';
import { PuppeteerCrawler, utils, Dataset } from 'crawlee';
import puppeteer from 'puppeteer';
import fs from 'fs';

const links = [{ url: 'https://app.daily.dev' }];

const getPostsFromDailyDev = async () => {
	try {
		// https://app.daily.dev/search?q=blockchain
		const crawler = new PuppeteerCrawler({
      launchContext: {
        launchOptions: { headless: false }
      },
			requestHandler: async ({ page, request, log, browserController }) => {
        log.info(`Processing ${request.url}...`);

				await page.waitForNetworkIdle();
				await page.waitForXPath(
					'//*[@id="__next"]/div[1]/main/main/div/div/div[1]',
					{ visible: true }
				);
        log.info('Load done!!');

				const res = await page.evaluate(() => {
					const articlesNode = document.querySelectorAll(
						'#__next > div:nth-child(2) > main > main > div > div > div.grid > article'
					);
					return [...articlesNode].map((article) => {
						const title = article.querySelector('.typo-title3').textContent;
						const src = article.querySelector('a').href;
						const link = article.querySelector(
							'div.flex.flex-col.mx-4 > div > span > a'
						)?.href;
						const published = article.querySelector(
							'div.mb-8.relative.flex.flex-1.flex-col > div.flex.items-center.typo-footnote.mx-4 > time'
						);
						const readTime = article.querySelector(
							'div.mb-8.relative.flex.flex-1.flex-col > div.flex.items-center.typo-footnote.mx-4 > span'
						)?.textContent;
						return {
							title,
							src,
							link,
							readTime,
							date: published?.textContent,
							fulldate: published?.getAttribute?.('datetime'),
						};
					});
				});
				console.log({ res });
			},
		});

		await crawler.run(links);
	} catch (error) {
		console.error(error);
	}
};

getPostsFromDailyDev();



(async () => {
  return ;
	try {
		const URL = links[0].url;
    const browser = await puppeteer.launch({ headless: false, timeout: 1000000 });
		const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.waitForXPath('//*[@id="__next"]/div[1]/main/main/div/div/div[1]', { visible: true });
		// await page.waitForXPath(
		// 	'//*[@id="__next"]/div/main/main/div/header/div/div/button'
		// );
    // await page.waitForSelector('.flex.flex-col.mx-4 > div + .typo-title3');
		console.log('Load done');

    const title = await page.$eval('.flex.flex-col.mx-4 > div + .typo-title3', elem => elem.innerText);
    console.log({ title });

    // const res = await page.$$eval('#__next > div > main > main > div > div > div.grid.gap-12.grid-cols-2 > article', items => {
    //   const scrapedData = [];

    //   items.forEach(item => {
    //     const title = item.querySelector('.typo-title3').innerHTML;
    //     scrapedData.push(item.innerHTML);
    //   })
    //   return scrapedData;
    // })
    // console.log({ res });

		const res = await page.evaluate(() => {
			const articlesNode = document.querySelectorAll(
				'#__next > div:nth-child(2) > main > main > div > div > div.grid.gap-8.grid-cols-2 > article'
			);
			return [...articlesNode].map((article) => {
				const title = article.querySelector('.typo-title3').textContent;
				const src = article.querySelector('a').href;
				const link = article.querySelector(
					'div.flex.flex-col.mx-4 > div > span > a'
				)?.href;
				const published = article.querySelector(
					'div.mb-8.relative.flex.flex-1.flex-col > div.flex.items-center.typo-footnote.mx-4 > time'
				);
        const readTime = article.querySelector('div.mb-8.relative.flex.flex-1.flex-col > div.flex.items-center.typo-footnote.mx-4 > span')?.textContent;
				return {
					title,
					src,
					link,
          readTime,
					date: published?.textContent,
					fulldate: published?.getAttribute?.('datetime'),
				};
			});
		});
		console.log({ res });

		// await browser.close();
	} catch (error) {
		console.log('Catch : ' + error);
	}
})();
