import React from "react";

import { Chevron } from "src/ts/utils/Chevron";
import { Application } from "../../elements/Application/Application";

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
                <div className="list-of-applications">
                    <Application />
                </div>

                <Chevron size={20} lineWidthRatio={0.5} inversed={true} vertical={true}/>

                <style jsx>{`
                    h1 {
                        margin: 0;
                        line-height: 1;
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
