export const getTextFromInput = message => {
  const params = message.split(' ');
  params.shift();
  const text = params.join(' ');
  return text;
}

export const fToC = f => {
  return Math.round((f - 32) * 5 / 9);
}
