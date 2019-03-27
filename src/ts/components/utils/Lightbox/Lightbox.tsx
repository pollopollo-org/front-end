import React from "react";
import { createPortal } from "react-dom";
import { LightboxTransition } from "src/ts/components/utils/Lightbox/LightboxTransition";
import { colors } from "src/ts/config";

type LightboxProps = {
    /**
     * Specifies whether or not the lightbox should currently be open
     */
    active: boolean;

    /**
     * Callback to be executed once the lightbox should be closed
     */
    onClose(): void;
}

/**
 * Component that renders a lightbox overlay in which content can be displayed
 */
export class Lightbox extends React.PureComponent<LightboxProps> {
    /**
     * Main render method
     */
    public render(): JSX.Element {
        return createPortal(
            <LightboxTransition in={this.props.active}>
                <div className="lightbox__wrapper" onClick={this.props.onClose} role="none">
                    <div className="lightbox" onClick={this.stopPropagation} role="article">
                        <div className="lightbox__content">
                            {this.props.children}                        
                        </div>
                        {this.renderCloseButton()}
                    </div>
                </div>
                <style jsx>{`
                    .lightbox__wrapper {
                        /** Fill the entire viewport, on top of other content */
                        position: fixed;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        z-index: 1000;
                        background-color: rgba(69, 50, 102, 0.8);
                    }

                    .lightbox {
                        /** Center the lightbox within the viewport */
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .lightbox__content {
                        /** Ensure scroll is enabled in case lightbox overflows */
                        overflow: auto;
                        -webkit-overflow-scrolling: touch;

                        /** Enforce max-width of the lightbox */
                        width: max-content;
                        height: auto;
                        max-width: calc(100vw - 60px);
                        max-height: calc(100vh - 60px);
                        background: white;
                    }
                `}</style>
            </LightboxTransition>,
            document.body,
        );
    }

    /**
     * Internal renderer that'll render a close button that'll allow us to
     * close the dropdown
     */
    private renderCloseButton(): JSX.Element {
        return (
            <span role="button" onClick={this.props.onClose}>
                <style jsx>{`
                    span {
                        /** 
                         * Position close button in top-right corner, half
                         * overlapping content 
                         */
                        position: absolute;
                        right: -17px;
                        top: -17px;

                        /** Render the button itself */
                        border-radius: 50%;
                        width: 34px;
                        height: 34px;
                        background-color: ${ colors.primary };

                        /** Indicate that button is clickable */
                        cursor: pointer;

                        /** 
                         * Create a box shadow to visually indicate that the
                         * button is on top of the lightbox itself 
                         */
                        box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);

                        /** Prepare hover transitions */
                        transition: background-color 0.1s linear;

                        /** Render lines of the cross */
                        &::before,
                        &::after {
                            content: "";

                            /** Center lines */
                            position: absolute;
                            top: calc(50% - 1px);
                            left: 6px;

                            /** Render lines */
                            height: 2px;
                            width: 22px;
                            background-color: ${ colors.white };

                            /** Prepare transitions */
                            transition: background-color 0.1s linear;
                        }

                        &::before {
                            transform: rotate(45deg);
                        }

                        &::after {
                            transform: rotate(135deg);
                        }

                        &:hover {
                            background-color: ${ colors.secondary };
                        }
                    }    
                `}</style>
            </span>
        );
    }

    /**
     * We need to stop propagation on clicks of the actual lightbox to avoid
     * closing the lightbox simply by clicking on it
     */
    private stopPropagation = (evt: React.MouseEvent) => {
        evt.stopPropagation();
    }
}