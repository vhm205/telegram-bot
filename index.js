import "dotenv/config.js";
import { Telegraf } from 'telegraf';
import { getPhotosByTopic, askOpenAI, sleepCalculator, getWeather, dailyDev } from './commands/index.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const listenEvent = () => {
	sleepCalculator(bot);
	askOpenAI(bot);
	getPhotosByTopic(bot);
  getWeather(bot);
  dailyDev(bot);

  bot.start((ctx) => ctx.reply("Welcome to VHM's bot"));
	bot.help((ctx) => ctx.reply('Send me a sticker'));

	bot.on('message', async (ctx) => {
		const message = ctx.update.message.text;
		if (message.match(/hello/)) {
			ctx.reply('Xin chào');
		} else {
			ctx.reply('Hong hiểu...');
		}
	});

	console.log('Bot listening...');
	bot.launch();
};

listenEvent();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
