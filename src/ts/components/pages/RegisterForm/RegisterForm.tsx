import React from "react";

/**
 * A page where the user can register for the project
 */
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

    /**
     * Literally rendering the component
     */
    public render(): JSX.Element {
        return(
            <div className="allSection">

                <h1 className="headerText">Register as new user</h1>
                <div>
                    <div className="nameAndCountrySection">
                        <input className="nameInput" placeholder="   Name"></input>
                        <input className="countryInput" placeholder="   Country"></input>
                    </div>
                    <div className="emailSection">
                        <input className="emailInput" placeholder="   email"></input>
                    </div>
                    <div className="passwordSection">
                        <input className="firstPasswordInput" placeholder="   Password"></input>
                        <input className="secondPasswordInput" placeholder="   Password, again"></input>
                    </div>
                    <div>
                        <div className="userTypeSection">
                            <label>
                                <input type="radio" className="userType" onClick={this.producerClick}/>
                                I am a producer
                            </label>
                            <label>
                                <input type="radio" className="userType" onClick={this.receiverClick}/>
                                I am a receiver
                            </label>
                        </div>
                    </div>
                    <div className="conditionalSection">
                        <div/>
                    </div>
                </div>


                <style jsx>{`
                    .headerText{
                        color: #8C489F;
                        margin: 30px auto;
                    }

                    input{
                        height: 30px;
                        width: 250px;
                        margin-right: 30px;
                    }

                    input.userType{
                        height: 17px;
                        width: 17px;
                        margin: 0px 10px;
                    }

                    .nameAndCountrySection{
                        margin: 20px auto;
                    }

                    .emailSection{
                        margin: 20px auto;
                    }

                    .passwordSection{
                        margin: 20px auto;
                    }

                    .userTypeSection{
                        margin: 20px auto;
                    }

                    .registerButton{
                        height: 30px;
                        width: 100px;
                    }

                    label{
                        font-size: 20px;
                        margin-right: 30px;
                    }

                    .allSection{
                        margin-left: 50px;
                    }

                `}</style>

            </div>
        );
    }

    /**
     * Handles radio button click to allow for conditional rendering
     */
    private producerClick(){
        this.setState({
            producer: true,
            receiver: false,
        });
    }

    /**
     * Handles radio button click to allow for conditional rendering
     */
    private receiverClick(){
        this.setState({
            producer: false,
            receiver: true,
        });
    }
}