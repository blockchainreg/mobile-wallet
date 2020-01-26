require! {
    \./location.js
}
document = {}
scroll-to = ->
mock-window = { scroll-to, location, document }
module.exports = window ? mock-window
module.exports.scroll-to = module.exports.scroll-to ? scroll-to