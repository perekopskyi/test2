import { createStore, applyMiddleware, Store, MiddlewareAPI } from 'redux'
import reducer from '../reducer'
import { useMemo } from 'react'
import api from '../middlewares/api'

const initialState = {}

const enhancer = applyMiddleware(api)

let store: Store

function initStore(preloadedState = initialState) {
  return createStore(reducer, preloadedState, enhancer)
}

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
