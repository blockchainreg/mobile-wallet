require! {
    \./math.js : { times, div }
}
module.exports = (val)->
    r = Math.round (val `times` 100) 
    r `div` 100