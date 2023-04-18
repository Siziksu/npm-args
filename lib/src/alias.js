export function isAlias(key) {
    return key.startsWith("-")
}

export function isValidAlias(parameters, key, value) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    if (value) {
        return isAlias(key) && key.length === 2 && letters.includes(key[1]) && Object.keys(parameters).includes(value)
    }
    return isAlias(key) && key.length === 2 && letters.includes(key[1]) && Object.keys(parameters).includes(key)
}

export function getPredefinedAliases(parameters, aliases, debug) {
    const list = {}
    for (const [key, value] of Object.entries(aliases)) {
        if (!isValidAlias(parameters, key, value)) {
            if (!debug) continue
            throw Error(`Alias '${key}' is not valid`)
        }
        list[key] = aliases[key]
    }
    return list
}
