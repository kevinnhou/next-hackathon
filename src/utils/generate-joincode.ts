/**
 * Generates a random joincode for groups
 * @param length The length of the joincode (default: 6)
 * @returns A random alphanumeric joincode
 */
export function generateJoincode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
