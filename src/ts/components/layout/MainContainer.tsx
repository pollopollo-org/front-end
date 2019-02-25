import { observer } from "mobx-react";
import React from "react";

import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

type MainContainerProps = {
    /**
     * Contains a reference to the root store.
     */
    store: Store;
}

/**
 * The main container is responsible for wrapper all pages within it, while also
 * taking care of routing.
 */
@observer
class UnwrappedMainContainer extends React.Component<MainContainerProps> {
    /**
     * Main render method
     */
    public render(): JSX.Element {
        const { dummy } = this.props.store;
        return (
            <main>
                <p>Title: { dummy.title }</p>
                <p>UserId: { dummy.userId }</p>
                <p>Counter from store: { dummy.incrementingValue }</p>
            </main>
        );
    }
}

export const MainContainer = injectStore((store) => ({store}), UnwrappedMainContainer);
