import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { routes } from "src/ts/config/routes";

import { CreateProduct } from "../pages/CreateProduct/CreateProduct";
import { EditProfile } from "../pages/EditProfile/EditProfile";
import { FrontPage } from "../pages/FrontPage/FrontPage";
import { LoginForm } from "../pages/LoginForm/LoginForm";
import { RegisterForm } from "../pages/RegisterForm/RegisterForm";
import { UserProfile } from "../pages/UserProfile/UserProfile";
import { Footer } from "./Footer/Footer";

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

            <div className="main-container">
                <main>
                    <Switch>
                        <Route exact path={routes.root.path} component={FrontPage} />
                        <Route exact path={routes.register.path} component={RegisterForm} />
                        <Route exact path={routes.profile.path} component={UserProfile} />
                        <Route exact path={routes.viewProfile.path} component={UserProfile} />
                        <Route exact path={routes.login.path} component={LoginForm} />
                        <Route exact path={routes.editProfile.path} component={EditProfile} />
                        <Route exact path={routes.createProduct.path} component={CreateProduct} />
                    </Switch>
                </main>

                <Footer />

                <style jsx>{`
                    main {
                        padding: 60px 0 0;
                        flex-grow: 1;

                        /** Setup a max-width to avoid unnecessarily large items */
                        max-width: 1160px;
                        width: 100%;
                        margin: 0 auto;
                    }

                    /** Containing the main page and the footer */
                    .main-container {
                        display: flex;
                        flex-direction: column;

                        /**
                        *  To make sure that footer is always at the bottom, make
                        *  that the height is at minimun full screen
                        */
                        min-height: 100vh;
                    }
                `}</style>
            </div>

        );
    }
}

export const MainContainer = withRouter(UnwrappedMainContainer);
