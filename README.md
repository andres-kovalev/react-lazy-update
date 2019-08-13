[![ci](https://img.shields.io/circleci/build/github/andres-kovalev/react-lazy-update.svg?style=flat-square&logo=circleci)](https://circleci.com/gh/andres-kovalev/react-lazy-update)
[![codecov](https://img.shields.io/codecov/c/github/andres-kovalev/react-lazy-update.svg?style=flat-square&logo=codecov&token=1280f2cf41a24522add9857967be2a73)](https://codecov.io/gh/andres-kovalev/react-lazy-update)
[![downloads](https://img.shields.io/npm/dm/react-lazy-update.svg?style=flat-square&logo=data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDAwcHgiIGhlaWdodD0iNDAwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiCj48ZyBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTM3OSwxODAuNWgtMTAydi0xMDBoLTE1M3YxMDBoLTEwMmwxNzguNSwxNzguNWwxNzguNSwtMTc4LDUiLz48L2c+PC9zdmc+Cg==)](https://www.npmjs.com/package/react-lazy-update)
[![node](https://img.shields.io/node/v/react-lazy-update.svg?style=flat-square&logo=node.js&color=007ec6)](https://nodejs.org/)
[![npm](https://img.shields.io/npm/v/react-lazy-update.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/react-lazy-update)
[![MIT](https://img.shields.io/npm/l/react-lazy-update.svg?color=007ec6&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAA5ElEQVR4AY3SJWyDcRQE8G+MsnIg63XNmMm2ZuB9xjyv5tWYfAZ2TD6tGW9qzHCX3H9bX4rJz7y7K3t8NK20OT7ogHnYl3ndfK5nRwFYgxf4Nl6UBVzfjcoholIiEXbdsBS2TCERdks5HIaPVIfqDnN4HCO8gUm5iZEfc/gYI+gBT3pi5I8M3szxE0LgSYg303ljcGqOtAHFshEjP+VwOkbwCvXyGiOf5rASrkwQhhIJm4zdKg4zYBDe/z8j72Te0bu6GRxSIUzAHXxBF3jSpdudOoX2/5oDQVgEP3ji1y3Ijhv9ABp7euvVsybrAAAAAElFTkSuQmCC&style=flat-square)](https://github.com/andres-kovalev/react-lazy-update/blob/master/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-lazy-update.svg?style=flat-square&logo=data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDAwcHgiIGhlaWdodD0iNDAwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNNzUsMzBoMTc1bDEwMCwxMDB2MjQwaC0yNzV2LTI0MCIvPjwvZz48ZyBmaWxsPSIjREREIj48cGF0aCBkPSJNMjUwLDMwbDEwMCwxMDBoLTEwMHYtMTAwIi8+PC9nPjwvc3ZnPgo=)](https://www.npmjs.com/package/react-lazy-update)

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

    const [ value1, setValue1 ] = useState(0);
    const [ value2, setValue2 ] = useState(0);

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

## useReducer (useLazyReducer)

We can also replace `React.useReducer()` hook with `useLazyReducer()` provided by `react-lazy-update`:

```js
import lazy, { useLazyReduccer } from 'react-lazy-update';

const Button = () => {
    const [ value1, dispatch1 ] = useLazyReduccer(reducer1, 0);
    const [ value2, dispatch2 ] = useLazyReduccer(reducer2, 0);

    const onClick = () => {
        setValue1(actionCreator1('click'));
        setValue2(actionCreator2('click'));
    };

    return (
        <button onClick={ onClick }>update me</button>
    );
}

export default lazy(Button);
```

And, of course, we can use `useReducer()` alias to make life easier.
