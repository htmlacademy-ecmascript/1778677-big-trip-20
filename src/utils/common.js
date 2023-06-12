function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export {getRandomArrayElement, capitalize};
