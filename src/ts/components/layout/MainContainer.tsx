import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { routes } from "src/ts/config/routes";

import { FrontPage } from "../pages/FrontPage/FrontPage";
import { RegisterForm } from "../pages/RegisterForm/RegisterForm";


/**
 * The main container is responsible for wrapper all pages within it, while also
 * taking care of routing.
 */
export class UnwrappedMainContainer extends React.PureComponent<RouteComponentProps> {
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

                <style jsx>{`
                    main {
                        box-sizing: border-box;
                        height: 100%;
                        padding: 80px 30px;
                    }
                `}</style>
            </main>
        );
    }
}

export const MainContainer = withRouter(UnwrappedMainContainer);
