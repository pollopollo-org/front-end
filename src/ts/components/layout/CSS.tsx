import React from "react";

import { colors } from "src/ts/config/colors";
import { fonts } from "src/ts/config/fonts";

/**
 * Injects global stylesheet into the DOM.
 */
export const CSS: React.SFC = () => (
    <React.Fragment>
        <style jsx global>{`
            html,
            body {
                /** Reset margins and paddings */
                margin: 0;
                padding: 0;

                /** Fill up the viewport */
                box-sizing: border-box;
                min-width: 100%;
                min-height: 100%;

                /** Apply default background color */
                background-color: #fff;
            }

            body {
                /** Set up basic font */
                color: ${ colors.black };
                font-family: ${ fonts.tempFont };
                font-size: 16px;
                line-height: 1em;
            }

            h1 {
                font-size: 30px;
                color: ${ colors.primaryColor };
            }

            #root {
                /** Fill up the viewport */
                width: 100%;
                height: 100%;

                /** Use flexbox inside on the y-axis */
                display: flex;
                flex-direction: column;
            }

            * {
                /** Disable default touch-tap-highlight */
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

                /** Disable default outline on focus */
                outline: 0;
            }
        `}</style>
    </React.Fragment>
);
