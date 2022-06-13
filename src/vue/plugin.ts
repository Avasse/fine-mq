import { reactive, readonly } from 'vue'

import { createFineMediaQueries, getAliasesForMediaQuery } from '../lib/fine-mq'
import { MatchingAliases, MediaQueryAliases, MediaQueryMatcherHandler } from '../lib/types'

export const VueMqPlugin = {
  install(app: any, options: { aliases?: MediaQueryAliases; defaultMatchingAliases?: MatchingAliases } = {}) {
    // let hasSetupListeners = false
    const defaultLastActiveAlias = Object.keys(options.defaultMatchingAliases ?? {})[0]

    try {
      const reactiveSource = reactive({
        aliases: {},
        lastActiveAlias: defaultLastActiveAlias,
      })

      const vueMq = createFineMediaQueries(
        options.aliases || { sm: 680, md: [681, 1024], lg: [1025] },
        options.defaultMatchingAliases
      )

      const onMqMatchEvent: MediaQueryMatcherHandler = ({ matches, alias, mediaQuery }) => {
        const aliases = getAliasesForMediaQuery(vueMq.mq, mediaQuery)
        const matchingAliases: MatchingAliases = {}
        for (const _alias of aliases) {
          matchingAliases[_alias] = matches
        }
        reactiveSource.aliases = { ...reactiveSource.aliases, ...matchingAliases }
        if (matches) reactiveSource.lastActiveAlias = alias
      }

      app.config.globalProperties.$mq = readonly(reactiveSource)
      app.provide("mq", readonly(reactiveSource))
      app.provide("vueMq", readonly(vueMq))

      Object.keys(vueMq.mq.aliases).forEach((alias) => vueMq.on(alias, onMqMatchEvent))
    } catch (error) {
      console.error(error)
    }
  }
}
