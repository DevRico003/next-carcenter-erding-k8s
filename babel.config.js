module.exports = {
  presets: [
    ['next/babel'], // Ensures Next.js features are supported
    ['@babel/preset-env', { targets: { node: 'current' } }], // Transpile for the current Node.js versionn
  ],
};
transformIgnorePatterns: ['/node_modules/(?!(node-fetch)/)']
