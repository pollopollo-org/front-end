import React from "react";
import { Link } from "react-router-dom";

import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config/colors";
import { routes } from "src/ts/config/routes";

/**
 * Header to be placed at the top of all pages
 */
export class Header extends React.PureComponent {

    /**
     * Main render method, used to render Header
     */
    public render(): JSX.Element {
        return (
            <div className="header">
                <i>
                    {getSVG("logo_full_inverted")}
                </i>

                <Link to={routes.root}>Root</Link>
                <Link to={routes.register}>Register</Link>
                <Link to={routes.profile}>Profile</Link>
                <Link to={routes.login}>Login</Link>

                <style jsx>{`

                    .header {
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 60px;
                        position: fixed;
                        display: flex;
                        flex-direction: row;
                        background-color: ${ colors.primary};
                        border-bottom: 1px solid ${ colors.primary};
                        z-index: 1000;
                    }

                    i {
                        margin-left: 10px;
                        width: 200px;
                        height: 60px;
                    }
                `}</style>
            </div>
        );
    }
}
