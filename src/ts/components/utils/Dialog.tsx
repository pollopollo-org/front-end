import React from "react";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { colors } from "src/ts/config";
import { Button } from "src/ts/components/utils/Button";

type DialogProps = {
    /**
     * The title to appear in the dialog
     */
    title: string;

    /**
     * The text to appear in the description of the dialog
     */
    text: React.ReactNode;

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
     * Specifies whether or not the confirm request is currently being processed
     */
    isConfirming: boolean;
}

/**
 * Renders a dialog to confirm or cancel an action
 */
export class Dialog extends React.PureComponent<DialogProps, DialogState> {

    /**
     * State of the component
     */
    public state: DialogState = {
        isConfirming: false,
    };

    /**
     * Ensure that isConfirming state is reset once the dialog closes
     */
    public componentDidUpdate(): void {
        if (!this.props.active && this.state.isConfirming) {
            this.setState({ isConfirming: false });
        }
    }

    /**
     * Main render method, used to render Dialog
     */
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.renderDialogLightbox()}
            </React.Fragment>
        );
    }

    /**
     * Renders the dialog box itself
     */
    private renderDialogLightbox() {
        return (
            <Lightbox active={this.props.active} onClose={this.props.onClose}>
                <div className="dialog">
                    <h3>{this.props.title}</h3>
                    <p>{this.props.text}</p>
                    <div className="dialog-buttons">
                        <Button
                            className="confirm"
                            isPending={this.state.isConfirming}
                            throbberSize={24}
                            width="50%"
                            withThrobber={true}
                            onClick={this.onConfirmClick}
                            text="Confirm"
                        />
                        <Button
                            withThrobber={false}
                            width="50%"
                            className="cancel"
                            onClick={this.onCancelClick}
                            text="Cancel"
                        />
                    </div>
                </div>


                <style jsx>{`
                    .dialog {
                        margin: 10px 20px;
                        width: max-content;
                        max-width: 500px;
                        text-align: center;

                        @media (max-width: 600px) {
                            line-height: 1.3em;
                            max-width: calc(100% - 40px);
                            text-align: center;
                        }
                    }

                    p {
                        margin: 20px 0;
                        line-height: 1.4;
                    }
                    
                    .dialog-buttons {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        margin-bottom: 20px;
                    }

                    .dialog button {
                        padding: 7px;
                        margin: 5px;

                        width: 50%;

                        border: none;
                        border-radius: 2px;

                        cursor: pointer;
                    }

                    .dialog :global(.confirm) {
                        color: ${ colors.white};
                        background-color: ${ colors.secondary};
                        margin-right: 10px;

                        &:hover {
                            background-color: ${ colors.primary};
                        }
                    }

                    .dialog :global(.cancel) {
                        margin-left: 10px;
                        background-color: ${ colors.whiteSmoke};
                        color: ${ colors.black};
                        border: 1px solid rgba(167,167,167, 0.2);

                        &:hover {
                            background-color: rgba(167,167,167, 0.2);
                        }
                    }

                `}</style>
            </Lightbox>
        );
    }

    /**
     * Callback to be executed once the dialogs confirm button is clicked, in order
     * to trigger the confirm callback
     */
    private onConfirmClick = () => {
        if (this.state.isConfirming) {
            return;
        }

        this.setState({ isConfirming: true });
        this.props.confirmAction();
    }

    /**
     * Callback to be executed once the dialogs cancel button is clicked
     */
    private onCancelClick = () => {
        if (this.state.isConfirming) {
            return;
        }

        this.props.onClose();
    }
}
