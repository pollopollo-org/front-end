import React from "react";
import { colors, fonts} from "src/ts/config";
import { getSVG } from "src/assets/svg";

type UserLinkProps = {
    /**
     * Method to be called upon closing the lightbox
     */
    onClick(): void;

    /**
     * The text to display as the link
     */
    text: string;
}

/**
 * Component responsible for rendering a link to a user description
 */
export class UserLink extends React.PureComponent<UserLinkProps> {
    /**
     * Main render method
     */
    public render(): React.ReactNode {
        return(
            <button 
                className="profile-link"
                onClick={this.props.onClick}
            >
                <i className="user-icon">{getSVG("user2")}</i> 
                {this.props.text}

                <style jsx>{`

                    /** Button to producers profile */
                    .profile-link {
                        /** Positioning the icon and button text horizontally */
                        display: flex;
                        flex-direction: row;

                        /** Colors and fonts */
                        background-color: transparent;
                        font-style: bold;
                        font-family: ${ fonts.text };

                        /** Size and border */
                        border: none;
                        border-radius: 5px;
                        padding: 10px;

                        /** Setup effects when hover */
                        transition: background-color 0.1s linear;
                        cursor: pointer;
                    }

                    .profile-link:hover {
                        background-color: rgba(219,208,239,0.5);
                    }

                    /** User icon placed in button */
                    .profile-link i {
                        height: 17px;
                        width: 17px;

                        color: ${ colors.primary };

                        /** Some space between icon and button text */
                        margin-right: 5px;
                    }
                `}</style>
            </button>
        );
    }
}