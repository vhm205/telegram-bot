import "dotenv/config.js";
import got from 'got';
import { getTextFromInput, fToC } from '../utils/helpers.js';

const { ACCUWEATHER_API_KEY } = process.env;

const requestWeatherApi = async (cityKey) => {
  try {
		const response = await got
			.get(
				`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?language=vi&apikey=${ACCUWEATHER_API_KEY}`
			)
			.json();

		return response;
	} catch (error) {
		console.error(error);
	}
};

export default function getWeather(bot) {
	bot.command('wea', async (ctx) => {
		const chatId = ctx.chat.id;
    const message = ctx.update.message;
    const text = getTextFromInput(message.text);
    let cityKey = '';

    switch (text) {
      case 'bienhoa':
      case 'bh':
        cityKey = 353021;
        break;
      case 'hochiminh':
      case 'saigon':
      case 'hcm':
        cityKey = 353981;
        break;
      case 'hanoi':
      case 'hn':
        cityKey = 353412;
        break;
      case 'los':
        cityKey = 347625;
        break;
      case 'cali':
        cityKey = 93505;
        break;
      case 'fran':
      case 'san':
        cityKey = 94103;
        break;
      default:
        cityKey = 353021;
        break;
    }

		const { Headline, DailyForecasts } = await requestWeatherApi(cityKey);
		bot.telegram.sendMessage(chatId, Headline.Text);
		bot.telegram.sendMessage(chatId, Headline.Link);

		const opts = {
			parseMode: 'MarkdownV2',
		};

		for (const forecast of DailyForecasts) {
			const date = new Date(forecast.Date).toLocaleDateString();
			const weekday = getWeekDay(forecast.Date);
			const minTemp = fToC(forecast.Temperature.Minimum.Value);
			const maxTemp = fToC(forecast.Temperature.Maximum.Value);

      // &#176;
			await bot.telegram.sendMessage(chatId, `Dự báo thời tiết ngày: ${date} - ${weekday}`);
			await bot.telegram.sendMessage(
				chatId,
				`Nhiệt độ thấp nhất: ${minTemp} C`,
        opts
			);
			await bot.telegram.sendMessage(
				chatId,
				`Nhiệt độ cao nhất: ${maxTemp} C`,
				opts
			);
			await bot.telegram.sendMessage(
				chatId,
				`Buổi sáng: ${forecast.Day.IconPhrase}`,
			);
			await bot.telegram.sendMessage(
				chatId,
				`Buổi tối: ${forecast.Night.IconPhrase}`,
			);
			await bot.telegram.sendMessage(chatId, `Link: ${forecast.Link}`);
			await bot.telegram.sendMessage(chatId, '---------');
		}
	});
}

const getWeekDay = (date) => {
	const d = new Date(date);
	const days = [
		'Chủ nhật',
		'Thứ Hai',
		'Thứ Ba',
		'Thứ Tư',
		'Thứ Năm',
		'Thứ Sáu',
		'Thứ Bảy',
	];
	return days[d.getDay()];
};
