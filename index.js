import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import TelegramBotApi from 'node-telegram-bot-api';
import { getRandomImage } from './generatePhotos.js';

dotenv.config();

const { OPENAI_SECRET_KEY, TELEGRAM_BOT_TOKEN } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY,
})

const openai = new OpenAIApi(configuration);

const bot = new TelegramBotApi(TELEGRAM_BOT_TOKEN, { polling: true });

const askOpenAI = async (prompt, model = 'text-davinci-003') => {
	try {
		const completion = await openai.createCompletion({
			model,
			prompt,
			max_tokens: 2048,
			temperature: 0.9,
		});
		const textResponse = completion.data.choices[0].text;
		return textResponse;
	} catch (error) {
		console.error(error);
	}
};

const listenEvent = () => {
	bot.onText(/\/ask (.+)/, async (msg, match) => {
		const chatId = msg.chat.id;
		const text = match[1]; // the captured "whatever"

		// send back the matched "whatever" to the chat
		const textResponse = await askOpenAI(text);
		bot.sendMessage(chatId, textResponse);
	});

	bot.onText(/\/photo (.+)/, async (msg, match) => {
		const chatId = msg.chat.id;
		const sources = await getRandomImage(match[1]);

		sources.map((src) => bot.sendPhoto(chatId, src));
	});

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

