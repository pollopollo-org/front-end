import React from "react";
import { Link } from "react-router-dom";

import { getSVG } from "src/assets/svg";
import { easings, routes } from "src/ts/config";
import { colors } from "src/ts/config/colors";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";

type HeaderState = {
    /**
     * Specifies if the user has manually toggled navigation on / off yet (there
     * shouldn't be any transitions until he has!).
     */
    hasUserToggled: boolean;

    /** Specifies if the navigation layer is currently active */
    isContentToggled: boolean;

    /**
     * Specifies if we're currently in a mobile breakpoint
     */
    isMobile: boolean;

    /**
     * Specifies whether or not a transition is currently running
     */
    isTransitioning: boolean;
}

/**
 * Header to be placed at the top of all pages
 */
export class Header extends React.PureComponent<{}, HeaderState> {
    /** Setup initial state */
    public state: HeaderState = {
        hasUserToggled: false,
        isContentToggled: false,
        isMobile: false,
        isTransitioning: false,
    };

    /**
     * Contains a reference to the content ref
     */
    protected readonly contentRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Bind event listener to keep track of screen dimensions
     */
    public componentDidMount(): void {
        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("orientationchange", this.onResize);
    }

    /**
     * Cleanup on unmount
     */
    public componentWillUnMount(): void {
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("orientationchange", this.onResize);
    }

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

                <div className="content" ref={this.contentRef}>
                    <div className="content__children">
                        <Menu />
                        <UserInfo />
                    </div>
                </div>

                { this.state.isMobile && this.renderToggle() }

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

                    @media (max-width: 768px) {
                        .content {
                            /** Display content below header on mobile */
                            position: absolute;
                            top: 60px;
                            left: 0;
                            right: 0;

                            /** Render the content section properly */
                            background-color: ${ colors.primary };
                            padding: 0;

                            /** And ensure content is displayed below each other */
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            /** Prepare transitions */
                            overflow: hidden;
                            height: 0;
                            transition: height 0.375s ${ easings.inOutCubic }, padding 0.375s ${ easings.inOutCubic };

                            & .content__children {
                                opacity: 0;
                                transition: opacity 0.375s linear;
                            }
                        }
                    }
                `}</style>
            </div>
		);
    }

    /**
     * Internal helper that renders the toggle that'll be displayed on mobile
     * devices to display the content of the header.
     */
    protected renderToggle(): JSX.Element {
        return (
            <span role="button" className="toggle" onClick={this.toggleContent}>
                { this.renderBottomLine() }
                { this.renderMiddleLine() }
                { this.renderTopLine() }

                <style jsx>{`
                    .toggle {
                        /** Positoin toggle in the top-right of the header */
                        position: absolute;
                        right: 20px;
                        top: 20px;

                        /** Force proper dimensions of toggle */
                        width: 30px;
                        height: 20px;

                        /** Indicate that toggle is clickable */
                        cursor: pointer;
                    }
                `}</style>
            </span>
        );
    }

    /** Internal helper that renders the top line of the icon */
    protected renderTopLine(): JSX.Element {
        const { hasUserToggled } = this.state;

        return (
            <div className={this.state.isContentToggled ? "cross" : !hasUserToggled ? "" : "line"}>
                <style jsx>{`
                    div {
                        /** Render the single line of the menu-icon */
                        background-color: ${ colors.whiteSmoke};
                        width: 30px;
                        height: 3px;

                        /** Position the bottom part of the menu-icon */
                        position: absolute;
                        transform: translateY(0);
                    }

                    div.line {
                        animation: toLine 0.37s ${easings.inOutCubic};
                        animation-fill-mode: both;
                    }

                    div.cross {
                        animation: toCross 0.37s ${easings.inOutCubic};
                        animation-fill-mode: forwards;
                    }

