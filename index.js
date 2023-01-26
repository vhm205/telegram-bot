import "dotenv/config.js";
import TelegramBotApi from 'node-telegram-bot-api';
import { getPhotosByTopic, askOpenAI, sleepCalculator } from './commands/index.js';

const bot = new TelegramBotApi(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const listenEvent = () => {
	sleepCalculator(bot);
	askOpenAI(bot);
	getPhotosByTopic(bot);

	// bot.on('message', async msg => {
	// 	const chatId = msg.chat.id;
	// const text = msg.text;
	// 	bot.sendMessage(chatId, text);
	// });

	bot.on('polling_error', (error) => {
		console.log(error.code); // => 'EFATAL'
	});

	bot.on('webhook_error', (error) => {
		console.log(error.code); // => 'EPARSE'
	});

	console.log('Bot listening...');
};

listenEvent();

