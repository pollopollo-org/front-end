import React from "react";

import { easings } from "src/ts/config";

type ChevronProps = {
    /**
     * Specifies if the chevron should inverse (e.g. to be used when selected)
     */
    inversed?: boolean;

    /**
     * Specifies if the chevron should be vertical (i.e. move up and down)
     */
    vertical?: boolean;

    /**
     * Specifies the length of the lines in the chevron, given in pixels.
     */
    size?: number;

    /**
     * Specifies the toggle transition duration, when the chevron is being
     * inversed.
     */
    inverseDuration?: number;

    /**
     * Specifies the ratio of which the line of the chevron itself
     * should be shrunk/enlarged in relation to the base width of 2px when size = 10px
     */
    lineWidthRatio?: number;
};

// tslint:disable-next-line variable-name
export const  Chevron: React.SFC<ChevronProps> = ({inversed, inverseDuration = 175, vertical, size = 10, lineWidthRatio = 1}) => {
    // Assume that chevron is rendered on a base size of 10px, and determine the required
    // scale to render it at the desired size.
    const scale = size / 10;

    return (
        <i className={`${ vertical ? "vertical" : "" } ${ inversed ? "inversed" : "" }`}>
            <style jsx>{`
                i {
                    /**
                     * Automatically center the chevron inside it's
                     * container.
                     */
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -7px;
                    margin-left: -5px;

                    /* Setup fixed dimensions */
                    width: 10px;
                    height: 14px;

                    /**
                     * Allow the pseudo child elements to inherit
                     * border-color from the parent elements
                     */
                    border-color: inherit;

                    /**
                     * Prepare inverse transition
                     * Fixes IE10/11 renderbug by offloading to GPU as well
                     */
                    transform: scale(${scale}) translate3d(1px, 0, 0);
                    transition: transform ${ inverseDuration }ms ${ easings.inOutCubic };

                    /**
                     * Use the pseudo :before and :after elements to render
                     * the lines in the chevron.
                     */
                    & ::before,
                    & ::after {
                        /** Force the elements to be rendered */
                        content: '';

                        /** Each line should be absolutely positioned */
                        position: absolute;
                        top: 6px;
                        right: 1px;

                        /** Setup dimensions */
                        width: 10px;
                        height: 0;

                        /** Render the line using border-top */
                        border-top-width: ${ lineWidthRatio * 2 }px;
                        border-top-style: solid;
                        border-top-color: inherit;

                        /**
                            * Prepare transitions between up / down and left /
                            * right
                            */
                        transition:
                            transform ${ inverseDuration }ms ${ easings.inOutCubic },
                            right ${ inverseDuration }ms ${ easings.inOutCubic },
                            border-color 0.1s linear;
                    }

                    /* Rotate one line clockwise */
                    & ::before {
                        transform: rotate(45deg);

                        /**
                         * Rotate from the right-most center point that will
                         * be shared between the two lines (ie. with an even
                         * 0.1 * size margin to either side).
                         */
                        transform-origin: ${ 10 - lineWidthRatio }px ${ lineWidthRatio }px;
                    }

                    /* ... And the other counter-clockwise */
                    & ::after {
                        transform: rotate(-45deg);

                        /**
                         * Rotate from the right-most center point that will
                         * be shared between the two lines (ie. with an even
                         * 0.1 * size margin to either side).
                         */
                        transform-origin: ${ 10 - lineWidthRatio }px ${ lineWidthRatio }px;
                    }
                }

                .vertical {
                    transform: scale(${scale}) rotate(90deg) translate3d(0.05em, 0, 0);
                }

                .inversed {
                    transform: scale(${scale}) translate3d(-6.5px, 0, 0);

                    & ::before {
                        transform: rotate(135deg);
                    }

                    & ::after {
                        transform: rotate(-135deg);
                    }
                }

                .inversed.vertical {
                    transform: scale(${scale}) rotate(90deg) translate3d(-6.5px, 0, 0);
                }
            `}</style>
        </i>
    );
};
