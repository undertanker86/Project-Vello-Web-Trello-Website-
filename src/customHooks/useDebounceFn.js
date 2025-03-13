
import { useCallback } from 'react'
import { debounce } from 'lodash'
/**
 * 
Custom a hook to use for debugging function, takes 2 parameters: function and time delay
 * 
 * https://trippingoncode.com/react-debounce-hook/
 * https://lodash.com/docs/4.17.15#debounce
 */
export const useDebounceFn = (fnToDebounce, delay = 500) => {
  // Always return an error if the delay received is not a number

  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }
  // Similarly, return an error if fnToDebounce is not a function.

  if (!fnToDebounce || (typeof fnToDebounce !== 'function')) {
    throw new Error('Debounce must have a function')
  }

  // Wrap the debounce implementation from lodash into useCallback to avoid multiple re-renders, but only re-render when fnToDebounce or delay changes (as the tutorial above shows)

  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}
