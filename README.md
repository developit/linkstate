# linkState

> Create an Event handler function that sets a given state property. Works with [preact] and [react].

-   **Tiny:** ~**300 bytes** of [ES3](https://unpkg.com/linkstate) gzipped
-   **Familiar:** it's just a function that does what you would have done manually
-   **Standalone:** one function, no dependencies, works everywhere

> 🤔 **Why?**
>
> linkState() is memoized: it only creates a handler once for each `(key, eventPath)` combination.
>
> This is important for performance, because it prevents handler thrashing and avoids allocations during render.

* * *

## Table of Contents

-   [Installation](#installation)
-   [How It Works](#how-it-works)
-   [Usage](#usage)
-   [Contribute](#contribute)
-   [License](#license)

* * *

## Installation

```sh
npm install --save linkstate
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com/linkstate/dist/linkstate.umd.js):

```html
<script src="//unpkg.com/linkstate/dist/linkstate.umd.js"></script>
```

This exposes the `linkState()` function as a global.

* * *

## How It Works

It's important to understand what linkState does in order to use it comfortably.

**`linkState(component, statePath, [valuePath])`**

- `component`: the Component instance to call `setState()` on
- `statePath`: a key/path to update in state - can be dot-notated for deep keys
- `valuePath`: _optional_ key/path into the event object at which to retrieve the new state value

It's easiest to understand these arguments by looking at a simplified implementation of linkState itself:

```js
function linkState(component, statePath, valuePath) {
  return event => {
    let update = {};
    update[statePath] = event[valuePath];
    component.setState(update);
  };
}
```

In reality, accounting for dot-notated paths makes this trickier, but the result is the same.

Here's two equivalent event handlers, one created manually and one created with linkState:

```js
handleInput = e => {
  this.setState({ foo: e.target.value })
}

handleInput = linkState(this, 'foo')
```

Notice how we didn't specify the event path - if omitted, `linkState()` will use the `checked` or `value` property of the event target, based on its type.

## Usage

Standard usage is a function that returns an event handler to update state:

```js
import linkState from 'linkstate';

class Foo extends Component {
  state = {
    text: ''
  };
  render(props, state) {
    return (
      <input
        value={state.text}
        onInput={linkState(this, 'text')}
      />
    );
  }
}
```

You can also use it as a [**polyfill**](https://ponyfill.com/#polyfill). This emulates the behavior of Preact 7.x, which provided `linkState()` as a method on its `Component` class. Since you're then calling `linkState()` as a method of the component instance, you won't have to pass in `component` as an argument:

```js
import 'linkstate/polyfill';

// Component.prototype.linkState is now installed!

class Foo extends Component {
  state = {
    text: ''
  };
  render(props, state) {
    return (
      <input
        value={state.text}
        onInput={this.linkState('text')}
      />
    );
  }
}
```


* * *

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

> 💁 **Remember: size is the #1 priority.**
>
> Every byte counts! PR's can't be merged if they increase the output size much.

-   Fork it!
-   Clone your fork: `git clone https://github.com/<your-username>/linkstate`
-   Navigate to the newly cloned directory: `cd linkstate`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](LICENSE.md) © [Jason Miller](https://jasonformat.com/)


[preact]: https://github.com/developit/preact
[react]: https://github.com/facebook/react
