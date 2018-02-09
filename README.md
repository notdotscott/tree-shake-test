# tree-shake-test

```bash
cd importee
npm link

cd ../importer
npm link importee
npm i
npm run build
```

You should have a minified `bundle.js` file at `importer/output` that only includes `MyOtherClass`. It will look something like this at the bottom of the file:
```javascript
function(t, e, r) {
    "use strict";
    e.a = class {
        constructor() {
            console.log("[MyOtherClass] constructor")
        }

        sayHello() {
            console.log("Hello from MyOtherClass")
        }
    }
}
```
This is because we've declared individual exports in our entry point file (`importee/src/index.js`):
```javascript
export { default as MyClass } from './MyClass';
export { default as MyOtherClass } from './MyOtherClass';
```
Comment out those exports and uncomment all the other lines:
```javascript
// export { default as MyClass } from './MyClass';
// export { default as MyOtherClass } from './MyOtherClass';

import MyClass from './MyClass';
import MyOtherClass from './MyOtherClass';

export default {
    MyClass: MyClass,
    MyOtherClass: MyOtherClass
};
```

Run `npm run build` again and check `importer/output/bundle.js`. Despite our importing project only specifying that it wanted `MyOtherClass`, it has included both classes exported by `importee/index.js` - `MyClass` AND `MyOtherClass`:
```javascript
function(o, t, e) {
    "use strict";
    t.a = class {
        constructor() {
            console.log("[MyClass] constructor")
        }

        sayHello() {
            console.log("Hello from MyClass")
        }
    }
}, function(o, t, e) {
    "use strict";
    t.a = class {
        constructor() {
            console.log("[MyOtherClass] constructor")
        }

        sayHello() {
            console.log("Hello from MyOtherClass")
        }
    }
}
```
