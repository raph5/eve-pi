
export function characterImg(characterId: number, size = 64) {
  return `https://images.evetech.net/characters/${characterId}/portrait?size=${size}`
}

export function itemImg(type: number, size = 32) {
  return `https://imageserver.eveonline.com/Type/${type}_${size}.png`
}