import React from "react";
import { Route, Switch } from "react-router-dom";

import { routes } from "src/ts/config/routes";

import { FrontPage } from "../pages/FrontPage/FrontPage";
import { RegisterForm } from "../pages/RegisterForm/RegisterForm";


/**
 * The main container is responsible for wrapper all pages within it, while also
 * taking care of routing.
 */
export class MainContainer extends React.PureComponent {
    /**
     * Main render method
     */
    public render(): JSX.Element {
        return (
            <main>
                <Switch>
                    <Route exact path={routes.root} component={FrontPage} />
                    <Route exact path={routes.register} component={RegisterForm} />
                </Switch>
            </main>
        );
    }
}
