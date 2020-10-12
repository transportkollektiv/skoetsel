# skoetsel

skoetsel is a maintenance tool for [OpenBike](https://github.com/stadtulm/OpenBike). It shows locations and states of the bikes and trackers to the service and maintenance crew.

## Build Setup

```bash
# install dependencies
$ npm install
```

skoetsel needs to reach your [cykel](https://github.com/stadtulm/cykel) instance. If it's not running on localhost:8000, you may want to set `export API_URL="https://api.dev.bike"`

```bash
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
