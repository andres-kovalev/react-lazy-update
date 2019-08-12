const React = require('react');
const { shallow, mount } = require('enzyme');

const lazy = require('../src/lazy');

const { useLazyState } = lazy;

// eslint-disable-next-line react/prop-types
function TestComponent({ children }) {
    const [ state1, setState1 ] = useLazyState(0);
    const [ state2, setState2 ] = useLazyState(0);

    const onClick = () => setTimeout(() => {
        setState1(state1 + 1);
        setState2(state2 + 1);
    }, 0);

    return (
        <div>
            <button onClick={ onClick } />
            { children }
        </div>
    );
}
TestComponent.displayName = 'TestComponent';
TestComponent.myStatic = {};

describe('lazy', () => {
    let LazyComponent;
    beforeEach(() => {
        LazyComponent = lazy(TestComponent);
    });

    it('should throw an error for non-functional components', () => {
        // eslint-disable-next-line react/prefer-stateless-function
        class NonFunctionalComponent extends React.Component {
            // eslint-disable-next-line class-methods-use-this
            render() {
                return <div />;
            }
        }

        expect(() => {
            lazy(NonFunctionalComponent);
        }).toThrow();
    });

    it('should return new functional component', () => {
        expect(LazyComponent).toBeInstanceOf(Function);
    });

    it('should return lazy version of component with proper name', () => {
        expect(LazyComponent.displayName).toBe(`lazy(${ TestComponent.displayName })`);
    });

    it('should return lazy version of component with same static fields', () => {
        expect(LazyComponent.myStatic).toBe(TestComponent.myStatic);
    });
});

describe('useLazyState', () => {
    it('should throw an error when used in regular (not lazy) component', () => {
        expect(() => {
            shallow(<TestComponent />);
        }).toThrow();
    });

    it('should throw an error when used in regular (not lazy) children of lazy component', () => {
        const LazyComponent = lazy(TestComponent);

        expect(() => {
            mount(
                <LazyComponent>
                    <TestComponent />
                </LazyComponent>
            );
        }).toThrow();
    });

    it('should not throw an error when used in lazy component', () => {
        const LazyComponent = lazy(TestComponent);

        expect(() => {
            mount(<LazyComponent />);
        }).not.toThrow();
    });

    it('should delay rendering on state update', () => {
        const ComponentSpy = jest.fn(TestComponent);
        const LazyComponent = lazy(ComponentSpy);

        jest.useFakeTimers();
        const wrapper = mount(<LazyComponent />);

        expect(ComponentSpy).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');
        jest.runAllTimers();

        return Promise.resolve().then(
            () => expect(ComponentSpy).toHaveBeenCalledTimes(2)
        );
    });
});
