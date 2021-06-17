import React from "react";
import { UserModel } from "src/ts/models/UserModel";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { UserDescription } from "src/ts/components/elements/UserDescription/UserDescription";
import { Chevron } from "src/ts/components/utils";
import { colors, fonts, routes } from "src/ts/config";
import { DonorModel } from "src/ts/models/DonorModel";

type UserLightboxProps = {
    /**
     * Should the lightbox be shown?
     */
    showLightbox: boolean;

    /**
     * Method to be called upon closing the lightbox
     */
    onClose(): void;

    /**
     * The user to display information about
     */
    user: UserModel | DonorModel;

    /**
     * Does the application/product belong to the user themself
     */
    isOwn: boolean;

    /**
     * Are we currently on the profile of the user the application/product belongs to?
     */
    isOnProfile: boolean;

    /**
     * The id of the user who's profile we want to display
     */
    userId: number;

    /**
     * The type of user who's profile we are displaying
     * Used in text
     */
    userType: string;
}

/**
 * Component responsible for rendering a lightbox with user description
 */
export class UserLightbox extends React.PureComponent<UserLightboxProps> {
    /**
     * Main render method
     */
    public render(): React.ReactNode {
        return (
            <Lightbox active={this.props.showLightbox} onClose={this.props.onClose}>
                <UserDescription user={this.props.user} isSelf={this.props.isOwn}/>
                { !this.props.isOnProfile && (
                    <div>
                        <a
                            href={routes.viewProfile.path.replace(":userId", String(this.props.userId))}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="chevron">
                                <Chevron />
                            </span>
                            <span className="text">Go to {this.props.userType} profile</span>
                        </a>
                    </div>                    
                )}

                <style jsx>{`
                    div {
                        /** Setup dimensions that match the userDescription */
                        padding: 0 50px 30px;
                        background-color: ${ colors.pale };
                    }    

                    a {
                        /** Setup font */
                        font-size: 14px;
                        color: ${ colors.black };
                        font-family: ${ fonts.text };
                        font-weight: 300;
                        text-decoration: none;

                        /** Ensure chevron and text is vertically aligned */
                        display: flex;
                        align-items: center;

                        &:hover {
                            text-decoration: underline;
                        }
                    }

                    .chevron {
                        /** Setup dimensions in which the chevron fits */
                        display: block;
                        position: relative;
                        width: 14px;
                        height: 10px;

                        /** Setup spacing between chevron and text */
                        margin-right: 5px;
                    }

                    .userDesc {
                        & :global(.information) {
                            width: 100%;
                            margin: 0;
                        }

                    }
                `}</style>
            </Lightbox>
        );
    }
}