export function generateRandomString(size: number = 8, possible?: string) {
    if(!possible)
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    let text = ""
    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}

export function generateRandomNumber(size: number = 8, possible?: string) {
    if(!possible)
        possible = "123456789"

    return generateRandomString(size, possible)
}
