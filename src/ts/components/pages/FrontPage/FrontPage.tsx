import React from "react";


import { colors } from "src/ts/config/colors";


/**
 * Frontpage
 */
export class FrontPage extends React.Component{


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

                </div>

                <style jsx>{`
                    h1{
                        font-size: 75%;
                        color: ${ colors.secondaryColor };
                    }
                `}</style>
            </div>
        );
    }
}
