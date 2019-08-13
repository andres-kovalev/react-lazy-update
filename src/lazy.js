const React = require('react');

const { createContext, useContext, useRef, useReducer, useCallback } = React;
const hoistStatics = require('hoist-non-react-statics');

const emptyContext = Symbol('empty-context');
const LazyContext = createContext(emptyContext);

const identity = value => value;
const updateReducer = value => value + 1;

const useLazyRef = (callback) => {
    const ref = useRef();

    if (ref.current === undefined) {
        ref.current = callback();
    }

    return ref.current;
};

const isClassComponent = value => typeof value === 'function'
    && value.prototype
    && value.prototype.render;

const createLazyRenderer = (renderFunction) => {
    const LazyRenderer = props => (
        <LazyContext.Provider>
            { renderFunction(props) }
        </LazyContext.Provider>
    );

    LazyRenderer.displayName = 'LazyRenderer';

    return LazyRenderer;
};

const lazy = (Component) => {
    if (isClassComponent(Component)) {
        throw new Error('Laziness can be applied only to functional components!');
    }

    const LazyRenderer = createLazyRenderer(Component);

    const WrappedComponent = (props) => {
        const [ , update ] = useReducer(updateReducer, 0);

        return (
            <LazyContext.Provider value={ useLazyRef(() => {
                const state = {
                    states: [],
                    id: 0,
                    valid: true,
                    update: () => {
                        if (state.valid) {
                            return;
                        }

                        state.valid = true;
                        update();
                    }
                };

                return state;
            }) }>
                <LazyRenderer { ...props } />
            </LazyContext.Provider>
        );
    };

    WrappedComponent.displayName = `lazy(${ Component.displayName || Component.name })`;
    hoistStatics(WrappedComponent, Component);

    return WrappedComponent;
};

const createLazyHook = (initState, createStateUpdate) => (...hookArgs) => {
    const context = useContext(LazyContext);
    if (context === emptyContext) {
        throw new Error('useLazyState() hook can be called only by lazy components!');
    }

    const { states } = context;
    const index = useLazyRef(() => {
        // eslint-disable-next-line no-plusplus
        const id = context.id++;
        states[id] = initState(...hookArgs);

        return id;
    });

    const update = useRef();
    update.current = createStateUpdate(...hookArgs);

    const setState = useCallback((...updateArgs) => {
        const oldState = states[index];
        const newState = update.current(oldState, ...updateArgs);

        if (newState === oldState) {
            return;
        }

        states[index] = newState;

        if (context.valid) {
            context.valid = false;

            Promise.resolve().then(context.update);
        }
    }, []);

    return [
        states[index],
        setState
    ];
};

const setState = (oldState, newState) => newState;
const useLazyState = createLazyHook(
    identity,
    () => setState
);

const useLazyReducer = createLazyHook(
    (reducer, defaultState) => defaultState,
    identity
);

module.exports = Object.assign(lazy, {
    useLazyState,
    useState: useLazyState,
    useLazyReducer,
    useReducer: useLazyReducer
});
