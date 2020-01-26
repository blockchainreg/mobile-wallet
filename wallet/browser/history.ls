require! {
    \./window.js
}
push-state = (state, title, page)->
    #window.onpopstate? { state }
module.exports =
    history ? { push-state }