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

