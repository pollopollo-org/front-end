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
        return (
            <main>
                Is application ready????
                { this.props.store.didMount ? "ready" : "not-ready" }
            </main>
        );
    }
}

export const MainContainer = injectStore((store) => ({store}), UnwrappedMainContainer);
