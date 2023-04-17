export function typeOf(subject) {
    if (Array.isArray(subject)) return { name: 'array', of: getArrayElementType(subject[0]) }
    if (subject === Number) return { name: 'number' }
    if (subject === String) return { name: 'string' }
    if (subject === Boolean) return { name: 'boolean' }
}

function getArrayElementType(subject) {
    if (subject === Number) return 'number'
    if (subject === String) return 'string'
    if (subject === Boolean) return 'boolean'
}
