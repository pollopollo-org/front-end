import React from "react";

import { fonts } from "src/ts/config";
import { colors } from "src/ts/config/colors";
import { Throbber } from "src/ts/components/utils/Throbber";

type ButtonProps = {
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
    width: number;

    /**
     * The heigth the button should have
     */
    heigth: number;

    /**
     * The font size to use for the text in the button
     */
    fontSize: number;

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
export const Button: React.SFC<ButtonProps> = ({withThrobber, text, width, heigth, fontSize, type, isPending, throbberSize, onClick }) => {
    return (
        <div>
            {withThrobber
                ? <button type={type} className={isPending ? "isPending" : ""} onClick={onClick}>
                    <span className="text">{text}</span>
                    <span className="throbber">
                    <Throbber size={throbberSize} relative={true} inverted={true} />
                    </span>
                </button>
                : <button>{text}</button>}

		    <style jsx>{`
                button {
                    /** Size */
                    width: ${width}px;
                    height: ${heigth}px;
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
                    cursor: pointer;
                    overflow: hidden;

                    & .throbber {
                        /**
                        * Position a throbber in the middle to be displayed
                        * while requests are ongoing
                        */
                        position: absolute;
                        left: calc(50% - 15px);
                        top: calc(50% - 15px);
                        opacity: 0;
                        overflow: hidden;
                        width: 140px;
                        height: 40px;
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
		</div>
    );
}
