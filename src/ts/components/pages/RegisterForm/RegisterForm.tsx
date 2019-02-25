import React from "react";

export class RegisterForm extends React.PureComponent{
    constructor(props: Readonly<{}>){
        super(props);
        this.producerClick = this.producerClick.bind(this);
        this.receiverClick = this.receiverClick.bind(this);
        this.state = {
            producer: false,
            receiver: false,
        };
    }
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
                            <label>
                                <input type="radio" name="userTypeProducer" onClick={this.producerClick}/>
                                I am a producer
                            </label>
                            <label>
                                <input type="radio" name="userTypeReceiver" onClick={this.receiverClick}/>
                                I am a receiver
                            </label>
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
    private producerClick(){
        this.setState({
            producer: true,
            receiver: false,
        });
    }
    private receiverClick(){
        this.setState({
            producer: false,
            receiver: true,
        });
    }
}