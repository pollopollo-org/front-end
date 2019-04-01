import React from "react";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { colors } from "src/ts/config";

type DialogProps = {
    /**
     * The title to appear in the dialog
     */
    title: string;

    /**
     * The text to appear in the description of the dialog
     */
    text: string;

    /**
     * Determine whether this should open or not
     */
    active: boolean;

    /**
     * Callback to be executed once the dialog should be closed
     */
    onClose(): void;

    /**
     * Callback to be executed if dialog has been confirmed
     */
    confirmAction(): void;
};

type DialogState = {
    /**
     * Specifies whether the product should be rendered to be compatible with
     * smaller viewports
     */
    isSmall: boolean;
}

/**
 * Renders a dialog to confirm or cancel an action
 */
export class Dialog extends React.PureComponent<DialogProps, DialogState> {

    /**
     * State of the component
     */
    public state: DialogState = {
        isSmall: false
    };

    /**
     * Main render method, used to render Dialog
     */
    render(): JSX.Element {
        return(
            <React.Fragment>
                { this.renderDialogLightbox() }
            </React.Fragment>
        );
    }

    /**
     * Renders the dialog box itself
     */
    private renderDialogLightbox() {

        return(
            <Lightbox active={ this.props.active } onClose={ this.props.onClose }>
                <div className={`dialog ${this.state.isSmall ? "isSmall" : ""}`}>
                    <h3>{ this.props.title }</h3>
                    <p>{ this.props.text }</p>
                    <div className="dialog-buttons">
                        <button className="confirm" onClick={ this.props.confirmAction }>Confirm</button>
                        <button className="cancel" onClick={ this.props.onClose }>Cancel</button>
                    </div>
                </div>
                

                <style jsx>{`
                    .dialog {
                        margin: 10px 20px;
                        width: max-content;
                        max-width: 500px;

                        @media (max-width: 440px) {
                            line-height: 1.3em;
                            max-width: calc(100% - 40px);
                            text-align: center;
                        }
                    }
                    
                    .dialog-buttons {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                    }

                    .dialog button {
                        padding: 7px;
                        margin: 5px;

                        width: 50%;

                        border: none;
                        border-radius: 2px;

                        cursor: pointer;
                    }

                    .dialog .confirm {
                        color: ${ colors.white };
                        background-color: ${ colors.secondary };

                        &:hover {
                            background-color: ${ colors.primary };
                        }
                    }

                    .dialog .cancel {
                        background-color: ${ colors.whiteSmoke };
                        border: 1px solid rgba(167,167,167, 0.2);

                        &:hover {
                            background-color: rgba(167,167,167, 0.2);
                        }
                    }

                `}</style>
            </Lightbox>
        );
    }   
}
