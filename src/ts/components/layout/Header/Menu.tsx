import React from "react";
import { RouterProps } from "react-router";
import { Link, withRouter } from "react-router-dom";
import { colors, easings, Route, routes } from "src/ts/config";

/**
 * Component responsible for rendering a menu that contains all available
 * navigation for the application
 */
class UnwrappedMenu extends React.Component<RouterProps> {
    /**
     * Ensure this component gets updated every time our history changes to ensure
     * that the active link is always related to the active one
     */
    public componentDidMount(): void {
        this.props.history.listen(() => {
            this.forceUpdate();
        })
    }

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
                        display: flex;
                    }

                    @media (max-width: 768px) {
                        nav {
                            /**
                             * Allow nav to fill viewport horizontally on mobile
                             * since we expand nav below header itself
                             */
                            position: relative;
                            height: auto;
                            width: 100%;
                            margin: 0;

                            /**
                             * Required to be able to calculate dimensions when
                             * toggling
                             */
                            flex-shrink: 0;
                        }

                        ul {
                            /** Display items below each other */
                            flex-direction: column;

                            & :global(> li) {
                                margin-bottom: 15px;
                                margin-right: 0;
                                text-align: center;
                            }

                            & :global(> li > a) {
                                text-align: center;
                            }
                        }
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

            const isActive = this.props.history.location.pathname === link.path;

            return (
                <li key={link.name} className={isActive ? "active" : ""}>
                    <Link to={link.path}>{link.name}</Link>
                    <span className="underline" />

                    <style jsx>{`
                        li {
                            /** Setup spacing between menu items */
                            position: relative;
                            margin-right: 10px;

                            &:last-of-type {
                                margin-right: 0;
                            }

                            & :global(> a) {
                                color: ${ colors.white };
                                text-decoration: none;
                            }

                            /**
                            * Render an underline that will be displayed when hovering
                            * the div by expanding form the middle out
                            */
                            & .underline {
                                /** Position below the userInfo itself */
                                position: absolute;
                                bottom: -5px;
                                left: 0;
                                right: 0;
                                height: 1px;

                                /** Render the lines that will expand on hover */
                                &::before,
                                &::after {
                                    /** Force rendering */
                                    content: "";
                                    position: absolute;

                                    /** Render the lines */
                                    height: 100%;
                                    background-color: ${ colors.whiteSmoke };
                                }

                                &::before {
                                    /** Position line in the middle by default */
                                    left: 50%;
                                    right: 50%;
                                    opacity: 0;

                                    /** Prepare transitions */
                                    transition: right 0.15s ${ easings.inOutQuart}, opacity 0.1s linear;
                                }

                                &::after {
                                    /** Position line in the middle by default */
                                    right: 50%;
                                    left: 50%;
                                    opacity: 0;

                                    /** Prepare transitions */
                                    transition: left 0.15s ${ easings.inOutQuart }, opacity 0.1s linear;
                                }
                            }

                            /** Prepare hover effect */
                            &:hover .underline::before,
                            &.active .underline::before {
                                right: 0;
                                opacity: 1;
                            }

                            &:hover .underline::after,
                            &.active .underline::after {
                                left: 0;
                                opacity: 1;
                            }
                        }
                    `}</style>
                </li>
            );
        });
    }
}

export const Menu = withRouter(props => <UnwrappedMenu {...props}/>);
