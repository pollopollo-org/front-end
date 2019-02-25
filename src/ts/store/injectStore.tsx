import React, { createContext } from "react";

import { Store } from './Store';

/**
 * Creates a React context (ie. a Provider / Consumer pair), which allows us to
 * propagate references to the Store all the way down through our render tree.
 */

// @ts-ignore
// tslint:disable-next-line variable-name
const StoreContext = createContext<Store>();

// Provide a meaningful displayName for development environments
StoreContext.displayName = "StoreContext";

/**
 * Shorthand typing for omitting certain keys from an object.
 */
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * The inject method is just a bit of syntaxtic sugar for injecting data from
 * the store into components.
 *
 * It allows definition of a callback, which will recieve a reference to the
 * store defined in the provider, along with any props given when the component
 * is mounted into the DOM.
 */
export function injectStore<T extends {}, P extends {}>(
    callback: (store: Store) => T,
    WrappedComponent: React.ComponentType<P>, // tslint:disable-line variable-name
): React.SFC<Omit<P, keyof T>> {
    // Wrap the renderer in our consumer, so store will be propagated to it
    // tslint:disable-next-line variable-name
    const InjectStore: React.SFC<Omit<P, keyof T>> & { WrappedComponent: React.ComponentType<P> } = (props) => (
        <StoreContext.Consumer>
            {
                // There's a bug in TypeScript v3.2.1 - for some reason it will
                // report that `Omit<P, keyof T> & T` is not assignable to to P,
                // even though it really should be!
                // @ts-ignore
                store => <WrappedComponent { ...props } { ...callback(store) } />
            }
        </StoreContext.Consumer>
    );

    // Apply a meaningful display name for easier debugging in React devtools
    InjectStore.displayName = "InjectStore";

    // Expose wrapped component context globally
    InjectStore.WrappedComponent = WrappedComponent;

    // Return the injector publicly
    return InjectStore;
}

/**
 * Expose a reference to the StoreProvider publicly, so that the Root component
 * can mount it and thereby provide the reference globally within it's render
 * tree.
 */
// tslint:disable-next-line variable-name
export const StoreProvider = StoreContext.Provider;