                    @keyframes toLine {
                        0% {
                            transform: translateY(10px);
                            opacity: 0;
                        }

                        67% {
                            transform: translateY(10px);
                            opacity: 0;
                        }

                        67.1% {
                            transform: translateY(10px);
                            opacity: 1;
                        }

                        100% {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    @keyframes toCross {
                        0% {
                            transform: translateY(0);
                            opacity: 1;
                        }

                        33% {
                            transform: translateY(10px);
                            opacity: 1;
                        }

                        33.1% {
                            transform: translateY(10px);
                            opacity: 0;
                        }

                        100% {
                            transform: translateY(10px);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /** Internal helper that renders the middle line of the icon */
    protected renderMiddleLine(): JSX.Element {
        const { hasUserToggled } = this.state;

        return (
            <div className={this.state.isContentToggled ? "cross" : !hasUserToggled ? "" : "line"}>
                <style jsx>{`
                    div {
                        /** Render the single line of the menu-icon */
                        background-color: ${ colors.whiteSmoke };
                        width: 30px;
                        height: 3px;

                        /** Position the bottom part of the menu-icon */
                        position: absolute;
                        transform: translateY(10px);
                    }

                    div.line {
                        animation: toLine 0.37s linear;
                        animation-fill-mode: both;
                    }

                    div.cross {
                        animation: toCross 0.37s ${easings.inOutCubic};
                        animation-fill-mode: forwards;

                        /** Ensure the line doesn't overflow when rotated */
                        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                    }

                    @keyframes toLine {
                        0% {
                            transform: translateY(10px) rotate(135deg);
                        }

                        67% {
                            transform: translateY(10px) rotate(0deg);
                        }

                        100% {
                            transform: translateY(10px) rotate(0deg);
                        }
                    }

                    @keyframes toCross {
                        0% {
                            transform: translateY(10px) rotate(0deg);
                        }

                        33% {
                            transform: translateY(10px) rotate(0deg);
                        }

                        100% {
                            transform: translateY(10px) rotate(135deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    /** Internal helper that renders the bottom line of the icon */
    protected renderBottomLine(): JSX.Element {
        const { hasUserToggled } = this.state;

        return (
            <div className={this.state.isContentToggled ? "cross" : !hasUserToggled ? "" : "line"}>
                <style jsx>{`
                    div {
                        /** Render the single line of the menu-icon */
                        background-color: ${ colors.whiteSmoke };
                        width: 30px;
                        height: 3px;

                        /** Position the bottom part of the menu-icon */
                        position: absolute;
                        transform: translateY(20px);
                    }

                    div.line {
                        animation: toLine 0.37s ${easings.inOutCubic};
                        animation-fill-mode: both;
                    }

                    div.cross {
                        animation: toCross 0.37s ${easings.inOutCubic};
                        animation-fill-mode: forwards;

                        /** Ensure the line doesn't overflow when rotated */
                        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                    }

                    @keyframes toLine {
                        0% {
                            transform: translateY(10px) rotate(225deg);
                        }

                        67% {
                            transform: translateY(10px) rotate(0deg);
                        }

                        100% {
                            transform: translateY(20px) rotate(0deg);
                        }
                    }

                    @keyframes toCross {
                        0% {
                            transform: translateY(20px) rotate(0deg);
                        }

                        33% {
                            transform: translateY(10px) rotate(0deg);
                        }

                        100% {
                            transform: translateY(10px) rotate(225deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    /** Internal helper that toggles the navigation */
    protected toggleContent = () => {
        // Bail out if a transition is already running
        if (this.state.isTransitioning) {
            return;
        }

        const content = this.contentRef.current;

        // Bail out if content isn't available since we have no chance of opening
        // it in that case.
        if (!content) {
            return;
        }

        const childrenWrapper = content.firstChild as HTMLDivElement | null;

        // If children aren't availble either, then bail out as well since we
        // cannot complete the transition in that state.
        if (!childrenWrapper) {
            return;
        }

        // Update navigation state
        this.setState({
            isContentToggled: !this.state.isContentToggled,
            hasUserToggled: true,
            isTransitioning: true,
        }, () => {
            // If the content should be toggled, apply styles to display content
            if (this.state.isContentToggled) {
                content.style.height = `${content.scrollHeight}px`;
                content.style.padding = "10px 0";
                childrenWrapper.style.opacity = "1";

                // Once the animation has finished, then allow height to freely
                // set itself
                setTimeout(
                    () => {
                        content.style.height = "auto";
                    },
                    375,
                );
            } else {
                // ... else apply styles to hide content (while taking 20px padding
                // into account)
                content.style.height = `${content.scrollHeight - 20}px`;
                content.offsetHeight; // tslint:disable-line no-unused-expression

                content.style.padding = "0px";
                content.style.height = "0px";
                childrenWrapper.style.opacity = "0";
            }

            setTimeout(
                () => {
                    this.setState({ isTransitioning: false });
                },
                375,
            );
        });
    }

    /**
     * Internal listeners that'll get triggered every time the screen is resized
     * in order to keep track of the currently active breakpoint
     */
    protected onResize = () => {
        const content = this.contentRef.current;

        if (window.innerWidth > 768 && this.state.isMobile) {
            this.setState({
                hasUserToggled: false,
                isContentToggled: false,
                isMobile: false,
            });

            // When entering desktop view, remove all styles related to expand/collapse
            // of content
            if (content) {
                const childrenWrapper = content.firstChild as HTMLDivElement;
                content.style.padding = null;
                content.style.height = null;
                childrenWrapper.style.opacity = null;
            }
        } else if (window.innerWidth <= 768 && !this.state.isMobile) {
            this.setState({
                isContentToggled: false,
                isMobile: true,
            });

            // When entering mobile view, hide content by default
            if (content) {
                const childrenWrapper = content.firstChild as HTMLDivElement;
                content.style.padding = "0px";
                content.style.height = "0px";
                childrenWrapper.style.opacity = "0";
            }
        }
    }
}
