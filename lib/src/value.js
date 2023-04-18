export function isValue(key) {
    return !key.startsWith("-") && !key.startsWith("--")
}

export function getValue(type, value, debug) {
    let result
    switch (type.name) {
        case 'number':
            result = getNumber(value, debug)
            break
        case 'string':
            result = value
            break
        case 'boolean':
            result = true
            break
        case 'array':
            result = getArrayValue(type, value, debug)
            break
        default:
            if (debug) throw Error(`There might be something wrong in the paramaters list`)
    }
    return result
}

function getArrayValue(type, value, debug) {
    let result
    switch (type.of) {
        case 'number':
            if (debug) {
                result = value.split(",").map(v => getNumber(v, debug))
            } else {
                result = value.split(",").filter(v => isNumber(v)).map(v => Number(v))
            }
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

function isNumber(value) {
    return !(isNaN(value) || isNaN(parseFloat(value)))
}

function getNumber(value, debug) {
    if (!isNumber(value)) {
        if (!debug) return undefined
        throw Error(`Value '${value}' is not a number`)
    }
    return Number(value)
}
