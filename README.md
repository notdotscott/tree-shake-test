# tree-shake-test

### Setup:
```bash
cd importee
npm link

cd ../importer
npm link importee
npm i
```
### Webpack:
```bash
npm run build-webpack
```

You should have a minified `bundle-webpack.js` file at `importer/output` that only includes `Person`. 
It will look something like this at the bottom of the file:
```javascript
function(e, t, n) {
    "use strict";
    t.a = class {
        constructor() {
            console.log("[Person]")
        }

        sayHello() {
            console.log("Hello")
        }
    }
}
```
This is because we've declared named exports in our entry point file (`importee/src/index.js`):
```javascript
export { default as Person } from './person';
export { default as Dog } from './dog';
```
Comment out those exports and uncomment all the other lines:
```javascript
// export { default as Person } from './person';
// export { default as Dog } from './dog';
 
import Person from './person';
import Dog from './dog';
 
export default {
    Person: Person,
    Dog: Dog
};
```

Run `npm run build` again and check `importer/output/bundle-webpack.js`. 
Despite our importing project only specifying that it wanted `Person`, it has included both classes exported 
by `importee` - `Person` AND `Dog`:
```javascript
function(o, e, t) {
    "use strict";
    e.a = class {
        constructor() {
            console.log("[Person]")
        }

        sayHello() {
            console.log("Hello")
        }
    }
}, function(o, e, t) {
    "use strict";
    e.a = class {
        constructor() {
            console.log("[Dog]")
        }

        bark() {
            console.log("Bark!")
        }
    }
}
```
This is down to `importee` now exporting a default object, which includes all of its internal modules. Bundling tools 
don't tree shake this, as it's one export. It's implicit that if you are a library author and are declaring a default export, 
you expect the consumer to import EVERYTHING, whether they use it all or not.

### Rollup:
Go back and change `importee/src/index.js` to:
```javascript
export { default as Person } from './person';
export { default as Dog } from './dog';
```

Run:
```bash
npm run build-rollup
```

Open `bundle-rollup.js` at `importer/output`. Did you expect Rollup to tree shake `Dog` out of your bundle? Well it didn't! As it states in
the Rollup documentation:
> ...Rollup has to be conservative about what code it removes in order to guarantee that the end result will run correctly. If an imported module appears to have side-effects, either on bits of the module that you're using or on the global environment, Rollup plays it safe and includes those side-effects.

So Rollup is erring on the side of caution, and including `Dog` as well.