import React from "react";
import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";
import countriesJson from "src/assets/countries.json";

type SelecterProps = {
    /**
     * List of elements to select from
     */
    countries?: string[];

    /**
     * Specifies the currently selected element
     */
    current?: string;

    /**
     * Allows us to extract the value out to the parent components
     * @param selected
     */
    onChange (selected:string): void;
}

/**
 * A select field for selecting an item from a specified list
 */
export class CountryFilter extends React.PureComponent<SelecterProps>{
    /**
     * Main rendering method used for rendering the component
     */
    public render(): JSX.Element {
        return (
            <div>
                <select
                    required
                    onChange={this.onSelect}
                    className={`${!this.props.current ? "inactive" : "active"}`}
                    value={this.props.current || ""}
                >
                    <option disabled value="" aria-selected={this.props.current === ""}>Select country</option>
                    <option value="ALL" aria-selected={this.props.current === "ALL"}>All countries</option>
                    {this.props.countries && <optgroup>
                        {this.props.countries.map((code) => {
                            let country = countriesJson.find(c => c.Code === code)
                            return (
                                <option 
                                    key={code} 
                                    value={code}
                                    aria-selected={this.props.current === code}
                                >
                                    {country ? country.Name : code}
                                </option>
                            );
                        }) }
                    </optgroup>}
                </select>
                <div className="dblarrow"><b></b><i></i></div>
                <style jsx>{`
                    select{
                        -webkit-appearance: none;
                        background-color: white;
                        background: transparent;
                        height: 43px;
                        width: 254px;
                        text-indent: 9px;
                        border: 1px solid ${ colors.pale };
                        border-radius: 5px;
                        font-size: 16px;
                        font-weight: 300;
                        font-family: ${ fonts.text };
                        margin-top: 20px;
                        cursor: pointer;
                        /*padding-right: 20px; Important*/
                        display: inline-block;
                    }

                    select.inactive {
                        color: #a7a7a7;
                    }

                    select.active {
                        color: ${ colors.black };
                    }

                    select:hover {
                        border-color: ${colors.secondary};
                    }

                    select:hover:disabled {
                        border-color: #cacaca;
                    }

                    select:disabled{
                        border-color: #cacaca;
                        background: #f2f2f2;
                        cursor: default;
                    }

                    /**
                     * Removes the "Select country" option from dropdown
                     */
                    option[value = ""][disabled] {
                        display: none;
                    }

                    .dblarrow {
                    margin-left: -14px;
                    display: inline-block;
                    }

                    .dblarrow b {
                        width: 0; 
                        height: 0; 
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-bottom: 6px solid #a7a7a7;
                        display: block;
                        margin-bottom: 3px;
                    }

                    .dblarrow i {
                        width: 0; 
                        height: 0; 
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 6px solid #a7a7a7;
                        display: block;
                    }               

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        select {
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 400px;
                        }
                    }
                `}</style>
            
            </div>
        );
    }

    /**
     * Method that'll get triggered every time a new country has been selected
     * in order to reflect this to the parent component
     */
    private onSelect = (evt: React.FormEvent<HTMLSelectElement>) => {
        this.props.onChange(evt.currentTarget.value);
    }
}
