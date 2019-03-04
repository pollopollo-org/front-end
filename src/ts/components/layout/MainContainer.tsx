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
                        height: auto;
                        padding: 60px 30px 0;

                        /** Setup a max-width to avoid unnecessarily large items */
                        max-width: 1160px;
                        width: 100%;
                        margin: 0 auto;

                        @media (max-width: 768px) {
                            padding: 60px 0 0;
                        }
                    }
                `}</style>
            </main>
        );
    }
}

export const MainContainer = withRouter(UnwrappedMainContainer);
