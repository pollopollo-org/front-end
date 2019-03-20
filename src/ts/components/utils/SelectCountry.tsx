import React from "react";
import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import Countries from "src/assets/countries.json";
import PrioritisedCountries from "src/assets/data/prioritisedCountries.json";

type SelectCountryProps = {
    /**
     * Specifies the currently selected country
     */
    currentCountry?: string;

    /**
     * Allows us to extract the value out to the parent components
     * @param country
     */
    onChange (country:string): void;
}

/**
 * A select field for selecting country of location
 */
export class SelectCountry extends React.PureComponent<SelectCountryProps>{
    /**
     * Main rendering method used for rendering the component
     */
    public render(): JSX.Element {
        return (
            <select
                required
                onChange={event => this.props.onChange(event.target.value)}
                className={`${!this.props.currentCountry ? "inactive" : "active"}`}
                value={this.props.currentCountry || ""}
            >
                <option disabled value="">Select country</option>
                <optgroup>
                    { PrioritisedCountries.map((country) => {
                        return (
                            <option key={country.Code} value={country.Code}>{country.Name}</option>
                        );
                    }) }
                </optgroup>
                <optgroup>
                    { Countries.map((country) => {
                        // Only render non-prioritised countries in this list
                        // (important countries has already been rendered)
                        if (PrioritisedCountries.findIndex((priority) => priority.Code !== country.Code)) {
                            return null;
                        }

                        return (
                            <option key={country.Code} value={country.Code}>{country.Name}</option>
                        );
                    }) }
                </optgroup>

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
                        margin: 15px 0;
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
}
