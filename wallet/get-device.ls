module.exports = ->
    return \mobile if not document?documentElement?clientWidth?
    m = Math.max(document.documentElement.clientWidth, window.innerWidth or 0)
    r =
        | m > 800 => \desktop
        | _ => \mobile