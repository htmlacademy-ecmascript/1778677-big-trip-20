const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const getByTypeOffers = (type, offers) => offers?.find((offer) => type === offer.type);

const getCheckedOffers = (type, pointOffers, offers) => {
  const offersByType = getByTypeOffers(type, offers);
  if (!offersByType || !offersByType.offers) {
    return;
  }
  const checkedOffers = offersByType.offers.filter((offer) =>
    pointOffers
      .some((offerId) => offerId === offer.id));
  return checkedOffers;
};

const getDestination = (id, destinations) => destinations.find((destination) => destination.id === id);

const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

const isPricesEqual = (priceA, priceB) => (priceA === null && priceB === null) || priceA === priceB;


export {capitalize, isEscapeKey, getCheckedOffers, getDestination, isPricesEqual};
