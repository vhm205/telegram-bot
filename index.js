import { Telegraf } from 'telegraf';
import {
	getPhotosByTopic,
	sleepCalculator,
	getWeather,
} from './commands/index.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const listenEvent = () => {
	sleepCalculator(bot);
	getWeather(bot);
	getPhotosByTopic(bot);

	bot.start((ctx) => ctx.reply("Welcome to VHM's bot"));
	bot.help((ctx) => {
		ctx.reply(`
      🔖 Danh sách lệnh:

      /sleep - Tính chu kỳ giấc ngủ
      /weather - Thời tiết theo vùng
      /photo - Ảnh theo chủ đề
    `);
	});

	bot.on('message', async (ctx) => {
		const message = ctx.update.message.text;
		if (message.match(/(hello|hi)/)) {
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
process.on('SIGINT', () => {
	bot.stop('SIGINT');
	process.exit(0);
});
process.on('SIGTERM', () => {
	bot.stop('SIGTERM');
	process.exit(0);
});
