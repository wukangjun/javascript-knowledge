
const Webpack = require('./Webpack')
const config = require('../webpack.config')
const webpack = new Webpack(config)


webpack.run();