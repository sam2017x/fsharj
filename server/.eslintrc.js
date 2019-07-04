module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  env: {
    node: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle":  ["error", { "allow": ["_id"] }]
  }
}