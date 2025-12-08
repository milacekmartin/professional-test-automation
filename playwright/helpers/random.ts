export function randomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length)
}

export function randomNumber(length = 5) {
    return String(Math.floor(Math.random() * 10 ** length))
}
