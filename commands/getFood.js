import { getTextFromInput, handleFlagInCommand } from '../utils/helpers.js';

export default function getRandomFood(bot) {
	const FLAG_PREFIX = '-';

	bot.command('food', async (ctx) => {
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

    } catch (error) {
			bot.telegram.sendMessage(chatId, error.message);
    }
  })
}
