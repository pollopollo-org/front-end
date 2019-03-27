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

export type UserProps = {
    /**
     * Contains a reference to the user model that should be rendered
     */
    user: UserModel;
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
        renderedUser: this.props.user,
    }

    /**
     * Determine if we should render a different user than self
     */
    public async componentDidMount(): Promise<void> {
        // tslint:disable-next-line completed-docs
        const readonlyUserId = (this.props.match.params as { userId: string }).userId;

        // If we have a match on the route, that means we should attempt to 
        // render the given user in readonly mode
        if (readonlyUserId) {
            const user = await fetchUser(readonlyUserId);

            this.setState({
                isSelf: false,
                renderedUser: user,
            });
        } else {
            // ... however, if we doesn't match, then we should render our own
            // user
            this.setState({ isSelf: true });
        }
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
                    <div>
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
                            <h2>{this.state.isSelf ? userProfileJson.ownProducts : userProfileJson.othersProducts}</h2>
                        )}
                        {isReceiverUser(user) && (
                            <h2>{this.state.isSelf ? userProfileJson.ownApplications : userProfileJson.othersApplications}</h2>
                        )
                        }
                        {/* Dummy items for the list */}
                        <div className="item"></div>
                        <div className="item"></div>
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
                        margin-top: 63px;
                        width: 50%;
                    }

                    /* Dummy products/applications for list, replace later */
                    .item {
                        height: 90px;
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;
                        background-color: rgba(219,208,239, 0.15);
                        margin-top: 15px;
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

                        /*
                         * Make the information box wide enough to fill the
                         * screen and center it.
                         */
                        .information {
                            width: calc(100% - 20px);
                            max-width: 100%;
                            margin: 0 10px;
                            text-align: center;
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
}

export const UserProfile = injectStore((store) => ({user: store.user}), UnwrappedUserProfile);
