import { observer } from "mobx-react";
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import benefactors from "../../../assets/data/benefactors.json";

import { FrontPage } from "../pages/FrontPage/FrontPage";

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
                <p>Imported data: {benefactors.someKindOfFormat}</p>
                <p>Title: {dummy.title}</p>
                <p>UserId: {dummy.userId}</p>
                <p>Counter from store: {dummy.incrementingValue}</p>
                <FrontPage />

                <Router>
                    <Switch>

                    </Switch>

                </Router>
            </main>
        );
    }
}

export const MainContainer = injectStore((store) => ({store}), UnwrappedMainContainer);
