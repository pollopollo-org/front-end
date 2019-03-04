import React from "react";

import { getSVG } from "src/assets/svg";

import { colors } from "../../config/colors";

type ThrobberProps = {
    /**
     * Specifies the desired dimensions of the throbber in px's.
     *
     * Will fallback to 64px.
     */
    size?: number;
};

/**
 * Specifies the size in px that was used to create this throbber.
 * We use this to determine a scale to apply to the throbber in order to
 * ensure that all measurements will still be correct after the proper
 * dimensions are applied.
 */
const BASE_SIZE = 256;

/**
 * Component that'll render a simple throbber that can be used throughout the page
 */
export const Throbber: React.SFC<ThrobberProps> = ({ size = 64 }) => {
    // The scale is used to properly dimension the throbber at the desired size.
    // This is required since we use fixed px-values that result in perfect rendering
    // given the BASE_SIZE.
    const scale = size / BASE_SIZE;

    return (
        <span className="throbber">
            <i className="throbber__logo">
                { getSVG("logo") }
            </i>

            <style jsx>{`
                .throbber {
                    /**
                     * Force logo to be contained within the desired
                     * dimensions of the throbber.
                     */
                    position: relative;
                    display: block;
                    width: ${ BASE_SIZE }px;
                    height: ${ BASE_SIZE }px;

                    /** Translate to desired dimensions */
                    transform: scale(${scale});

                    /**
                     * Render the spinning circle positioned on top of the
                     * logo circle
                     */
                    &::before {
                        content: "";

                        /** Filll the whole throbber */
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;

                        /** Render the actual circle */
                        border: 8px solid #D1B7D9;
                        border-radius: 50%;

                        /**
                         * Color parts of the circle in another color to
                         * make rotation visible
                         *
                         */
                        border-left-color: ${colors.primary};

                        /** Visually indicate that things are happening! */
                        animation: spin 0.9s linear infinite;
                    }
                }

                @keyframes spin {
                    from { transform: rotate(0); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </span>
    );
}
