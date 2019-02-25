import React from "react";
import { Footer } from '../../layout/Footer/Footer';
import { Header } from '../../layout/Header/Header';

import { colors } from 'src/ts/config/colors';


/**
 * Frontpage 
 */
export class FrontPage extends React.Component{
    public render() : JSX.Element{
        return(
            <div>
                <Header />
                <div>
                    <h1>Welcome to Obyte!</h1>
                </div>

                <div className="list-of-applications">
                    
                </div>

                <Footer/>

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