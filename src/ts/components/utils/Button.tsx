import React from "react";

import { colors } from "src/ts/config/colors";

type ButtonProps = {
    /**
     * Temp Sif
     */
    text: string;
};

export const Button: React.SFC<ButtonProps> = ({ text }) => {
    return (
        <div>
            <button>{text}</button>

		    <style jsx>{`
                button {
                    background-color: ${ colors.secondary };
                    color: ${ colors.white };
                    border: none;
                    padding: 10px 25px;
                    transition: background-color 0.1s linear;
                    font-size: 12px;
                    cursor: pointer;
                }

                button:hover {
                    background-color: ${ colors.primary };
                }
			`}</style>
		</div>
    );
}
