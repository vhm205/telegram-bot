export const getTextFromInput = message => {
  const params = message.split(' ');
  params.shift();
  const text = params.join(' ');
  return text;
}
