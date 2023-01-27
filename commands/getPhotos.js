import "dotenv/config.js";
import Pexels from 'pexels';

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
	bot.onText(/\/photo (.+)/, async (msg, match) => {
		const chatId = msg.chat.id;
		const sources = await getPhotosSource(match[1]);

		sources.map((src) => bot.sendPhoto(chatId, src));
	});
}
