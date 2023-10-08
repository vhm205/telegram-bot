import "dotenv/config.js";
import got from 'got';
import { fToC, handleFlagInCommand, getWeekDay } from '../utils/helpers.js';

const { ACCUWEATHER_API_KEY } = process.env;

const requestWeatherApi = async (cityKey, retry = 3) => {
  try {
		const response = await got
			.get(
				`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?language=vi&apikey=${ACCUWEATHER_API_KEY}`
			)
			.json();

		return response;
	} catch (error) {
    if(retry === 0) {
      throw new Error(error.message);
    }

    requestWeatherApi(cityKey, retry - 1);
	}
};

export default function getWeather(bot) {
	const FLAG_PREFIX = '-';

	bot.command('weather', async (ctx) => {
		const chatId = ctx.chat.id;
		const message = ctx.update.message;
		let cityKey = '';
		try {
			const flags = handleFlagInCommand(message.text, FLAG_PREFIX);
			if (flags.has(`${FLAG_PREFIX}help`)) {
				return bot.telegram.sendMessage(
					chatId,
					`
        🔖 Danh sách options:

        ${FLAG_PREFIX}full - Lấy chi tiết thời tiết những ngày tiếp theo
        ${FLAG_PREFIX}area=[area-name] - thời tiết theo vùng
          bh=bienhoa
          hcm=saigon
          hn=hanoi
          los=los-angeles
          cali=california
          fran=san-francisco
      `
				);
			}

			switch (flags.get(`${FLAG_PREFIX}area`)) {
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

			if (flags.has(`${FLAG_PREFIX}full`)) {
				for (const forecast of DailyForecasts) {
					const date = new Date(forecast.Date).toLocaleDateString();
					const weekday = getWeekDay(forecast.Date);
					const minTemp = fToC(forecast.Temperature.Minimum.Value);
					const maxTemp = fToC(forecast.Temperature.Maximum.Value);

					// &#176;
					await bot.telegram.sendMessage(
						chatId,
						`Dự báo thời tiết ngày: ${date} - ${weekday}`
					);
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
						`Buổi sáng: ${forecast.Day.IconPhrase}`
					);
					await bot.telegram.sendMessage(
						chatId,
						`Buổi tối: ${forecast.Night.IconPhrase}`
					);
					await bot.telegram.sendMessage(chatId, `Link: ${forecast.Link}`);
					await bot.telegram.sendMessage(chatId, '---------');
				}
				// End For
			}
			// End If
		} catch (error) {
			bot.telegram.sendMessage(chatId, error.message);
		}
	});
}
