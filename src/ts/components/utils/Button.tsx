import React from "react";

import { fonts } from "src/ts/config";
import { colors } from "src/ts/config/colors";
import { Throbber } from "src/ts/components/utils/Throbber";

type ButtonProps = {
    /**
     * Optionally supply an additonal className to our button
     */
    className?: string;

    /**
     * Should there be a throbber?
     */
    withThrobber: boolean;

    /**
     * The text to appear on the button
     */
    text: string;

    /**
     * The width the button should have
     */
    width: number | string;

    /**
     * The height the button should have
     */
    height?: number;

    /**
     * The font size to use for the text in the button
     */
    fontSize?: number;

    /**
     * What type should the button have?
     */
    type?: string;

    /**
     * The font size to use for the text in the button
     */
    isPending?: boolean;

    /**
     * The size the throbber should have
     */
    throbberSize?: number;

    /**
     * Optional function for onClick
     */
    onClick?(): void;

};

/**
 * Styled button to be used instead of html button tag
 */
export const Button: React.SFC<ButtonProps> = ({className, withThrobber, text, width, height, fontSize = 16, type, isPending, throbberSize, onClick }) => {
    const buttonWidth = typeof width === "number" ? `${width}px` : width;
    const buttonHeight = height ? `${height}px` : undefined;

    return (
        <React.Fragment>
            {withThrobber
                ? <button type={type} className={`${className} ${isPending ? "isPending" : ""}`} onClick={onClick}>
                    <span className="text">{text}</span>
                    <span className="throbber">
                    <Throbber size={throbberSize} relative={true} inverted={true} />
                    </span>
                </button>
                : <button type={type} className={className} onClick={onClick}>{text}</button>}

		    <style jsx>{`
                button {
                    /** Size */
                    width: ${buttonWidth};
                    height: ${buttonHeight};
                    padding: 10px 5px;

                    /** Colors */
                    background-color: ${ colors.secondary };
                    color: ${ colors.white };
                    transition: background-color 0.1s linear;

                    /** Border */
                    border: none;
                    border-radius: 2px;
                    
                    /** Font */
                    font-size: ${fontSize}px;
                    font-family: ${ fonts.text };
                    font-weight: 300;

                    /** Other */
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;

                    & .throbber {
                        /**
                        * Position a throbber in the middle to be displayed
                        * while requests are ongoing
                        */
                        position: absolute;
                        left: calc(50% - ${(throbberSize || 0) / 2}px);
                        top: calc(50% - ${(throbberSize || 0) / 2}px);
                        opacity: 0;
                        overflow: hidden;
                        width: ${throbberSize}px;
                        height: ${throbberSize}px;
                        pointer-events: none;

                        /**
                        * prepare transitions
                        */
                        transition: opacity 0.2s linear;
                    }

                    & .text {
                        opacity: 1;
                        transform: scale(1);

                        /**
                            * prepare transitions
                            */
                        transition: opacity 0.2s linear;
                    }

                    &.isPending .throbber {
                        opacity: 1;
                        transform: scale(1);
                    }

                    &.isPending .text {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                }

                button:hover {
                    background-color: ${ colors.primary };
                }
			`}</style>
		</React.Fragment>
    );
}
