export const getTextFromInput = message => {
  const params = message.split(' ');
  params.shift();
  const text = params.join(' ');
  return text;
}

export const fToC = f => {
  return Math.round((f - 32) * 5 / 9);
}

export const isIterable = (input) => {
  if (input === null || input === undefined) {
    return false
  }

  return typeof input[Symbol.iterator] === 'function'
}

export const escapeStr = (input) => {
  return input.replace(/[\\$'"]/g, "\\$&");
}

export const handleOptionsInCommand = (input) => {
	const params = input.split(' ');
	params.shift();

	const opts = new Map();
	params.map((opt) => {
		if (opt.includes('=')) {
			const [key, value] = opt.split('=');
			opts.set(key, value);
		}
	});
	return opts;
};

export const handleFlagInCommand = (input, prefix = process.env.FLAG_PREFIX) => {
	const params = input.split(' ');
	params.shift();

	const opts = new Map();
	params.map((opt) => {
		if (opt.includes(prefix)) {
			const [key, value] = opt.split('=');
			opts.set(key, value);
		}
	});
	return opts;
};

export const getWeekDay = (date) => {
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
