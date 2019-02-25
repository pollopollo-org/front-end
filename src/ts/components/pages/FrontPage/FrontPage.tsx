import React from "react";

import { Application } from "../../elements/Application/Application";
import { Footer } from "../../layout/Footer/Footer";
import { Header } from "../../layout/Header/Header";

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
                <Header />
                <div>
                    <h1>Welcome to Obyte!</h1>
                </div>

                
                <div className="list-of-applications">
                    <Application />
                </div>

                <Footer/>

                <style jsx>{`
                    h1{
                        font-size: 75%;
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
