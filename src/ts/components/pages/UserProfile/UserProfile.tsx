import { observer } from "mobx-react";
import React from "react";

import { colors } from "src/ts/config/colors";

import { Link } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import profile from "src/assets/data/profile.json";

import { ProducerModel } from "src/ts/models/ProducerModel";
import { UserModel } from "src/ts/models/UserModel";
import { injectStore } from "src/ts/store/injectStore";

export type UserProps = {
    /**
     * Contains a reference to the user model that should be rendered
     */
    user: UserModel;
}

type UserProfileState = {
    /**
     * user type, producer or receiver
     */
    userType?: string;
}

/**
 * A page where the user can see their profile
 */
@observer
export class UnwrappedUserProfile extends React.PureComponent<UserProps, UserProfileState>{

    /**
     * The state of the component
     */
    public readonly state: UserProfileState = {};

    /**
     * Determine user type
     */
    public componentDidMount(): void {
        if(this.props.user instanceof ProducerModel) {
            this.setState({
                userType: "producer",
            });
        } else {
            this.setState({
                userType: "receiver",
            });
        }
    }

    /**
     * Main render method, used to render ProfilePage
     */
    public render() : JSX.Element{
        const { user } = this.props;
        return (
            <div className="page">
                <div className="wrapper">
                    <div>
                        <h1>Profile</h1>
                        {/* Information box */}
                        <div className="information">
                            <div className="content">
                                <img className="image" src={require("src/assets/dummy/sif.PNG")} />
                                <Link className="editProfile" to={routes.register}>{profile.edit}</Link>
                                <p><span className="bold">{profile.name}</span> {user.firstName} {user.surName}</p>
                                <p><span className="bold">{profile.country}</span> {user.country}</p>
                                <p><span className="bold">{profile.email}</span> {user.email}</p>
                                <div className="desc">
                                    <p><span className="bold">{profile.desc}</span> </p>
                                    <p>{user.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* List of the user's products/applications */}
                    <div className="list">
                        {this.state.userType==="producer" && (
                            <h2>Your products</h2>
                        )}
                        {this.state.userType==="receiver" && (
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
                    }

                    /* Box for user information */
                    .information {
                        padding: 10px 0;
                        max-width: 325px;
                        border-radius: 3px;
                        background-color: ${colors.pale};
                        color: ${colors.licorice};
                        
                    }

                    /* The content of the information box */
                    .content {
                        margin: 30px 50px;
                    }

                    /* Profile picture, centered within information box */
                    .image {
                        display: block;
                        height: 160px;
                        width: 160px;
                        border-radius: 50%;
                        border: 2px solid ${colors.primary};
                        margin: 0 auto;
                    }

                    /* Link to edit profile page, centered under image */
                    :global(.editProfile) {
                        text-align: center;
                        margin-top: 10px;
                        color: ${colors.primary};
                        display: block;
                        text-decoration: none;
                    }

                    :global(.editProfile):hover {
                        text-decoration: underline;
                    }

                    p {
                        margin: 15px 0;
                    }

                    /* Description part of information */
                    .desc {
                        margin-top: 25px;
                    }

                    /* Justify text and split words */
                    .desc p {
                        text-align: justify;
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

                    /* Dummy products for list of products, replace later */
                    .item {
                        height: 90px;
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;
                        background-color: rgba(219,208,239, 0.15);
                        margin-top: 15px;
                    }

                    @media only screen and (max-width: 690px) {
					/* For mobile phones: */
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

                        /** 
                         * Make the information box wide enough to fill the 
                         * screen and center it.
                         */
                        .information {
                            width: calc(100% - 20px);
                            max-width: 100%;
                            margin: 0 10px;
                            text-align: center;
                        }

                        .desc {
                            text-align: left;
                        }

                        h1 {
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