import React from "react";

import { getSVG } from "src/assets/svg";
import { Chevron } from "src/ts/utils/Chevron";
// import { Application } from "../../elements/Application/Application";

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
                <h1>Welcome to PolloPollo!</h1>
                <p>Welcome to the official PolloPollo website.</p>

                <h1>Recent applications</h1>
                {/* <div className="list-of-applications">
                    <Application />
                </div> */}

                <Chevron size={20} lineWidthRatio={0.5} inversed={true} vertical={true}/>

                <i>
                    { getSVG("scrumwise") }
                </i>

                <style jsx>{`
                    h1 {
                        margin: 0;
                        line-height: 1;
                    }

                    i {
                        display: block;
                        width: 50px;
                        height: 50px;
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
