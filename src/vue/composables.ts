import { inject } from 'vue'
import { FineMediaQueries, MatchingAliases, Mq } from '../lib/types'

export function useVueMq() {
  const vueMq = inject("vueMq")
  if (!vueMq) {
    throw new Error(
      "VueMq is not installed in this app. Please follow the installation instructions and try again."
    )
  } else return vueMq
}

export function useVueMqAliases() {
  const vueMq = inject("vueMq") as FineMediaQueries
  if (!vueMq) {
    throw new Error(
      "VueMq is not installed in this app. Please follow the installation instructions and try again."
    )
  } else {
    const mq = vueMq.mq as Mq
    return mq.matchingAliases as MatchingAliases
  }
}
