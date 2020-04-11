export const formatEnum = (str: string): string => {
    return str.toLocaleLowerCase().replace('_', ' ').split(' ').map(
        (s) => {
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
    ).join(' ')
}