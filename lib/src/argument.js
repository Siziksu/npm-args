import { isValue } from './value.js'
import { isParameter } from './parameter.js'
import { isAlias, isValidAlias } from './alias.js'

export function getArrayOfArguments(argv, aliases) {
    const output = []
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].includes('=')) {
            const [argument, value] = argv[i].split("=")
            if (Object.keys(aliases).includes(argument)) {
                output.push(aliases[argument])
                output.push(value)
                continue
            }
            output.push(argument)
            output.push(value)
            continue
        }
        if (Object.keys(aliases).includes(argv[i])) {
            output.push(aliases[argv[i]])
            continue
        }
        output.push(argv[i])

    }
    return output
}

export function getValidArguments(array, parameters, aliases, debug) {
    const output = []
    for (let index = 0; index < array.length; index++) {
        output.push(array[index])
    }
    let item
    let previous
    for (let index = output.length - 1; index >= 0; index--) {
        item = output[index]
        switch (true) {
            case isValue(item):
                if (index === 0) {
                    output.pop()
                    if (!debug) continue
                    throw Error(`Value '${item}' is not valid because it has no previous parameter`)
                }
                previous = index - 1
                switch (true) {
                    case isParameter(output[previous]):
                        if (!parameters[output[previous]]) {
                            output.splice(previous, 2)
                            index--
                            if (!debug) continue
                            throw Error(`Value '${item}' is not valid because the previous argument is not a valid parameter`)
                        }
                        index--
                        break
                    case isAlias(output[previous]):
                        if (!aliases[output[previous]]) {
                            output.splice(previous, 2)
                            index--
                            if (!debug) continue
                            throw Error(`Value '${item}' is not valid because the previous argument is not a valid alias`)
                        }
                        index--
                        break
                    case isValue(output[previous]):
                        output.splice(index, 1)
                        if (!debug) continue
                        throw Error(`Value '${item}' is not valid because the previous argument was another value`)
                }
                break
            case isParameter(item):
                if (!parameters[item]) {
                    output.splice(index, 1)
                    if (!debug) continue
                    throw Error(`Parameter '${item}' is not valid`)
                }
                if (parameters[item].name !== 'boolean') {
                    // Parameter not used because there is no value and it is not a boolean
                    output.splice(index, 1)
                }
                break
            case isAlias(item):
                if (!isValidAlias(aliases, item)) {
                    output.splice(index, 1)
                    if (!debug) continue
                    throw Error(`Alias '${item}' is not valid`)
                }
                if (parameters[aliases[item]].name !== 'boolean') {
                    // Alias not used because there is no value and it is not a boolean
                    output.splice(index, 1)
                }
                break
            default:
                break
        }
    }
    return output
}
