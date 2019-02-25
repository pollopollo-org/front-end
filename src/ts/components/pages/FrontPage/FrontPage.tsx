import React from "react";
import { Footer } from '../../layout/Footer/Footer';
import { Header } from '../../layout/Header/Header';

export class FrontPage extends React.Component{
    public render() : JSX.Element{
        return(
            <div>
                <Header />
                <div>
                    <h1>0byte</h1>
                </div>
                <div className="list-of-applications">
                    
                </div>

                <Footer/>

                <style jsx>{`
                    h1{
                        color: purple;
                        
                    }
                `}</style>
            </div>
        );    
    }
}