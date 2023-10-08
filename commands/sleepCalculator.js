import { handleFlagInCommand, handleOptionsInCommand } from '../utils/helpers.js';

function calculateSleepTimes(wakeupTime, numCycles) {
	const sleepTimes = [];
	const cycleDuration = 90; // Duration of one sleep cycle in minutes

	for (let i = 0; i < numCycles; i++) {
		const sleepTime = new Date(
			wakeupTime.getTime() - cycleDuration * 60 * 1000 * (i + 1)
		);
		sleepTimes.push(sleepTime);
	}

	return sleepTimes;
}

export default function sleepCalculator(bot) {
  const FLAG_PREFIX = '-';

	bot.command('sleep', (ctx) => {
		const chatId = ctx.chat.id;
		const command = ctx.message.text;
		const commandOpts = handleOptionsInCommand(command);

    const flags = handleFlagInCommand(command, FLAG_PREFIX);
		if (flags.has(`${FLAG_PREFIX}help`)) {
			return bot.telegram.sendMessage(
				chatId,
				`
          🔖 Danh sách options:

          t=bedtime|wakeup - tính thời gian đi ngủ hoặc thời gian thức dậy
          c=5 - số lần chu kì giấc ngủ (cycles)
          h=9 - giờ bắt đầu (hours)
          m=9 - phút bắt đầu (minutes)
        `
			);
		}

    const type = commandOpts.get('t'); // Type of sleep (bedtime or wakeup)
    const numCycles = commandOpts.get('c') ?? 5; // Number of sleep cycles
		const wakeupTime = new Date(); // Desired wake-up time (Month is zero-based, so 9 represents October)
		wakeupTime.setHours(commandOpts.get('h') || wakeupTime.getHours());
		wakeupTime.setMinutes(commandOpts.get('m') || wakeupTime.getMinutes());

		const sleepTimes = calculateSleepTimes(wakeupTime, numCycles);

		let textResponse = `The average human takes 15 minutes to fall asleep.\n`;
		let timeResponse = `---------\n`;

		if (type === 'bedtime') {
			textResponse += `To wake up refreshed at ${SCBedTime.hours}:${SCBedTime.minutes} ${SCBedTime.meridiem}, you need go to sleep at one of the following times:\n`;
		} else {
			textResponse += `If you go to sleep right now, you should try to wake up at one of the following times:\n`;
		}

    sleepTimes.reverse();
		sleepTimes.forEach((sleepTime, index) => {
      timeResponse += `⏰ Sleep time ${index + 1}: ${sleepTime.toLocaleTimeString()}\n\n`;
		});

		bot.telegram.sendMessage(chatId, `${textResponse}${timeResponse}`);
	});
}
