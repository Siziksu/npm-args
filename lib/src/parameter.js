import { typeOf } from './type.js'

export function isParameter(key) {
    return key.length >= 3 && key.startsWith("--")
}

export function extractArgument(key) {
    return key.slice(2)
}

export function getPredefinedParameters(parameters) {
    const list = {}
    const errors = []
    for (const key of Object.keys(parameters)) {
        if (!isParameter(key)) {
            errors.push(`'${key}' is not a valid parameter`)
            continue
        }
        const type = typeOf(parameters[key])
        if (type) { list[key] = type }
    }
    return [list, errors]
}
