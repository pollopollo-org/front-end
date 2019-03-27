import { observer } from "mobx-react";
import React from "react";

import { Link, RouteComponentProps } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import { getSVG } from "src/assets/svg";
import { UserModel } from "src/ts/models/UserModel";
import { injectStore } from "src/ts/store/injectStore";
import { isProducerUser, isReceiverUser } from "src/ts/utils/verifyUserModel";

import { UserDescription } from "src/ts/components/elements/UserDescription/UserDescription";
import { fetchUser } from "src/ts/utils/fetchUser";
import userProfileJson from "src/assets/data/userProfile.json";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { ApplicationModel } from "src/ts/models/ApplicationModel";
import { Store } from "src/ts/store/Store";
import { Application } from "src/ts/components/elements/Application/Application";

export type UserProps = {
    /**
     * Contains a reference to the user model that should be rendered
     */
    store: Store;
} & RouteComponentProps;

export type UserState = {
    /**
     * Specifies the user to be rendered
     */
    renderedUser?: UserModel;

    /**
     * Specifies whehter the rendered user is the user him/herself, which means
     * we should render edit functionality etc.
     */
    isSelf: boolean;

    /**
     * Contains an array of products to be rendered if any
     */
    products?: ProducerModel[];

    /**
     * Contains an array of applications to be rendered if any
     */
    applications?: ApplicationModel[];
}

/**
 * A page where the user can see their profile
 */
@observer
export class UnwrappedUserProfile extends React.Component<UserProps, UserState>{
    /**
     * Setup initial state
     */
    public state: UserState = {
        isSelf: false,
        renderedUser: this.props.store.user,
    }

    /**
     * Determine if we should render a different user than self
     */
    public async componentDidMount(): Promise<void> {
        this.loadUser();
    }

    /**
     * Main render method, used to render ProfilePage
     */
    // tslint:disable-next-line max-func-body-length
    public render() : JSX.Element{
        const { renderedUser: user } = this.state;

        if (!user) {
            return <h1>There's no user available to be rendered!</h1>;
        }

        return (
            <div className="page">
                <div className="wrapper">
                    <div className="profile__information">
                        <div className="header">
                            <h1>{userProfileJson.profile}</h1>
                            {this.state.isSelf && (
                                <Link className="editProfile" to={routes.editProfile.path}>
                                    <i>
                                        {getSVG("edit")}
                                    </i>
                                </Link>
                            )}
                        </div>
                        {/* Information box */}
                        <UserDescription user={user} />
                    </div>
                    {/* List of the user's products/applications */}
                    <div className="list">
                        {isProducerUser(user) && (
                            <>
                                <h2>{this.state.isSelf ? userProfileJson.ownProducts : userProfileJson.othersProducts}</h2>
                                { this.renderProducts() }
                            </>
                        )}
                        {isReceiverUser(user) && (
                            <>
                                <h2>{this.state.isSelf ? userProfileJson.ownApplications : userProfileJson.othersApplications}</h2>
                                { this.renderApplications() }
                            </>
                            
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .page {
                        margin-bottom: 15px;
                        padding: 0 10px;
                    }

                    .wrapper {
                        display: flex;
                        justify-content: space-evenly;
                    }

                    .profile__information {
                        position: sticky;
                        top: 0;
                        height: min-content;

                        & :global(.information) {
                            max-height: calc(100vh - 120px);
                            overflow: auto;
                        }
                    }

                    h1 {
                        margin-top: 25px;
                        display: inline-block;
                    }

                    p {
                        margin: 15px 0;
                    }

                    h2 {
                        margin: 0;
                        margin-bottom: 15px;
                    }

                    /**
                     * List of user's products/applications,
                     * move down to align with information box
                     */
                    .list {
                        margin-top: 80px;
                        width: 50%;
                    }

                    /* Make more room for applications/products when the width is less than 820px */
                    @media only screen and (max-width: 820px) {
                        .information {
                            max-width: 300px;
                        }
                    }

                    /* For mobile phones */
                    @media only screen and (max-width: 690px) {
                        .page {
                            width: 100%;
                            margin: auto;
                            padding: 0;
                        }

                        /* Make products/applications appear beneath information */
						.wrapper {
                            width: 100%;
    						flex-direction: column;
                            justify-content: center;

						}

                        .header {
                            text-align: center;
                        }

                        h2 {
                            margin-top: 20px;
                        }

                        /* Make the list wide enough to fill the  screen. */
                        .list {
                            width: calc(100% - 20px);
                            padding: 10px;
                            margin: 0;
                        }
					}
                `}</style>
            </div>
        )
    }

    /**
     * Internal render method that'll render all products associated to a user
     */
    private renderProducts = () => {
        return (
            <h1>wutwut</h1>
        );
    }

    /**
     * Internal helper that'll load all products related to a user
     */
    private loadProducts = () => {

    }

    /**
     * Internal render method that'll render all applications associated to a user
     */
    private renderApplications = () => {
        // DISPLAY A THROBBER WHILE APPLICATIONS ARE LOADING!!!
        if (!this.state.applications) {
            return null;
        }

        return (this.state.applications.map((application, index) => {
            return <Application key={index} application={application} />;
        }));
    }

    /**
     * Internal helper that'll load all applications related to a user
     */
    private loadApplications = () => {
        console.log("HI");
        this.setState({ applications: this.props.store.applications });
    }

    /**
     * Internal method that'll load the user to be rendered within the application
     */
    private loadUser = async () => {
        // tslint:disable-next-line completed-docs
        const readonlyUserId = (this.props.match.params as { userId: string }).userId;
        let user: UserModel | undefined;

        // If we have a match on the route, that means we should attempt to 
        // render the given user in readonly mode
        if (readonlyUserId) {
            user = await fetchUser(readonlyUserId);

            this.setState({
                isSelf: false,
                renderedUser: user,
            });
        } else {
            user = this.props.store.user;

            // ... however, if we doesn't match, then we should render our own
            // user
            this.setState({ isSelf: true });
        }

        // Begin loading the desired additional data based on the user to display
        if (user && isReceiverUser(user)) {
            this.loadApplications();
        } else if (user && isProducerUser(user)) {
            this.loadProducts();
        }

    }
}

export const UserProfile = injectStore((store) => ({store}), UnwrappedUserProfile);
