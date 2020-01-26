require! {
    \mobx-react : { observer }
    \mobx : { observable }
    \react
    \./pages.js
    \./pages/header.js
    \./description.js
    \./browser/window.js
    \./copy-message.js
    \./modal.js : { modal-control }
    \./get-primary-info.js
    \./pages/confirmation.js : { confirmation-control }
}
.app
    *
        user-select: none
    user-select: none
    overflow: hidden
    @import scheme
    background: $primary
    height: 100vh
    position: relative
    color: white
    text-align: center
    width: 100vw
    .content
        max-width: 450px
        display: inline-block
        width: 100%
    &.syncing
        background-size: 400% 400% !important
        animation: gradient 3s ease infinite
    @keyframes gradient
        0%
            background-position: 0% 50%
        50%
            background-position: 100% 50%
        100%
            background-position: 0% 50%
module.exports = ({ store, web3t })->
    return null if not store?
    current-page =
        pages[store.current.page]
    theme = get-primary-info(store)
    style =
        background: theme.app.background
    syncing = 
        | store.current.refreshing => "syncing"
        | _ => ""
    .pug
        description store
        .app.pug(key="content" style=style class="#{syncing}")
            modal-control store, web3t
            confirmation-control store, web3t
            copy-message store, web3t
            header store, web3t
            current-page { store, web3t }