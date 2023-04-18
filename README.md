# args

## Execution with node.js

The script should be called like:

```bash
$ node ./app/index.js --port=1234 -n "John Doe" --numbers 134,25,3.5,41.23 --tags tag1,tag2,tag3 -x --tags=tag4 -t=tag5,tag6 -g=25,3
```

## Usage

__app.js__
```javascript
import { Args } from '@siziksu/args'

const args = new Args()
args.options({
    debug: false, // Include debug info
    includeInput: true, // Include the parameters in the response
    includeProcessed: true // Include the real processed parameters in the response
}).parameters({ // You define the params and the types to be used
    '--port': Number, // --port <number> or --port=<number>
    '--age': Number, // --age <number> or --age=<number>
    '--name': String, // --name <string> or --name=<string>
    '--tags': [String], // --tag <string>,... or --tag=<string>,...
    '--allowed': Boolean,
    '--numbers': [Number] // --numbers <number>,... or --numbers=<number>,...
}).aliases({ // You define the aliases to be used
    '-p': '--port', // -p <number> or -p=<number>; result is stored in --port
    '-a': '--age', // -a <number> or -a=<number>; result is stored in --age
    '-n': '--name', // -n <string> or -n=<string>; result is stored in --name
    '-t': '--tags', // -t <string>,... or -t=<string>,...; result is stored in --tags
    '-x': '--allowed', // -x; result is stored in --allowed
    '-g': '--numbers' // -g <number>,... or -g=<number>,...; result is stored in --numbers
})
const params = args.process()

console.log(params)
```

__Output__
```javascript
{
  input: '--port=1234 -n John Doe --numbers 134,25,3.5,41.23 --tags tag1,tag2,tag3 -x --tags=tag4 -t=tag5,tag6 -g=25,3',
  valid_arguments: '--port 1234 --name John Doe --numbers 134,25,3.5,41.23 --tags tag1,tag2,tag3 --allowed --tags tag4 --tags tag5,tag6 --numbers 25,3',
  args: {
    numbers: [ 25, 3, 134, 25, 3.5, 41.23 ],
    tags: [ 'tag5', 'tag6', 'tag4', 'tag1', 'tag2', 'tag3' ],
    allowed: true,
    name: 'John Doe',
    port: 1234
  }
}
```

## Testing

__index.js__
```javascript
import { Args } from '@siziksu/args'

const argv = ['--port=1234', '-n', 'Siziksu', '--allowed', '--numbers', '134,25,3.5,41.23', '--tags', 't1,t2,t3', '--tags=t4', '-t=t5,t6', '-g=25,3']

const args = new Args()
args.argv(argv) // Add the 'argv' defined
    .options({ debug: true })
    .parameters({
        '--port': Number,
        '--age': Number,
        '--name': String,
        '--tags': [String],
        '--allowed': Boolean,
        '--numbers': [Number]
    }).aliases({
        '-p': '--port',
        '-a': '--age',
        '-n': '--name',
        '-t': '--tags',
        '-x': '--allowed',
        '-g': '--numbers'
    })
const params = args.process()

console.log(params.args)
```

__Output__
```javascript
{
  numbers: [ 25, 3, 134, 25, 3.5, 41.23 ],
  tags: [ 't5', 't6', 't4', 't1', 't2', 't3' ],
  allowed: true,
  name: 'Siziksu',
  port: 1234
}
```
