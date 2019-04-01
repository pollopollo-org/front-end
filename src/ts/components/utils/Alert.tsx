import React from "react";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { colors, fonts } from "src/ts/config";

type AlertProps = {
    /**
     * The text to appear in the description of the alert
     */
    text: string;

    /**
     * Determine whether this should open or not
     */
    active: boolean;

    /**
     * Callback to be executed once the alert should be closed
     */
    onClose(): void;
};

type AlertState = {
    // nothing here
}

/**
 * Alert hehe
 */
export class Alert extends React.PureComponent<AlertProps, AlertState> {

    /**
     * Main render method, used to render Alert
     */
    render(): JSX.Element {
        return(
            <React.Fragment>
                { this.renderAlertLightbox() }
            </React.Fragment>
        );
    }

    /**
     * Renders the Alert box itself
     */
    private renderAlertLightbox() {

        return(
            <Lightbox active={ this.props.active } onClose={ this.props.onClose }>
                <div className="alert">
                    <div>{ this.props.text }</div>
                    <button className="ok" onClick={ this.props.onClose }>Ok</button>
                </div>

                <style jsx>{`
                    .alert {
                        margin: 10px 20px;
                        width: max-content;
                        max-width: 500px;
                        text-align: center;
                        font-style: ${ fonts.text };

                        @media (max-width: 600px) {
                            line-height: 1.3em;
                            max-width: calc(100% - 40px);
                        }
                    }

                    .alert div {
                        margin: 25px 10px;
                    }

                    .alert button {
                        padding: 12px;
                        margin: 5px;

                        width: 150px;

                        border: none;
                        border-radius: 2px;

                        cursor: pointer;
                    }

                    .alert .ok {
                        color: ${ colors.white };
                        background-color: ${ colors.secondary };

                        &:hover {
                            background-color: ${ colors.primary };
                        }
                    }

                `}</style>
            </Lightbox>
        );
    }   
}
