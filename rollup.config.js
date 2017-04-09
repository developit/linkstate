import fs from 'fs';
import alias from 'rollup-plugin-alias';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-post-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

let format = process.env.FORMAT;

export default {
	useStrict: false,
	sourceMap: true,
	exports: 'default',
	format,
	moduleName: pkg.amdName,
	dest: format==='es' ? pkg.module : format==='umd' ? pkg['umd:main'] : pkg.main,
	external: ['preact'],
	entry: 'src/index.js',
	plugins: [
		alias({
			linkstate: 'src/index.js'
		}),
		nodeResolve({
			jsnext: true,
			main: true
		}),
		buble(),
		format==='cjs' && replace({
			'module.exports = index;': '',
			'var index =': 'module.exports ='
		}),
		format==='umd' && replace({
			'return index;': '',
			'var index =': 'return'
		}),
		format!=='es' && uglify({
			output: { comments: false },
			mangle: {
				topLevel: format==='cjs'
			}
		})
	]
};
