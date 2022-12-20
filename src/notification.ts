export const createNotification = (() => {
    const container = document.getElementsByClassName('notifications')[0]

    return (message: string): void => {
        const el = document.createElement('div')
        el.className = 'notification'
        el.textContent = `⚠ ${message}`

        container.appendChild(el)

        setTimeout(() => {
            container.removeChild(el)
        }, 1000)
    }
})()
