import React from "react";
import { Link } from "react-router-dom";
import { colors, Route, routes } from "src/ts/config";

/**
 * Component responsible for rendering a menu that contains all available
 * navigation for the application
 */
export class Menu extends React.PureComponent {
    /**
     * Main render method
     */
    public render(): JSX.Element {
        return (
            <nav>
                <ul>
                    {this.renderLinks()}
                </ul>

                <style jsx>{`
                    nav {
                        /** Allow nav to fill header */
                        position: absolute;
                        top: 0;
                        left: 0;

                        /** Setup dimensions of nav to match header */
                        height: 60px;

                        /**
                         * Nav should be centered in the header on desktop, without
                         * overflowing into the logo, hence we reduce dimensions
                         * accordingly
                         */
                        width: calc(100% - 450px);
                        margin: 0 225px;

                        /** Center routes within nav */
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    ul {
                        /** Override defaults */
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                    }
                `}</style>
            </nav>
        );
    }

    /**
     * Internal helper that renders all links available for the application
     */
    private renderLinks(): React.ReactNode {
        // Gather the routes available within the config
        const linkIdentifiers = Object.keys(routes);

        // ... and map them to usable link components
        return linkIdentifiers.map((linkIdentifier) => {
            const link = routes[linkIdentifier] as Route;

            // If a name isn't specfied, then that means that we should render
            // then link within the menu
            if (!link.name) {
                return null;
            }

            return (
                <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>

                    <style jsx>{`
                        li {

                            & :global(> a) {
                                color: ${ colors.white };
                                text-decoration: none;
                            }
                        }
                    `}</style>
                </li>
            );
        });
    }
}
