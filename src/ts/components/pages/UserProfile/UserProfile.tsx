import { observer } from "mobx-react";
import React from "react";

import { colors } from "src/ts/config/colors";

import { Link } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import profile from "src/assets/data/profile.json";

import { getSVG } from "src/assets/svg";
import { UserModel } from "src/ts/models/UserModel";
import { injectStore } from "src/ts/store/injectStore";
import { isProducerUser, isReceiverUser } from "src/ts/utils/verifyUserModel";

export type UserProps = {
    /**
     * Contains a reference to the user model that should be rendered
     */
    user: UserModel;
}

/**
 * A page where the user can see their profile
 */
@observer
export class UnwrappedUserProfile extends React.Component<UserProps>{
    /**
     * Main render method, used to render ProfilePage
     */
    public render() : JSX.Element{
        const { user } = this.props;

        return (
            <div className="page">
                <div className="wrapper">
                    <div>
                        <div className="header">
                            <h1>Profile</h1>
                            <Link className="editProfile" to={routes.editProfile.path}>
                                <i>
									{ getSVG("edit") }
								</i>
                            </Link>
                        </div>
                        {/* Information box */}
                        <div className="information">
                            <div className="content">
                                <img className="image" src={require("src/assets/dummy/sif.PNG")} />
                                <p><span className="bold">{profile.name}</span> {user.firstName} {user.surName}</p>
                                <p><span className="bold">{profile.country}</span> {user.country}</p>
                                <p><span className="bold">{profile.email}</span> {user.email}</p>
                                <div className="twoliner">
                                    <p><span className="bold">{profile.desc}</span> </p>
                                    <p>{user.description}</p>
                                </div>

                                    {isProducerUser(user) && (
                                        <div className="twoliner">
                                            <p><span className="bold">{profile.wallet}</span> </p>
                                            <p>{user.wallet}</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    {/* List of the user's products/applications */}
                    <div className="list">
                        {isProducerUser(user) && (
                            <h2>Your products</h2>
                        )}
                        {isReceiverUser(user) && (
                            <h2>Your applications</h2>
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

                    /* Box for user information */
                    .information {
                        padding: 10px 0;
                        max-width: 350px;
                        border-radius: 3px;
                        background-color: ${colors.pale};
                        color: ${colors.licorice};

                    }

                    /* The content of the information box */
                    .content {
                        margin: 20px 50px;
                    }

                    /* Profile picture, centered within information box */
                    .image {
                        display: block;
                        height: 160px;
                        width: 160px;
                        border-radius: 50%;
                        border: 2px solid ${colors.primary};
                        margin: 0 auto;
                        margin-bottom: 25px;
                    }

                    /* Link to edit profile page, centered under image */
                    :global(.editProfile) {
                        margin-top: 30px;
                        color: ${colors.primary};
                        text-decoration: none;
                        display: inline-block;
                    }

                    :global(.editProfile):hover {
                        color: ${colors.secondary};
                    }

                    i {
                        & :global(> span > svg) {
                            width: 24px;
                            margin-left: 5px;
                            /* Allign with h1 */
                            margin-bottom: -2px;
                        }
                    }

                    p {
                        margin: 15px 0;
                    }

                    /* A section of the information box where header and content are on diferent lines */
                    .twoliner {
                        margin-top: 25px;
                    }

                    /* Justify text and split words */
                    .twoliner p {
                        text-align: left;
                        line-height: 1.3;
                        margin: 5px 0 0 0;
                        -webkit-hyphens: auto;
                        -moz-hyphens: auto;
                        -ms-hyphens: auto;
                        hyphens: auto;
                    }

                    .bold {
                        font-weight: bold;
                        margin: 0;
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
