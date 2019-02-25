import { observer } from "mobx-react";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { routes } from "src/ts/config/routes";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";

import benefactors from "../../../assets/data/benefactors.json";

import { FrontPage } from "../pages/FrontPage/FrontPage";
import { RegisterForm } from "../pages/RegisterForm/RegisterForm";


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

                <Switch>
                    <Route exact path={routes.root} component={FrontPage} />
                    <Route exact path={routes.register} component={RegisterForm} />
                </Switch>
            </main>
        );
    }
}

export const MainContainer = injectStore((store) => ({store}), UnwrappedMainContainer);
