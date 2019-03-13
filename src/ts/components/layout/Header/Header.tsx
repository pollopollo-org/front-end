import React from "react";
import { Link } from "react-router-dom";

import { getSVG } from "src/assets/svg";
import { routes } from "src/ts/config";
import { colors } from "src/ts/config/colors";
import { Menu } from "./Menu";

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
                <Link to={routes.root.path}>
                    <i>
                        {getSVG("logo_full_inverted")}
                    </i>
                </Link>

                <Menu />

                <style jsx>{`

                    .header {
                        /** Fixate header on top of the viewport */
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 1000;

                        /** Setup dimensions of header */
                        width: 100%;
                        height: 60px;

                        /**
                         * Ensure content within is positioned properly in relation
                         * to each other
                         */
                        display: flex;
                        flex-direction: row;

                        /** Render header */
                        background-color: ${ colors.primary };
                    }

                    i {
                        /** Render PolloPollo logo in desired dimensions */
                        display: block;
                        margin-left: 10px;
                        width: 200px;
                        height: 60px;

                        /** Position on top of menu */
                        position: relative;
                        z-index: 2;
                    }
                `}</style>
            </div>
		);
	}
}
