import React from "react";
import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

type SelecterProps = {
    /**
     * List of elements to select from
     */
    elements?: string[];

    /**
     * The text to display as default
     */
    defaultText: string;

    /**
     * The text to display for all option
     */
    allText: string;

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
export class Selecter extends React.PureComponent<SelecterProps>{
    /**
     * Main rendering method used for rendering the component
     */
    public render(): JSX.Element {
        return (
            <select
                required
                onChange={this.onSelect}
                className={`${!this.props.current ? "inactive" : "active"}`}
                value={this.props.current || ""}
            >
                <option disabled value="" aria-selected={this.props.current === ""}>{this.props.defaultText}</option>
                <option value="ALL" aria-selected={this.props.current === "ALL"}>{this.props.allText}</option>
                {this.props.elements && <optgroup>
                    { this.props.elements.map((element) => {
                        return (
                            <option 
                                key={element} 
                                value={element}
                                aria-selected={this.props.current === element}
                            >
                                {element}
                            </option>
                        );
                    }) }
                </optgroup>}

                <style jsx>{`
                    select{
                        -webkit-appearance: none;
                        background: transparent;
                        height: 43px;
                        width: 254px;
                        text-indent: 9px;
                        border: 1px solid ${ colors.pale };
                        border-radius: 3px;
                        font-size: 16px;
                        font-weight: 300;
                        font-family: ${ fonts.text };
                        margin-top: 20px;
                    }

                    select.inactive {
                        color: #a7a7a7;
                    }

                    select.active {
                        color: ${ colors.black };
                    }

                    /**
                     * Removes the "Select country" option from dropdown
                     */
                    option[value = ""][disabled] {
                        display: none;
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
            </select>
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
