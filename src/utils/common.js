function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}


export {getRandomArrayElement, capitalize, updateItem};
