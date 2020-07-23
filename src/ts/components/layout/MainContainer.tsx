import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { routes } from "src/ts/config/routes";


import { CreateProduct } from "src/ts/components/pages/CreateProduct/CreateProduct";
import { EditProfile } from "src/ts/components/pages/EditProfile/EditProfile";
import { WithdrawPage } from "src/ts/components/pages/WithdrawPage/WithdrawPage";
import { FrontPage } from "src/ts/components/pages/FrontPage/FrontPage";
import { LoginForm } from "src/ts/components/pages/LoginForm/LoginForm";
import { ProductsPage } from "src/ts/components/pages/ProductsPage/ProductsPage";
import { ApplicationsPage } from "src/ts/components/pages/ApplicationsPage/ApplicationsPage";
import { RegisterForm } from "src/ts/components/pages/RegisterForm/RegisterForm";
import { UserProfile } from "src/ts/components/pages/UserProfile/UserProfile";
import { CreateApplication } from "src/ts/components/pages/CreateApplication/CreateApplication";
import { NotFoundPage } from "src/ts/components/pages/NotFoundPage/NotFoundPage";
import { Footer } from "src/ts/components/layout/Footer/Footer";
import { observer } from "mobx-react";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Alert } from "src/ts/components/utils/Alert";
import AboutPage from "src/ts/components/pages/AboutPage/AboutPage";
import LoginOrRegisterPage from "src/ts/components/pages/LoginOrRegisterPage/LoginOrRegisterPage";
import { UserTypes } from "src/ts/models/UserModel";


type MainContainerProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouteComponentProps;

/**
 * The main container is responsible for wrapper all pages within it, while also
 * taking care of routing.
 */
@observer
export class UnwrappedMainContainer extends React.Component<MainContainerProps> {
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
                        {/* tslint:disable-next-line: react-this-binding-issue 
                            @ts-ignore*/}
                        <Route exact path={routes.registerProducer.path} render={() => <RegisterForm inferredUserType={UserTypes.PRODUCER} redirectPath={routes.productsPage.path}/>} />
                        {/* tslint:disable-next-line: react-this-binding-issue 
                            @ts-ignore*/}
                        <Route exact path={routes.registerReceiver.path} render={() => <RegisterForm inferredUserType={UserTypes.RECEIVER} redirectPath={routes.productsPage.path} />} />
                        <Route exact path={routes.profile.path} component={UserProfile} />
                        <Route exact path={routes.viewProfile.path} component={UserProfile} />
                        {/**<Route exact path={routes.login.path} component={LoginForm} /> */}
                        {/* tslint:disable-next-line: react-this-binding-issue 
                            @ts-ignore*/}
                        <Route exact path={routes.login.path} render={() => <LoginForm redirectPath={routes.root.path} />} />
                        {/* tslint:disable-next-line: react-this-binding-issue 
                            @ts-ignore*/}
                        <Route exact path={routes.loginRedirect.path} render={() => <LoginForm redirectPath={routes.productsPage.path} />} />
                        <Route exact path={routes.editProfile.path} component={EditProfile} />
                        <Route exact path={routes.withdrawBytes.path} component={WithdrawPage} />
                        <Route exact path={routes.createProduct.path} component={CreateProduct} />
                        <Route exact path={routes.productsPage.path} component={ProductsPage} />
                        <Route exact path={routes.applicationsPage.path} component={ApplicationsPage} />
                        <Route exact path={routes.CreateApplication.path} component={CreateApplication} />
                        <Route exact path={routes.aboutPage.path} component={AboutPage} />
                        {/* tslint:disable-next-line: react-this-binding-issue */}
                        <Route exact path={routes.loginOrRegisterProducer.path} render={() => <LoginOrRegisterPage userType={UserTypes.PRODUCER} />} />
                        {/* tslint:disable-next-line: react-this-binding-issue */}
                        <Route exact path={routes.loginOrRegisterReceiver.path} render={() => <LoginOrRegisterPage userType={UserTypes.RECEIVER} />} />
                        <Route path={routes.default404.path} component={NotFoundPage} />
                    </Switch>
                </main>

                <Footer />

                <Alert
                    active={!!this.props.store.currentErrorMessage}
                    text={this.props.store.currentErrorMessage}
                    onClose={this.closeAlert}
                />

                <style jsx>{`
                    main {
                        padding: 60px 10px 0;
                        flex-grow: 1;

                        /** Setup a max-width to avoid unnecessarily large items */
                        max-width: 1160px;
                        width: calc(100% - 20px);
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

    /**
     * Internal helper that closes the current alert when triggered
     */
    private closeAlert = () => {
        this.props.store.currentErrorMessage = "";
    }
}
export const MainContainer = withRouter(injectStore((store) => ({ store }), UnwrappedMainContainer));
