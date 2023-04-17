export function isValue(key) {
    return !key.startsWith("-") && !key.startsWith("--")
}

export function getValue(type, value) {
    let result
    switch (type.name) {
        case 'number':
            result = tryToGetNumberFromValue(value)
            break
        case 'string':
            result = value
            break
        case 'boolean':
            result = true
            break
        case 'array':
            result = getArrayValue(type, value)
            break
        default:
            throw Error(`there might be something wrong in the paramaters list`)
    }
    return result
}

function getArrayValue(type, value) {
    let result
    switch (type.of) {
        case 'number':
            result = value.split(",").map(v => tryToGetNumberFromValue(v))
            break
        case 'boolean':
            break
        case 'string':
        default:
            result = value.split(",")
            break
    }
    return result
}

function tryToGetNumberFromValue(value) {
    if (isNaN(value) || isNaN(parseFloat(value))) throw Error(`"${value}" is not a number`)
    return Number(value)
}
