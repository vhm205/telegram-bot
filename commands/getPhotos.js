import "dotenv/config.js";
import Pexels from 'pexels';
import { getTextFromInput } from '../utils/helpers.js';

async function getPhotosSource(query, limit = 10) {
	try {
		const client = Pexels.createClient(process.env.PEXELS_API_KEY);
		let sources;

		await client.photos.search({ query, per_page: limit }).then((res) => {
			const images = res.photos;
			sources = images.map((img) => img.src.original);
		});

		return sources;
	} catch (error) {
		console.log('error downloading image', error);
		getPhotosSource(query);
	}
}

export default function getPhotosByTopic(bot) {
  bot.command('photo', async (ctx) => {
		const chatId = ctx.chat.id;
    const message = ctx.update.message;
    const text = getTextFromInput(message.text);

		const sources = await getPhotosSource(text);
    sources.map((src) => bot.telegram.sendPhoto(chatId, src));
	});
}
