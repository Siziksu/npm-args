import { getPredefinedParameters, isParameter, extractArgument } from './src/parameter.js'
import { getPredefinedAliases } from './src/alias.js'
import { isValue, getValue } from './src/value.js'
import { getArrayOfArguments, getValidArguments } from './src/argument.js'

export class Args {

    #output = {}
    #errors = []

    #parameters
    #aliases

    #argv
    #includeErrors
    #includeProcessed
    #debug

    init(parameters, aliases, {
        argv = process.argv.slice(2),
        debug = false,
        includeInput = false,
        includeProcessed = false,
        includeErrors = false
    } = {}) {
        this.#parameters = parameters
        this.#aliases = aliases
        this.#argv = argv
        this.#includeErrors = includeErrors
        this.#includeProcessed = includeProcessed
        this.#debug = debug
        try {
            if (includeInput) {
                this.#output.input = argv.join(' ')
            }
            if (!parameters) this.#errors.push('"parameters" object is required')
        } catch (error) {
            if (this.#debug) {
                console.log(error)
            } else {
                this.#errors.push(error.message)
            }
        }
    }

    process() {
        try {
            const [parameters, errorsFromParameters] = getPredefinedParameters(this.#parameters)
            const [aliases, errorsFromAliases] = getPredefinedAliases(this.#parameters, this.#aliases)
            errorsFromParameters.forEach(element => this.#errors.push(element))
            errorsFromAliases.forEach(element => this.#errors.push(element))
            if (this.#debug) {
                this.#output.parameters = parameters
                this.#output.aliases = aliases
            }
            const argumentArray = getArrayOfArguments(this.#argv, aliases)
            if (this.#debug) {
                this.#output.arguments = argumentArray.join(' ')
            }
            const [validArguments, errorsFromArgumentArray] = getValidArguments(argumentArray, parameters, aliases)
            errorsFromArgumentArray.forEach(element => this.#errors.push(element))
            const [argumentObject] = this.#getArguments(validArguments, parameters)
            if (this.#includeProcessed) this.#output.valid_arguments = validArguments.join(' ')
            this.#output.args = argumentObject
        } catch (error) {
            if (this.#debug) {
                console.log(error)
            } else {
                this.#errors.push(error.message)
            }
        }
        if (this.#includeErrors) this.#output.errors = this.#errors
        return this.#output
    }

    #getArguments(validArguments, parameters) {
        const argumentObject = {}
        let item
        for (let index = validArguments.length - 1; index >= 0; index--) {
            item = validArguments[index]
            switch (true) {
                case isValue(item):
                    const previous = index - 1
                    switch (true) {
                        case isParameter(validArguments[previous]):
                            let argument = extractArgument(validArguments[previous])
                            let type = parameters[validArguments[previous]]
                            if (argumentObject[argument] && type.name == 'array') {
                                let temp = getValue(type, item)
                                for (let i = 0; i < temp.length; i++) {
                                    argumentObject[argument].push(temp[i])
                                }
                            } else {
                                argumentObject[argument] = getValue(type, item)
                            }
                            index--
                            break
                    }
                    break
                case isParameter(item):
                    if (parameters[item].name === 'boolean') {
                        argumentObject[extractArgument(item)] = true
                    }
                    break
            }
        }
        return [argumentObject]
    }
}
