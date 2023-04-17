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

export function getValidArguments(array, parameters, aliases) {
    const output = []
    for (let index = 0; index < array.length; index++) {
        output.push(array[index])
    }
    const errors = []
    let item
    let previous
    for (let index = output.length - 1; index >= 0; index--) {
        item = output[index]
        switch (true) {
            case isValue(item):
                if (index === 0) {
                    errors.push(`Value '${item}' is not valid because it has no previous parameter`)
                    output.pop()
                    continue
                }
                previous = index - 1
                switch (true) {
                    case isParameter(output[previous]):
                        if (!parameters[output[previous]]) {
                            errors.push(`Value '${item}' is not valid because '${output[previous]}' is not a valid parameter`)
                            output.splice(previous, 2)
                            index--
                            continue
                        }
                        index--
                        break
                    case isAlias(output[previous]):
                        if (!aliases[output[previous]]) {
                            errors.push(`Value '${item}' is not valid because '${output[previous]}' is not a valid alias`)
                            output.splice(previous, 2)
                            index--
                            continue
                        }
                        index--
                        break
                    case isValue(output[previous]):
                        errors.push(`Value '${item}' is not a valid value because the previous argument '${output[previous]}' was another value`)
                        output.splice(index, 1)
                        break
                }
                break
            case isParameter(item):
                if (!parameters[item]) {
                    errors.push(`Parameter '${item}' is not valid`)
                    output.splice(index, 1)
                    continue
                }
                if (parameters[item].name !== 'boolean') {
                    errors.push(`Parameter '${item}' not used because there is no value and it is not a boolean`)
                    output.splice(index, 1)
                    continue
                }
                break
            case isAlias(item):
                if (!isValidAlias(aliases, item)) {
                    errors.push(`Alias '${item}' is not valid`)
                    output.splice(index, 1)
                    continue
                }
                if (parameters[aliases[item]].name !== 'boolean') {
                    errors.push(`Alias '${item}' not used because there is no value and it is not a boolean`)
                    output.splice(index, 1)
                    continue
                }
                break
        }
    }
    return [output, errors]
}
