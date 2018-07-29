import { createApp } from './main'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, store, router } = createApp()
    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        context.meta = app.$meta()
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
