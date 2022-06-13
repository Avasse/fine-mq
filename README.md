# vue-mq

> A fine API to use media queries in JS with ease and with first-class integration with Vue.js version 3.

```sh
# Install using NPM :
npm i --save @smartapp/vue-mq
```

## Usage

### As a Vue plugin

Import plugin

```js
import { VueMqPlugin } from '@smartapp/vue-mq'


// Define your aliases as plugin options (defaults to `{ sm: 680, md: [681, 1024], lg: [1025] }` for Vue.js only, not the JS API)
app.use(VueMqPlugin, {
  aliases: {
    sm: 680, // <=> [0, 680], can also be a size in px, em or rem
    md: [681, 1024],
    lg: [1025], // <=> [1025, Infinity]
    landscape: '(orientation: landscape)',
    an_alias_name: {
      screen: true,
      minWidth: '23em',
      maxWidth: '768px'
    },
    print: { print: true }
  },
  // Define the default values for your matching aliases for SSR
  defaultMatchedMediaQueries: {
    sm: false,
    md: false,
    lg: true,
  }
})

// Two reactive properties will then be provided on Vue instances:
// - `$mq` is an object that contains the matching state for each alias in the form { [alias]: true/false }.
// - `$vueMq` is a VueMq instance for advanced usages.
```

Component Template

```html
<navbar v-if="$mq.aliases.desktop" />
<topbar v-else-if="$mq.aliases.tablet" />
<print v-else-if="$mq.aliases.print" />
```

Composition API 

```js
const mq = inject('mq')

// and/or

const vueMq = inject('vueMq')

// and/or 

import { usevueMq } from '@smartapp/vue-mq'

const vueMq = usevueMq()
```

### As plain JS

```js
import { createFineMediaQueries }  from '@smartapp/vue-mq'

const mq = createFineMediaQueries({
  // Fine Mq supports modifiers for sizes shortcuts  (see below for examples)
  sm: 680, // <=> [0, 680]
  md: [681, 1024],
  lg: [1025], // <=> [1025, Infinity]
  landscape: '(orientation: landscape)',
  custom1: 'only screen and (max-width: 480px)',
  custom2: 'only screen and (min-width: 480px) and (max-width: 720px)',
  an_alias_object: {
    screen: true,
    minWidth: '23em',
    maxWidth: '768px'
  }
})

// => This example will register the following aliases:
// {
//   sm: '(max-width: 680px)',
//   'sm+': '(min-width: 681px)',
//   md: '(min-width: 681px) and (max-width: 1024px)',
//   'md+': '(min-width: 1025px)',
//   'md!': '(min-width: 681px)',
//   lg: '(min-width: 1025px)',
//   landscape: '(orientation: landscape)',
//   an_alias_name: 'screen and (min-width: 380px) and (max-width: 768px)'
// }

// !: means «current and above»
// +: means «above»

const defaultColor = '#FFF'

const changeColor = color => ({ matches, mediaQuery, alias }) => {
  document.body.style.backgroundColor = matches ? color : defaultColor
}

mq.on('small', changeColor('blue'))
mq.on('medium', changeColor('green'))
mq.on({
  screen: true,
  maxWidth: '1200px'
}, changeColor('cyan'))
mq.on('only screen and (min-width: 720px)', changeColor('red'))
mq.off('only screen and (min-width: 720px)')
```

_**NOTE 1:**_ Absurd modifiers will not be created for  (ex: when the lower bound is _0_, there is no need for the «!» modifier, or if the upper bound is _Infinity_, there is no need for both «!» and «+» modifiers).

_**NOTE 2:**_ If you specify the unit for your size (`px`, `em`, `rem`), the `+ 1` operation will not be performed for modifiers.

See [FineMq](#finemq-api) for details about the API.

## FineMq API

### const mq = createFineMediaQueries(aliases, defaultMatchedMediaQueries)

Initialize helpers for your media query aliases. Other aliases can be registered afterwards.

`defaultMatchedMediaQueries` is for universal apps that need default values on SSR.

### mq.addAlias(alias[, query]) / mq.removeAlias(alias)

Register an `alias` for a `query`, or register multiple aliases at once by passing an object.

```js
mq.addAlias('small', '(max-width: 100px)')
mq.addAlias({
  small: '(max-width: 100px)',
  medium: {
    screen: true,
    maxWidth: 200
  },
})
```

Then you can unregister previously registered aliases with `mq.removeAlias(alias)`.

### mq.on(query, callback)

Register a `callback` which will be executed everytime the match state (true/false) for a query or alias changes.

```js
// `alias` is the given alias, mediaQuery is the actual media query matched and `matches` is a boolean indicating the match state.
mq.on('(max-width: 400px)', ({ matches, alias, mediaQuery }) => {})
const unregister = mq.on('smartphones', ({ matches, alias, mediaQuery }) => {}, {})

unregister() // this removes the handler you just added.
```

### mq.off(query, callback)

Remove all handlers for all media queries:

```js
mq.off()
```

Remove all handlers for a media query or alias:

```js
mq.off('(max-width: 400px)')
mq.off('small')
```

Remove a specific handler for a query or alias:

```js
mq.off('(max-width: 400px)', myHandler)
mq.off('small', myHandler)
```

## Browser Support

This library relies on matchMedia API to detect screensize change. You can use a polyfill if you need this package to work for older browsers. Check this out:
Paul Irish: [matchMedia polyfill](https://github.com/paulirish/matchMedia.js)

## Credits

This package is highly inspired by the work made on other packages (links below), I just shamelessly copied their work and combined them !

- [fine-mq](https://nash403.github.io/fine-mq/) by @nash403
- [media-query-facade](https://github.com/tanem/media-query-facade) by @tanem
- [vue-mq](https://github.com/AlexandreBonaventure/vue-mq/) by @AlexandreBonaventure
- [json2mq](https://github.com/akiran/json2mq) by @akiran
