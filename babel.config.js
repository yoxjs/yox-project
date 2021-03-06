module.exports = function (api) {
  api.cache(true)
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "ie": "8"
          }
        }
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-proposal-class-properties",
        {
          "loose": true
        }
      ]
    ]
  }
}