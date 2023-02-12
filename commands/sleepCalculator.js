function getListTime(SCBedTime, type = 'wakeup') {
	let timeList = [];
	for (var i = 0; i < 6; i++) {
    let curItem;
		if (type == 'bedtime' || type == 'b') {
			curItem = formatTime(SCBedTime, (6 - i) * -1.5 - 0.25);
		} else {
			curItem = formatTime(getTime(), (6 - i) * 1.5 + 0.25);
		}
		timeList.push(curItem);
	}
  return timeList;
}

function formatTime(time, addHours) {
	var allMinutes = time.hours * 60 + time.minutes,
		str = '',
		hours = 0,
		minutes = 0,
		meridiem = time.meridiem;
	allMinutes += addHours ? addHours * 60 : 0;
	if (allMinutes < 0) {
		allMinutes = 720 + allMinutes;
		meridiem = meridiem == 'AM' ? 'PM' : 'AM';
	} else if (allMinutes > 720) {
		allMinutes -= 720;
		meridiem = meridiem == 'AM' ? 'PM' : 'AM';
	}
	hours = parseInt(allMinutes / 60);
	hours = !hours ? 12 : hours;
	minutes = allMinutes % 60;
	minutes = minutes >= 10 ? minutes : '0' + minutes;
	str = hours + ':' + minutes + ' ' + meridiem;
	return str;
}

function getTime() {
	var time = new Date(),
		hours = time.getHours(),
		minutes = time.getMinutes(),
		meridiem = 'AM';
	if (hours > 11) {
		hours -= 12;
		meridiem = 'PM';
	}
	return {
		hours: hours,
		minutes: minutes,
		meridiem: meridiem,
	};
}

export default function sleepCalculator(bot) {
	bot.command('sleep', (ctx) => {
		const chatId = ctx.chat.id;
		const params = ctx.message.text;
		const [t = 'wakeup', h = 0, m = 0, mer = 'AM'] = params?.split?.(' ') ?? [];
		console.log({ params });

		const SCBedTime = {
			hours: +h,
			minutes: +m,
			meridiem: mer,
		};
		const timeList = getListTime(SCBedTime, t);

		SCBedTime.hours =
			SCBedTime.hours < 10 ? `0${SCBedTime.hours}` : SCBedTime.hours;
		SCBedTime.minutes =
			SCBedTime.minutes < 10 ? `0${SCBedTime.minutes}` : SCBedTime.minutes;

		let textResponse = `The average human takes 15 minutes to fall asleep.\n`;
		let timeResponse = `---------\n`;

		if (t === 'bedtime' || t === 'b') {
			textResponse += `To wake up refreshed at ${SCBedTime.hours}:${SCBedTime.minutes} ${SCBedTime.meridiem}, you need go to sleep at one of the following times:\n`;
		} else {
			textResponse += `If you go to sleep right now, you should try to wake up at one of the following times:\n`;
		}

		timeList.map((time) => {
			timeResponse += `${time}\n`;
		});

		bot.telegram.sendMessage(chatId, `${textResponse}${timeResponse}`);
	});
}
