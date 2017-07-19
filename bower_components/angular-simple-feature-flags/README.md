[![Circle CI](https://circleci.com/gh/costacruise/angular-simple-feature-flags.svg?style=svg)](https://circleci.com/gh/costacruise/angular-simple-feature-flags)

#Angular Simple Feature Flags
Angular Simple Feature Flags is a configurable module for [AngularJS](https://angularjs.org/) that supports visibility-toggling (hiding/showing) of application components. [Feature flags](http://en.wikipedia.org/wiki/Feature_toggle) (or feature toggles) are commonly used in CI ([Continuous Integration](http://en.wikipedia.org/wiki/Continuous_integration)) workflows as they allow for code to be continuously released in to production environments, with incomplete features hidden behind a feature flag.

##Get Started

**(1)** Get this module in one of the following ways:

* [download the release](https://raw.githubusercontent.com/costacruise/angular-simple-feature-flags/master/angular-simple-feature-flags.js) *
* via Bower: by running `$ bower install angular-simple-feature-flags` from your console (recommended)


**(2)** Include `angular-simple-feature-flags.js` in your `index.html`, after including AngularJS itself


**(3)** Add 'simpleFeatureFlag' to your main module's list of dependencies:

```html
angular.module('exampleApp', [
  'simpleFeatureFlags'
]);
```

**(4)** Add a new config function to your application where you can pass in a config array using the modules init method:

```html
angular.module('exampleApp', [
    'simpleFeatureFlags'
  ])
  .config(function(FeatureFlagsProvider){
    FeatureFlagsProvider.init(
      [
        {'id': 'example0', 'active': true},
        {'id': 'example1', 'active': false},
        {'id': 'example2', 'active': false}
      ]
    );
  }
);
```
**Note:** The config is expected as an array of objects in the above format.


**(5)** Specify which elements should be controlled by the feature flags config in either of the following ways:

Contained within a `<feature-flags>` element:
```html
<feature-flag feature-key="example0">
  <div>
    <h1>This is my cool new feature!</h1>
  </div>
</feature-flag>
```
Or as an elements attribute:
```html
<div feature-flag feature-key="example1">
  <h1>This is my cool new feature!</h1>
</div>
```

**(6) (Optional)** It also possible to toggle the visibilty of a feature by adding an `invert` attribute.

This is useful when you want to switch between existing and new features using the same feature flag.

An inverted feature flag:

```html
<div feature-flag invert feature-key="example1">
  <h1>This is my existing feature</h1>
</div>
```

**(7)** Guard an entire route by using a resolve function and the `guardRoute` method:

```javascript
// using ngRoute
$routeProvider
  .when('/example', {
    url: '/example',
    resolve: {
      guard: function(FeatureFlags) {
        return FeatureFlags.guardRoute(['example0', 'example1']);
      }
    }
  }
})

// using AngularUI Router
$stateProvider
  .state('example', {
    resolve: {
      guard: function(FeatureFlags) {
        return FeatureFlags.guardRoute(['example0', 'example1']);
      }
    }
  })
```

### API - Dependency Injection

If you'd like to interface with the Angular Simple Feature Flags module from within a controller or directive, it is easy to do so. Simply add the module as a dependency as follows:

to a controller:
```javascript
angular.module('exampleApp')
  .controller('exampleCtrl', ['FeatureFlags', function(FeatureFlags) {
      // your code here...
    }
  ]);
```

to a directive:
```javascript
angular.module('exampleApp')
  .directive('exampleDirective', ['FeatureFlags', function(FeatureFlags) {
      // your code here...
    }
  ]);
```

### API - Documentation

#### FeatureFlags.addFlag()

Adds a new flag object to the feature flags array.
##### Syntax
> FeatureFlags.addFlag(flagObject)

##### Parameters
flagObject
(object) A config object in the example format: `{'id': 'foo', 'active': false}`
##### Returns
(boolean) true if the object was successfully added to the array, otherwise false
<br><br>



#### FeatureFlags.addFlags()
Adds an array of config objects to the config array
##### Syntax
> FeatureFlags.addFlags(configArray)

##### Parameters
configArray
(array) An array of config objects
##### Returns
(boolean) true if flag/s were added, otherwise false
<br><br>



#### FeatureFlags.removeFlag()
Remove a flag from the config array
##### Syntax
> FeatureFlags.removeFlag(flagId)

##### Parameters
flagId
(string) An id used to identify a flag object

##### Returns
(boolean) true if flag was removed, otherwise false
<br><br>



#### FeatureFlags.getFlagStatus()
Returns the status of a flag
##### Syntax
> FeatureFlags.getFlagStatus(flagId)

##### Parameters
flagId
(string) An id used to identify a flag object

##### Returns
(boolean) the status of the requested flag, false if the flag doesn't exist
<br><br>



#### FeatureFlags.setFlagStatus()
Sets the status of the flagId provided
##### Syntax
> FeatureFlags.setFlagStatus(flagId, newStatus)

##### Parameters
flagId
(string) An id used to identify a flag object
newStatus
(boolean) new status for the flagId provided

##### Returns
(boolean) true if the flag exists, otherwise false
<br><br>




#### FeatureFlags.getAllFlags()
Get the array of flag objects

##### Syntax
> FeatureFlags.getAllFlags()

##### Returns
(array) an array of flag objects
<br><br>



#### FeatureFlags.removeAllFlags()
Reset the flags object to an empty array

##### Syntax
> FeatureFlags.removeAllFlags()

##### Returns
(array) an empty array
<br><br>



#### FeatureFlags.guardRoute(flagIds)
Returns a promise which is resolved if all provided feature flags are enabled,
or rejected if any one is disabled; intended to be used in a router resolve
function to protect a route.

##### Parameters
flagIds
(string|array) A flag id (string), or array of flag ids

##### Syntax
> FeatureFlags.guardRoute(['flag-1', 'flag-2'])

##### Returns
(promise) a promise
<br><br>

\* If installing manually, you will also need to install [Lodash](https://github.com/lodash/lodash) as a dependency

###License
Angular Simple Feature Flags is licensed under the MIT license

###Feedback
Please add any bugs or feedback to the issue queue.

###Roadmap
* Add minification to the gulp build
* Support the inclusion of a config JSON file via $http request
* Store the flag object in session storage
