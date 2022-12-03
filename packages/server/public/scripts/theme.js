function themeToggle() {
    let theme = localStorage.getItem("theme")
    if (theme && theme === "dark") {
        localStorage.setItem("theme", "")
        document.documentElement.setAttribute('color-theme', 'light')
    } else {
        localStorage.setItem("theme", "dark")
        document.documentElement.setAttribute('color-theme', 'dark')
    }
}

window.onload = function() {
    let onpageLoad = localStorage.getItem("theme") || ""
    let element = document.body
    if (onpageLoad == "dark") {
        document.documentElement.setAttribute('color-theme', 'dark')
    }
    else {
        document.documentElement.setAttribute('color-theme', 'light')
    }
    document.getElementById('togTheme').addEventListener('click', themeToggle)
}
