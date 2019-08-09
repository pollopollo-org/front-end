import React from "react";
import { isProducerUser } from "src/ts/utils/verifyUserModel";
import { isNullOrUndefined } from "util";

import countriesJson from "src/assets/countries.json";
import profileJson from "src/assets/data/profile.json";

import { UserModel } from "src/ts/models/UserModel";
import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config";

type UserDescriptionProps = {
    /**
     * Contains all the information about the user that should be described
     */
    user?: UserModel;

    /**
     * Specifies whehter the rendered user is the user themself, which means
     * we should render wallet info if the user is also a producer
     */
    isSelf: boolean;
}

/**
 * Component responsible for rendering all information related to a user
 */
export class UserDescription extends React.PureComponent<UserDescriptionProps> {
    /**
     * Main render method
     */
    public render(): React.ReactNode {
        const { user } = this.props;

        if (!user) {
            return <h1>There is no user available for rendering</h1>;
        }

        const thumbnail = user.getThumbnail();

        return (
            <div className="information">
                <div className="content">
                    <div className="image">
                        {(isNullOrUndefined(thumbnail)
                            ? <i className="user">{getSVG("user2", { strokeColor: colors.primary })}</i>
                            : <img src={thumbnail} alt="" role="presentation" />)
                        }
                    </div>
                    <p><span className="bold">{profileJson.name}</span> {user.firstName} {user.surName}</p>
                    <p><span className="bold">{profileJson.country}</span> {this.extractCountry()}</p>
                    {user.email && <p><span className="bold">{profileJson.email}</span> {user.email}</p>}

                    {isProducerUser(user) && (
                        <div className="twoliner">
                            <p><span className="bold">{profileJson.address}</span> </p>
                            {isNullOrUndefined(user.street) || isNullOrUndefined(user.streetNumber) || isNullOrUndefined(user.city) 
                                ? <p><i>There is no address to show.</i></p> 
                                : isNullOrUndefined(user.zipcode) 
                                    ? <p>{user.street + user.streetNumber + ", " + user.city}</p> 
                                    : <p>{user.street + user.streetNumber + ", " + user.zipcode + user.city}</p>}
                        </div>
                    )}

                    <div className="twoliner">
                        <p><span className="bold">{profileJson.desc}</span> </p>
                        {isNullOrUndefined(user.description) ? <p><i>There is no description to show.</i></p> : <p>{user.description}</p>}
                    </div>

                    {isProducerUser(user) && this.props.isSelf && (
                        <div className="twoliner">
                            <p><span className="bold">{profileJson.wallet}</span> </p>
                            {isNullOrUndefined(user.wallet) ? <p><i>There is no wallet string to show.</i></p> : <p>{user.wallet}</p>}
                        </div>
                    )}
                </div>

                <style jsx>{`
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
                        overflow: hidden;

                        & img {
                            height: 100%;
                            width: 100%;
                            object-fit: cover;
                        }
                    }

                    .image i {
                        margin: auto;
                        display: block;
                        height: 70px;
                        width: 70px;
                        padding-top: 45px;
                    }

                    p {
                        margin: 15px 0;
                        line-height: 1.4;
                    } 

                    .bold {
                        font-weight: bold;
                        margin: 0;
                    }

                    /* A section of the information box where header and content are on different lines */
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

                    @media (max-width: 800px) {
                        /*
                         * Make the information box wide enough to fill the
                         * screen and center it.
                         */
                        .information {
                            max-width: 100%;
                            text-align: center;
                        }      

                        .twoliner p {
                            text-align: center;
                        }                  
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal helper that extracts the country of the user based on the users
     * country code
     */
    private extractCountry = () => {
        const user = this.props.user;

        if (!user) {
            return "Unknown";
        }

        const countryData = countriesJson.find((country) => country.Code === user.country);

        return countryData ? countryData.Name : "Unknown";
    }
}