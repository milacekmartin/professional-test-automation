/**
 * Generates a random alphanumeric string consisting of lowercase characters.
 *
 * @param length - Number of characters to generate (default: 8)
 * @returns A pseudo-random alphanumeric string
 *
 * Example: "a94k3pd7"
 */
export function randomString(length = 8): string {
    return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Generates a random numeric string with the specified number of digits.
 *
 * @param length - Number of digits to generate (default: 5)
 * @returns A string representing a random positive number
 *
 * Example: randomNumber(5) → "49302"
 */
export function randomNumber(length = 5): string {
    return String(Math.floor(Math.random() * 10 ** length))
}
