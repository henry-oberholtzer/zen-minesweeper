import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.js',
  output: [{
    file: './dist/bundle.js',
    format: 'es',
    plugins: [typescript()]
  },
  {
    file: './dist/bundle.min.js',
    format: 'es',
    name: 'version',
    plugins: [typescript(),terser()]
  }]
}
