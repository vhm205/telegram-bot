import "dotenv/config.js";
import { Configuration, OpenAIApi } from 'openai';

const { OPENAI_SECRET_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY,
})

const openai = new OpenAIApi(configuration);

const requestOpenAI = async (prompt, model = 'text-davinci-003') => {
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

export default function askOpenAI(bot) {
	bot.onText(/\/ask (.+)/, async (msg, match) => {
		const chatId = msg.chat.id;
		const text = match[1]; // the captured "whatever"

		// send back the matched "whatever" to the chat
		const textResponse = await requestOpenAI(text);
		bot.sendMessage(chatId, textResponse);
	});
}
