module.exports = {
  output: {
    library: 'cheapMemoize',
    libraryTarget: 'umd',
    path: './dist',
    filename: 'cheap-memoize.js'
  },
  entry: {
    library: './src/index.js'
  }
}
