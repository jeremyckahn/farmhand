import React, { Component } from 'react'
import localforage from 'localforage'
import { match, History, Location } from 'react-router-dom'

import * as reducers from '../../game-logic/reducers/index.js'

interface Features {
  FOREST?: boolean
  [key: string]: boolean | undefined
}

export interface FarmhandProps {
  features?: Features
  localforage?: typeof localforage
  match?: match<{ room?: string }>
  history?: History
  location?: Location
}

export type FarmhandState = farmhand.state

/**
 * This class serves as a sort of (legacy) middleware for the main Farmhand
 * component. It defines stub methods with names that correspond to various
 * reducer functions. At the time of instantiation, it implements the methods
 * with the matching reducer function and binds it to the class instance.
 *
 * This is done in the interest of coding convenience and decentralization of
 * core game logic. It is implemented as a class so that the methods can be
 * statically analyzed by the TypeScript compiler.
 *
 * TODO: Replace this with a TypeScript interface
 */
export class FarmhandReducers extends Component<FarmhandProps, FarmhandState> {
  /** @type BoundReducer */
  addCowToInventory(...args: any[]) {
    throw new Error('Unimplemented')
  }
  addPeer(...args: any[]) {
    throw new Error('Unimplemented')
  }
  adjustLoan(...args: any[]) {
    throw new Error('Unimplemented')
  }
  changeCowAutomaticHugState(...args: any[]) {
    throw new Error('Unimplemented')
  }
  changeCowBreedingPenResident(...args: any[]) {
    throw new Error('Unimplemented')
  }
  changeCowName(...args: any[]) {
    throw new Error('Unimplemented')
  }
  clearPlot(...args: any[]) {
    throw new Error('Unimplemented')
  }
  computeStateForNextDay(...args: any[]) {
    throw new Error('Unimplemented')
  }
  fertilizePlot(...args: any[]) {
    throw new Error('Unimplemented')
  }
  forRange(...args: any[]) {
    throw new Error('Unimplemented')
  }
  harvestPlot(...args: any[]) {
    throw new Error('Unimplemented')
  }
  hugCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  makeRecipe(...args: any[]) {
    throw new Error('Unimplemented')
  }
  makeFermentationRecipe(...args: any[]) {
    throw new Error('Unimplemented')
  }
  makeWine(...args: any[]) {
    throw new Error('Unimplemented')
  }
  modifyCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  offerCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  plantInPlot(...args: any[]) {
    throw new Error('Unimplemented')
  }
  prependPendingPeerMessage(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseCombine(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseComposter(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseCowPen(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseCellar(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseField(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseForest(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseItem(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseSmelter(...args: any[]) {
    throw new Error('Unimplemented')
  }
  purchaseStorageExpansion(...args: any[]) {
    throw new Error('Unimplemented')
  }
  removeCowFromInventory(...args: any[]) {
    throw new Error('Unimplemented')
  }
  removeKegFromCellar(...args: any[]) {
    throw new Error('Unimplemented')
  }
  removePeer(...args: any[]) {
    throw new Error('Unimplemented')
  }
  selectCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  sellCow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  sellItem(...args: any[]) {
    throw new Error('Unimplemented')
  }
  sellKeg(...args: any[]) {
    throw new Error('Unimplemented')
  }
  setScarecrow(...args: any[]) {
    throw new Error('Unimplemented')
  }
  setSprinkler(...args: any[]) {
    throw new Error('Unimplemented')
  }
  showNotification(...args: any[]) {
    throw new Error('Unimplemented')
  }
  updatePeer(...args: any[]) {
    throw new Error('Unimplemented')
  }
  upgradeTool(...args: any[]) {
    throw new Error('Unimplemented')
  }
  waterAllPlots(...args: any[]) {
    throw new Error('Unimplemented')
  }
  waterField(...args: any[]) {
    throw new Error('Unimplemented')
  }
  waterPlot(...args: any[]) {
    throw new Error('Unimplemented')
  }
  withdrawCow(...args: any[]) {
    throw new Error('Unimplemented')
  }


  constructor(props) {
    super(props)

    const reducerNames = Object.getOwnPropertyNames(
      FarmhandReducers.prototype
    ).filter(key => key !== 'constructor')

    for (const reducerName of reducerNames) {
      const reducer = reducers[reducerName]

      if (
        import.meta.env?.MODE === 'development' &&
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
