import React from "react";

import { fonts } from "src/ts/config";
import { colors } from "src/ts/config/colors";

type ButtonProps = {
    /**
     * The text to appear on the button
     */
    text: string;
};

/**
 * Styled button to be used instead of html button tag
 */
export const Button: React.SFC<ButtonProps> = ({ text }) => {
    return (
        <div>
            <button>{text}</button>

		    <style jsx>{`
                button {
                    width: 110px;
                    background-color: rgba(139, 72, 156, 0.9);
                    color: ${ colors.white };
                    border: none;
                    border-radius: 2px;
                    padding: 10px 5px;
                    transition: background-color 0.1s linear;
                    font-size: 12px;
                    font-family: ${ fonts.text };
                    font-weight: 300;
                    cursor: pointer;
                }

                button:hover {
                    background-color: ${ colors.primary };
                }
			`}</style>
		</div>
    );
}
