import React from "react";

import { Application } from "../../elements/Application/Application";

import { colors } from "src/ts/config/colors";

/**
 * Frontpage
 */
export class FrontPage extends React.PureComponent{
    /**
     * Main render method, used to render Frontpage
     */
    public render() : JSX.Element{
        return(
            <div>
                <div>
                    <h1>Welcome to Obyte!</h1>
                </div>

                
                <div className="list-of-applications">
                    <Application />
                </div>

                <style jsx>{`
                    h1{
                        color: ${ colors.secondaryColor };
                    }

                    .list-of-application {

                        margin-left: auto;
                        margin-right: auto;

                    }
                `}</style>
            </div>
        );
    }
}
