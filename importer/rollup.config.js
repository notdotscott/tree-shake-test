import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    plugins: [
        resolve({
            module: true
        }),
        babel({
            babelrc: false,
            exclude : './node_modules/**',
            presets: [
                [
                    'env', { 'modules': false }
                ]
            ],
            plugins: [
                'external-helpers'
            ]
        })
    ],
    output: {
        file: './output/bundle-rollup.js',
        format: 'cjs'
    }
};
