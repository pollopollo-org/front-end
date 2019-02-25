import React from "react";

export class FrontPage extends React.Component{
    public render() : JSX.Element{
        return(
            <div>
                <h1>0byte</h1>

                <style jsx>{`
                    h1{
                        color: purple;
                        
                    }
                `}</style>
            </div>
        );    
    }
}