import chargingPileNetwork from './charging-pile-network.js'
import chargingPile from './charging-pile.js'
import chargingPileGenre from './charging-pile-genre.js'

export default {
  ...chargingPileNetwork,
  ...chargingPile,
  ...chargingPileGenre
}
