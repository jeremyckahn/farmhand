/** @typedef {typeof import('./Farmhand').default.defaultProps} farmhand.props */
/** @typedef {import('./Farmhand').farmhand.state} farmhand.state */
import { Component } from 'react'

import * as reducers from '../../game-logic/reducers'

/**
 * @callback BoundReducer
 * @param {...any} rest
 * @returns {farmhand.state}
 */

/**
 * This class serves as a sort of middleware for the main Farmhand component.
 * It defines stub methods with names that correspond to various reducer
 * functions. At the time of instantiation, it implements the methods with the
 * matching reducer function and binds it to the class instance.
 *
 * This is done in the interest of coding convenience and decentralization of
 * core game logic. It is implemented as a class so that the methods can be
 * statically analyzed by the TypeScript compiler.
 */
export class FarmhandReducers extends Component {
  /** @type BoundReducer */
  addCowToInventory() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  addPeer() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  adjustLoan() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  changeCowAutomaticHugState() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  changeCowBreedingPenResident() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  changeCowName() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  clearPlot() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  computeStateForNextDay() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  fertilizePlot() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  forRange() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  harvestPlot() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  hugCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  makeRecipe() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  makeFermentationRecipe() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  modifyCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  offerCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  plantInPlot() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  prependPendingPeerMessage() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseCombine() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseComposter() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseCowPen() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseCellar() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseField() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseForest() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseItem() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseSmelter() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  purchaseStorageExpansion() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  removeCowFromInventory() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  removeKegFromCellar() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  removePeer() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  selectCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  sellCow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  sellItem() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  sellKeg() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  setScarecrow() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  setSprinkler() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  showNotification() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  updatePeer() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  upgradeTool() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  waterAllPlots() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  waterField() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  waterPlot() {
    throw new Error('Unimplemented')
  }
  /** @type BoundReducer */
  withdrawCow() {
    throw new Error('Unimplemented')
  }

  /**
   * @param {farmhand.props} props
   */
  constructor(props) {
    super(props)

    const reducerNames = Object.getOwnPropertyNames(
      FarmhandReducers.prototype
    ).filter(key => key !== 'constructor')

    for (const reducerName of reducerNames) {
      const reducer = reducers[reducerName]

      if (
        process.env.NODE_ENV === 'development' &&
        typeof reducer === 'undefined'
      ) {
        throw new Error(
          `Reducer ${reducerName} is not exported from reducers/index.js`
        )
      }

      // Bind the reducer to this class instance
      this[reducerName] = (/** @type any[] */ ...args) => {
        this.setState((/** @type {farmhand.state} */ state) =>
          reducer(state, ...args)
        )
      }
    }
  }
}
