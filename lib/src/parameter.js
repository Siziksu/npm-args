import { typeOf } from './type.js'

export function isParameter(key) {
    return key.length >= 3 && key.startsWith("--")
}

export function extractArgument(key) {
    return key.slice(2)
}

export function getPredefinedParameters(parameters, debug) {
    const list = {}
    for (const key of Object.keys(parameters)) {
        if (!isParameter(key)) {
            if (!debug) continue
            throw Error(`Parameter '${key}' is not valid`)
        }
        const type = typeOf(parameters[key])
        if (type) { list[key] = type }
    }
    return list
}
