# react-lazy-update

Optimized update hook for react.

## Overview

To use state in functional components we can call `useState()` hook. It returns state and state setter function.

```js
const [ state, setState ] = useState(0);
```

We can call this function as many times as we need to create separate state variables.

```js
const [ value1, setValue1 ] = useState(0);
const [ value2, setValue2 ] = useState(0);
```

We can use our new values and update them using setter function:

```js
setValue1(1);
```

After each state change our component will be re-rendered with new values. But what if we're updating state several times?

```js
const onClick = () => {
    setValue1(1);
    setValue2(2);
};

return (
    <button onClick={ onClick }>update me</button>
);
```

Fortunatelly React handles such cases - state update will be postponed (called asynchronously) and our component will be re-rendered only once. We can check it by adding some console logs:

```js
const Button = () => {
    console.log('render');

    const onClick = () => {
        console.log('onClick');
        setValue1(1);
        console.log('setValue1');
        setValue2(2);
        console.log('setValue2');
    };

    return (
        <button onClick={ onClick }>update me</button>
    );
}
```

After click on a button we will see:

```bash
onClick
setValue1
setValue2
render
```

Nice! We updated state twice, but component re-rendered only once.

Unfortunatelly it not always works this way. Let's modify our click handler a bit:

```js
    const onClick = () => {
        console.log('onClick');
        setTimeout(() => {
            console.log('timeout');
            setValue1(1);
            console.log('setValue1');
            setValue2(2);
            console.log('setValue2');
        }, 0);
    };
```

And then click our button:

```bash
onClick
timeout
setValue1
render
setValue2
render
```

Oops. Now our component renders itself twice. But why? Looks like React have some problems with updating state in some uncontrolled cases (like async callbacks). There is a [post](https://www.bennadel.com/blog/2893-setstate-state-mutation-operation-may-be-synchronous-in-reactjs.htm) about it.

But fortunatelly we can fix it with `react-lazy-update`!

# Installation

As any other npm package `react-lazy-update` can be added to your project by following command:

```bash
npm i -S react-lazy-update
```

It requires any version of `react` with new context API support as peer dependency, so it should be installed as well.

```bash
npm i -S react
```

# API

## lazy

`react-lazy-update` exports `lazy()` HoC. We just need to wrap our component with it:

```js
import lazy from 'react-lazy-update';

const Button = () => {
    ...
}

export default lazy(Button);
```

## useState (useLazyState)

For lazy component we just need to replace `React.useState()` with `useLazyState()` provided by `react-lazy-update`:

```js
// import { useState } from 'react';
import lazy, { useLazyState } from 'react-lazy-update';
```

Or we can use alias `useState()` to make replacement even easier:

```js
import lazy, { useState } from 'react-lazy-update';

const Button = () => {
    ...
};

export default lazy(Button);
```

Now our button works as expected and renders only once:

```bash
onClick
timeout
setValue1
setValue2
render
```

Nice again! =)
