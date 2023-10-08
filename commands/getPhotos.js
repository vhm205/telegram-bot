import 'dotenv/config.js';
import Pexels from 'pexels';
import { getTextFromInput, handleFlagInCommand } from '../utils/helpers.js';

async function getPhotosSource(query = 'cat', limit = 10, retry = 3) {
  try {
		const client = Pexels.createClient(process.env.PEXELS_API_KEY);

		const result = await client.photos.search({ query, per_page: limit });

    if(!result.total_results || !result.photos.length) {
      return [];
    }

		const images = result.photos;
		const sources = images.map((img) => img.src.original);

		return sources;
	} catch (error) {
    if(retry === 0) {
      throw error;
    }

    getPhotosSource(query, limit, retry - 1);
	}
}

export default function getPhotosByTopic(bot) {
	const FLAG_PREFIX = '-';

	bot.command('photo', async (ctx) => {
		const chatId = ctx.chat.id;
		const message = ctx.update.message;
		try {
			let text = getTextFromInput(message.text);

			const flags = handleFlagInCommand(message.text, FLAG_PREFIX);
			if (flags.has(`${FLAG_PREFIX}help`)) {
				return bot.telegram.sendMessage(
					chatId,
					`
        🔖 Danh sách options:

        -limit=10 - số lượng ảnh
        -query=topic - tìm ảnh theo chủ đề
      `
				);
			}

			if (flags.size || !text) {
				text = 'cat';
			}

			const sources = await getPhotosSource(
				flags.get(`${FLAG_PREFIX}query`) || text,
				flags.get(`${FLAG_PREFIX}limit`)
			);
			const asyncSendMessages = sources.map((src) =>
				bot.telegram.sendPhoto(chatId, src)
			);
			await Promise.all(asyncSendMessages);
		} catch (error) {
			bot.telegram.sendMessage(chatId, error.message);
		}
	});
}
