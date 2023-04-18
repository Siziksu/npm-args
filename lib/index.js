import { getPredefinedParameters, isParameter, extractArgument } from './src/parameter.js'
import { getPredefinedAliases } from './src/alias.js'
import { isValue, getValue } from './src/value.js'
import { getArrayOfArguments, getValidArguments } from './src/argument.js'

export class Args {

    #output = {}
    #includeInput = false

    #parameters
    #aliases = {}

    #argv
    #includeProcessed = false
    #debug = false

    argv(argv) {
        this.#argv = argv
        return this
    }

    options({
        debug = true,
        includeInput = false,
        includeProcessed = false,
    } = {}) {
        this.#debug = debug
        this.#includeInput = includeInput
        this.#includeProcessed = includeProcessed
        return this
    }

    parameters(parameters) {
        this.#parameters = parameters
        return this
    }

    aliases(aliases) {
        this.#aliases = aliases
        return this
    }

    process() {
        this.#argv = this.#argv ?? process.argv.slice(2)
        try {
            if (this.#includeInput) {
                this.#output.input = this.#argv.join(' ')
            }
            if (!this.#parameters) {
                if (!this.#debug) return this.#output
                throw Error(`Parameters object is required`)
            }
            const parameters = getPredefinedParameters(this.#parameters, this.#debug)
            const aliases = getPredefinedAliases(this.#parameters, this.#aliases, this.#debug)
            if (this.#debug) {
                this.#output.parameters = parameters
                this.#output.aliases = aliases
            }
            const argumentArray = getArrayOfArguments(this.#argv, aliases)
            if (this.#debug) {
                this.#output.arguments = argumentArray.join(' ')
            }
            const validArguments = getValidArguments(argumentArray, parameters, aliases, this.#debug)
            const argumentObject = this.#getArguments(validArguments, parameters)
            if (this.#includeProcessed) this.#output.processed = validArguments.join(' ')
            this.#output.args = argumentObject
        } catch (error) {
            console.log(error)
        }
        return this.#output
    }

    #getArguments(validArguments, parameters) {
        const argumentObject = {}
        let argument
        let type
        let item
        let temp
        for (let index = validArguments.length - 1; index >= 0; index--) {
            item = validArguments[index]
            switch (true) {
                case isValue(item):
                    const previous = index - 1
                    switch (true) {
                        case isParameter(validArguments[previous]):
                            argument = extractArgument(validArguments[previous])
                            type = parameters[validArguments[previous]]
                            if (argumentObject[argument] && type.name == 'array') { // If it is an existing array already added to argumentObject
                                temp = getValue(type, item, this.#debug)
                                for (let i = 0; i < temp.length; i++) argumentObject[argument].push(temp[i])
                            } else {
                                temp = getValue(type, item, this.#debug)
                                if (temp) {
                                    argumentObject[argument] = temp
                                }
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
                default:
                    break
            }
        }
        for (const property in argumentObject) { // Delete empty arrays 
            if (Array.isArray(argumentObject[property]) && argumentObject[property].length == 0) {
                delete argumentObject[property]
            }
        }
        return argumentObject
    }
}
