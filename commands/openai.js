import { Configuration, OpenAIApi } from 'openai';
import { getTextFromInput } from '../utils/helpers.js';

const { OPENAI_SECRET_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY,
})

const openai = new OpenAIApi(configuration);

const requestOpenAI = async (prompt, model = 'text-davinci-003') => {
	try {
		const { data } = await openai.createCompletion({
			model,
      // messages: [{ role: 'user', content: 'Say this is a test' }],
			prompt,
			max_tokens: 2048,
			temperature: 0.9,
		});
    const textResponse = data.choices.length ? data.choices[0].text : '';
		return textResponse;
	} catch (error) {
		console.error(error);
	}
};

export default function askOpenAI(bot) {
	bot.command('ask', async (ctx) => {
		const chatId = ctx.chat.id;
    const message = ctx.update.message;
    const text = getTextFromInput(message.text);

		const textResponse = await requestOpenAI(text, 'gpt-3.5-turbo');
		bot.telegram.sendMessage(chatId, textResponse);
	});
}
