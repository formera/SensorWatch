# angular-sessionstorage

Provide read/write access to browsers' sessionStorage.

## Install

You can install this package either with `npm` or with `bower`.

### npm

```sh
$ npm install --save angular-sessionstorage
```

Then add `ngSessionStorage` as a dependency for your app:

```js
angular.module('myApp', [require('angular-sessionstorage')])
```

### bower

```sh
$ bower install --save angular-sessionstorage
```

Add a `<script>` to you `index.html`:

```html
<script src='/bower_components/angular-sessionstorage/angular-sessionstorage.js"></script>
```

Then add `ngSessionStorage` as a dependency for you app:

```js
angular.module('myApp', ['ngSessionStorage'])
```

## Documentation

### Services

#### $sessionStorage

##### Methods

###### get(key, [options])

Returns the value of given sessionStorage key

_Parameters_

| Param                | Type   | Details                                                                              |
|:---------------------|:-------|:-------------------------------------------------------------------------------------|
| key                  | string | Id to use for lookup.                                                                |
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.default](#$sessionStorageProvider.defaults) |

_Returns_

| Type   | Description               |
|:-------|:--------------------------|
| string | Raw sessionStorage value. |

###### getObject(key, [options])

Returns the deserialized value of given sessionStorage key

_Parameters_

| Param                | Type   | Details                                                                              |
|:---------------------|:-------|:-------------------------------------------------------------------------------------|
| key                  | string | Id to use for lookup.                                                                |
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.default](#$sessionStorageProvider.defaults) |

_Returns_

| Type   | Description                        |
|:-------|:-----------------------------------|
| Object | Deserialized sessionStorage value. |

###### getAll([options])

Returns a key value object with all sessionStorage entries

_Parameters_

| Param                | Type   | Details                                                                              |
|:---------------------|:-------|:-------------------------------------------------------------------------------------|
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.default](#$sessionStorageProvider.defaults) |

_Returns_

| Type   | Description                 |
|:-------|:----------------------------|
| Object | All sessionStorage entries. |

###### put(key, value, [options])

Set a value for given sessionStorage key

_Parameters_

| Param                | Type   | Details                                                                               |
|:---------------------|:-------|:--------------------------------------------------------------------------------------|
| key                  | string | Id for the `value`.                                                                   |
| value                | string | Raw value to be stored.                                                               |
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.defaults](#$sessionStorageProvider.defaults) |

###### putObject(key)

Serializes and sets a value for a given sessionStorage key

_Parameters_

| Param                | Type   | Details                                                                              |
|:---------------------|:-------|:-------------------------------------------------------------------------------------|
| key                  | string | Id for the `value`.                                                                  |
| value                | Object | Value to be stored.                                                                  |
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.default](#$sessionStorageProvider.defaults) |

###### remove(key, [options])

Remove given sessionStorage entry

_Parameters_

| Param                | Type   | Details                                                                              |
|:---------------------|:-------|:-------------------------------------------------------------------------------------|
| key                  | string | Id of the key-value pair to delete.                                                  |
| options _(optional)_ | Object | Options object. See [$sessionStorageProvider.default](#$sessionStorageProvider.defaults) |

##### Example

```js
angular.module('sessionStorageExample', ['ngSessionStorage'])
.controller('ExampleController', ['$sessionStorage', function ($sessionStorage) {
  // Retrieve a value
  var favourite = $sessionStorage.get('myFavorite')
  // Setting a value
  $sessionStorage.put('myFavorite', 'oatmeal')
}])
```

### Provider

### $sessionStorageProvider

##### Properties

###### <a id="$sessionStorageProvider.defaults"></a>defaults

Object containing default options to pass when setting values in sessionStorage.

The object may have the following properties:

- **prefix** - `{string}` - This will be prepended to any key when reading 
  and writing values from the sessionStorage


## License

The MIT License (MIT)

Copyright (c) 2016 Jan Oetjen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
