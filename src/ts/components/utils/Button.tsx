import React from "react";

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
                    background-color: ${ colors.secondaryColor };
                    color: ${ colors.white };
                    border: none;
                    border-radius: 12px;
                    padding: 12px 15px;
                    transition: background-color 0.1s linear;
                    font-size: 12px;
                }

                button:hover {
                    background-color: ${ colors.primaryColor };
                }
			`}</style>
		</div>
    );
}