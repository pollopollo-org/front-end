import React from "react";
import { colors } from "src/ts/config/colors";

import { Link } from "react-router-dom";
import { routes } from "src/ts/config/routes";

import profile from "src/assets/data/profile.json";

/**
 * A page where the user can see their profile
 */
export class ProducerProfile extends React.PureComponent<{}>{
    /**
     * Main render method, used to render ProfilePage
     */
    public render() : JSX.Element{
        return (
            <div className="page">
                <h1>Profile</h1>
                <div className="wrapper">
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

                    <div className="products">
                        <h2>Your products</h2>
                        <div className="item"></div>
                        <div className="item"></div>
                    </div>
                </div>

                <style jsx>{`
                    .page {
                        margin: auto;
                        margin-bottom: 15px;
                        width: 900px;
                        justify-content: center;
                        height: 100%;
                        box-sizing: border-box;
                    }

                    .wrapper {
                        display: flex;
                        justify-content: space-between;
                    }

                    .information {
                        max-width: 300px;
                        width: 300px;
                        border-radius: 3px;
                        background-color: ${colors.pale};
                        color: ${colors.licorice};
                        text-align: justify;
                    }

                    .content {
                        margin: 30px 50px;
                    }

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

                    .desc {
                        margin-top: 25px;
                    }

                    .desc p {
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

                    .image {
                        display: block;
                        height: 160px;
                        width: 160px;
                        border-radius: 50%;
                        border: 2px solid ${colors.primary};
                        margin: 0 auto;
                    }

                    .products {
                        width: 500px;
                        padding-right: 10px;
                    }

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
                            
                        }

						.wrapper {
                            width: 100%;
    						flex-direction: column;
                            justify-content: center;
                            margin: 10px;
						}

                        .information {
                            width: 100%;
                            padding: 0;
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
                            width: 100%;
                        }

					}

                `}</style>
            </div>
        )
    }
}


