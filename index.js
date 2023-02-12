import "dotenv/config.js";
import { Telegraf } from 'telegraf';
import { getPhotosByTopic, askOpenAI, sleepCalculator } from './commands/index.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const listenEvent = () => {
  // bot.command('start', ctx => {
  //   console.log({ ctx });
  //   console.log({ message: ctx.update.message })
  //   console.log({ options: ctx.telegram.options })
  //   bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
  //   })
  // })

  // bot.hears(/hi/gi, ctx => {
		// console.log({ ctx });
		// console.log({ message: ctx.update.message });
		// console.log({ options: ctx.telegram.options });
  // });

  // bot.on(/\/bed (.+)/, (ctx) => {
  //   console.log({ ctx });
		// console.log({ message: ctx.update.message });
		// console.log({ options: ctx.telegram.options });
  // })

	sleepCalculator(bot);
	askOpenAI(bot);
	getPhotosByTopic(bot);

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

