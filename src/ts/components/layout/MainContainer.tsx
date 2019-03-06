import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { routes } from "src/ts/config/routes";

import { FrontPage } from "../pages/FrontPage/FrontPage";
import { RegisterForm } from "../pages/RegisterForm/RegisterForm";
import { InitialFade } from "../transitions/InitialFade";
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
                        <Route exact path={routes.root} component={FrontPage} />
                        <Route exact path={routes.register} component={RegisterForm} />
                    </Switch>

                </main>

                { this.renderFooter() }

                <style jsx>{`
                    main {
                        height: auto;
                        min-height: calc(100% - 299px);
                        padding: 60px 30px 0;

                        /** Setup a max-width to avoid unnecessarily large items */
                        max-width: 1160px;
                        width: 100%;
                        margin: 0 auto;

                        @media (max-width: 1100px) {
                            padding: 60px 0 0;
                            min-height: unset;
                        }
                    }

                    /** Containing the main page and the footer */
                    .main-container {

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


    /**
     * Renderer that'll render the footer of the application once content is
     * ready.
     */
	protected renderFooter(): React.ReactNode {
		return (
			<InitialFade key="footer">
				<Footer />
			</InitialFade>
		)
	}
}

export const MainContainer = withRouter(UnwrappedMainContainer);
