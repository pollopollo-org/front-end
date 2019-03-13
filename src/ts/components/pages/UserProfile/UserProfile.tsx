import React from "react";
import { colors } from "src/ts/config/colors";

import { Link } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import profile from "src/assets/data/profile.json";

type UserProfileState = {
    /**
     * user type, producer or receiver
     */
    userType: string;
}

/**
 * A page where the user can see their profile
 */
export class UserProfile extends React.PureComponent<{}, UserProfileState>{
    constructor(props:any){
        super(props);
        this.state={
            userType: "receiver",
        };
    }

    /**
     * Main render method, used to render ProfilePage
     */
    public render() : JSX.Element{
        return (
            <div className="page">
                <div className="wrapper">
                    <div className="left">
                        <h1>Profile</h1>
                        <div className="information">
                            <div className="content">
                                <img className="image" src={require("src/assets/dummy/sif.PNG")} />
                                <Link className="editProfile" to={routes.register}>{profile.edit}</Link>
                                <p><span className="bold">{profile.name}</span> Sif Kristensen</p>
                                <p><span className="bold">{profile.country}</span> Denmark</p>
                                <p><span className="bold">{profile.email}</span> sikr@itu.dk</p>
                                <div className="desc">
                                    <p><span className="bold">{profile.desc}</span> </p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ligula urna, condimentum quis tempus ut, pharetra eu eros. Nulla sed turpis nisi. Vivamus viverra finibus nisl, ut varius dolor lobortis id. Curabitur ullamcorper libero id justo interdum eleifend. Suspendisse aliquet sem id nisi iaculis vehicula. Ut ut porttitor elit. Aenean maximus elit id consequat sagittis. Etiam et augue dui.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="products">
                        {this.state.userType==="producer" && (
                            <h2>Your products</h2>
                        )}
                        {this.state.userType==="receiver" && (
                            <h2>Your applications</h2>
                        )
                        }
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

                    /* Link to edit profile page */
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

                    /* Profile picture */
                    .image {
                        display: block;
                        height: 160px;
                        width: 160px;
                        border-radius: 50%;
                        border: 2px solid ${colors.primary};
                        margin: 0 auto;
                    }

                    /* List of user's products */
                    .products {
                        margin-top: 63px;
                        width: 50%;
                    }

                    /* Dummy products for list of products */
                    .item {
                        height: 90px;
                        border: 1px solid rgba(139,72,156, 0.15);
                        border-radius: 2px;
                        background-color: rgba(219,208,239, 0.15);
                        margin-top: 15px;
                    }

                    h2 {
                        margin: 0;
                        margin-bottom: 15px;
                    }

                    @media only screen and (max-width: 666px) {
					/* For mobile phones: */
                        .page {
                            width: 100%;
                            margin: auto;
                            padding: 0;
                        }

						.wrapper {
                            width: 100%;
    						flex-direction: column;
                            justify-content: center;
                            
						}

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

                        .products {
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