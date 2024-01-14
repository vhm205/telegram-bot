import puppeteer from 'puppeteer';
import { escapeStr, isIterable } from '../../utils/helpers.js';

// we can block by resrouce type like fonts, images etc.
const blockResourceType = [
  'beacon',
  'csp_report',
  'font',
  'image',
  'imageset',
  'media',
  'object',
  'texttrack',
];
// we can also block by domains, like google-analytics etc.
const blockResourceName = [
  'adition',
  'adzerk',
  'analytics',
  'cdn.api.twitter',
  'clicksor',
  'clicktale',
  'doubleclick',
  'exelator',
  'facebook',
  'fontawesome',
  'google',
  'google-analytics',
  'googletagmanager',
  'mixpanel',
  'optimizely',
  'quantserve',
  'sharethrough',
  'tiqcdn',
  'zedo',
];

const getPosts = async (keyword, limit) => {
	try {
    let DAILY_DEV_URL = keyword ? `https://app.daily.dev/search?q=${keyword}` : 'https://app.daily.dev';

    switch (keyword) {
      case 'upvoted':
        DAILY_DEV_URL = 'https://app.daily.dev/upvoted';
        break;
      case 'popular':
        DAILY_DEV_URL = 'https://app.daily.dev/popular';
        break;
      default:
        break;
    }

		const browser = await puppeteer.launch({
			headless: true,
			timeout: 0,
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
		});
		const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', request => {
			const requestUrl = request.url();
			if (
				request.resourceType() in blockResourceType ||
				blockResourceName.some((resource) => requestUrl.includes(resource))
			) {
				request.abort();
			} else {
				request.continue();
			}
		});

		await page.goto(DAILY_DEV_URL, { waitUntil: 'networkidle2' });

		await page.waitForXPath(
			'//*[@id="__next"]/div[1]/main/main/div/div/div[1]',
			{ visible: true }
		);

		let data = await page.evaluate(() => {
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

    data.shift();
    data = data.filter(item => item.link && item.date);
    limit && (data.length = +limit);

    await browser.close();

    return data;
	} catch (error) {
		console.error(error);
    return [];
	}
};

export default function getDailyDev(bot) {
	bot.command('daily', async (ctx) => {
		const chatId = ctx.chat.id;
		const message = ctx.update.message;

    const params = message.text.split(' ');
    params.shift();

    let length = null;
    let text = params.join(' ');

    if(params[0]?.includes?.('-size')) {
      const [, size] = params[0].split('=');
      length = size;
      params.shift();
      text = params.join(' ');
    }

		try {
			const articles = await getPosts(text, length);

      if(!articles.length || !isIterable(articles)) {
				return await bot.telegram.sendMessage(chatId, "Can't get posts from daily.dev");
      }

			const opts = {
				parse_mode: 'HTML',
			};

			for (const article of articles) {
				await bot.telegram.sendMessage(
					chatId,
					`<b>${escapeStr(article.title)}</b>`,
					opts
				);
				await bot.telegram.sendMessage(
					chatId,
					`<i>${article.date} - ${article.readTime}</i>`,
					opts
				);
				await bot.telegram.sendMessage(chatId, article.link);
				await bot.telegram.sendMessage(
					chatId,
					'=================================================='
				);
			}
		} catch (error) {
			console.error(error);
		}
	});
}
