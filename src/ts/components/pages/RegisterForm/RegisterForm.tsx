import React from "react";

export class RegisterForm extends React.PureComponent{
    public render(): JSX.Element {
        return(
            <div>
                
                <h1 className="headerText">Register as new user</h1>
                <div>                    
                    <div className="nameAndCountrySection">
                        <input className="nameInput" placeholder="Name"></input>
                        <input className="countryInput" placeholder="Country"></input>
                    </div>
                    <div className="emailSection">
                        <input className="emailInput" placeholder="email"></input>
                    </div>
                    <div className="passwordSection">
                        <input className="firstpassword" placeholder="Password"></input>
                        <input className="secondPassword" placeholder="Password, again"></input>
                    </div>
                    <div>
                        <div className="userTypeSection">
                            <input type="radio" name="userType" value="producer"></input><label>I am a producer</label>
                            <input type="radio" name="userType" value="receiver"></input><label>I am a receiver</label>
                        </div>
                    </div>
                    <div className="conditionalSection">
                        <button className="registerButton">Register</button>
                    </div>
                </div>
            
            
                <style jsx>{`
                    .headerText{
                        
                    }

                    .nameAndCountrySection{

                    }

                    .emailSection{

                    }

                    .passwordSection{

                    }

                    .userTypeSection{

                    }

                `}</style>

            </div>
        );
    }
}