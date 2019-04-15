import React from "react";
import { easings, colors } from "src/ts/config";
import { getSVG } from "src/assets/svg";

export type ThumbnailProps = {
    /**
     * Specifies the source of the thumbnail to render, if no source is specifeied
     * then the placeholder will be rendered indefinitely
     */
    src?: string;

    /**
     * If set to true, then the thumbnail will have rounded corners
     */
    roundedCorners?: boolean;

    /**
     * Optionally specifies an action to perform once the image is clicked
     */
    callback?(): void;
}

export type ThumbnailState = {
    /**
     * Specfies wheter or not the image within the component has successfully loaded
     * or not
     */
    hasLoaded: boolean;
}


/**
 * Component responsible for rendering a thumbnail that can be clicked in order
 * to perform some kind of callback
 */
export class Thumbnail extends React.PureComponent<ThumbnailProps, ThumbnailState> {
    /**
     * Contains the previous source passed to the thumbnail component, which will
     * be used to determine if we should begin fetching an image again.
     */
    private prevSrc?: string;

    /**
     * Setup initial state
     */
    public state: ThumbnailState = {
        hasLoaded: false,
    }

    /**
     * Preload the image as soon as the thumbnail mounts, and displayed a placeholder
     * in the meantime
     */
    public componentDidMount(): void {
        if (this.props.src) {
            const preloadImg = new Image();
            preloadImg.src = this.props.src;
            preloadImg.onload = this.onImageLoad;
            this.prevSrc = this.props.src;
        }
    }

    /**
     * Every time the component updates, then we need to redetermine if we have
     * to fetch a new image or if we need to display the placeholder again.
     */
    public componentDidUpdate(): void {
        if (!this.props.src) {
            this.prevSrc = undefined;
            this.setState({ hasLoaded: false });
        } else if (this.props.src !== this.prevSrc) {
            const preloadImg = new Image();
            preloadImg.src = this.props.src;
            preloadImg.onload = this.onImageLoad;
            this.prevSrc = this.props.src;
        }
    }

    /**
     * Setup main render method
     */
    public render(): JSX.Element {
        return (
            <div className={`thumbnail ${this.state.hasLoaded ? "hasLoaded" : "notLoaded"} ${this.props.roundedCorners ? "rounded" : ""}`}>
                <i
                    className={`image ${this.props.callback ? "hasCallback" : ""}`}
                    onClick={this.props.callback}
                    role="button"
                >
                    <img src={this.props.src} alt="" role="presentation" />
                </i>
                <i className="placeholder">
                    {getSVG("image", { strokeColor: colors.primary })}
                </i>

                <style jsx>{`
                    .thumbnail {
                        /** Allow position: absolute within */
                        position: relative;

                        /** Inherit dimensions from parent */
                        width: 100%;
                        height: 100%;

                        /** 
                         * Ensure image hover transitions won't overflow our
                         * container 
                         */
                        overflow: hidden;

                        /** If rounded corners are enabled, then enforce them! */
                        &.rounded {
                            & .image {
                                border-radius: 50%;
                                overflow: hidden;
                            }
                        }

                        /** Display image as soon as it has loaded */
                        &.hasLoaded {
                            & .image {
                                opacity: 1;
                            }

                            & .placeholder {
                                opacity: 0;
                                pointer-events: none;
                            }
                        }

                        /** 
                         * While the image isn't loaded, display the placeholder 
                         */
                        &.notLoaded {
                            & .image {
                                opacity: 0;
                                pointer-events: none;
                            }

                            & .placeholder {
                                opacity: 1;
                            }
                        }
                    }

                    .image {
                        display: block;
                        width: 100%;
                        height: 100%;

                        /** Prepare hover transitions */
                        opacity: 0;
                        -webkit-backface-visibility: hidden;
                        transform: scale(1);
                        transition: transform 0.2s ${ easings.inOutQuad}, opacity 0.2s linear;

                        &.hasCallback {
                            /** Indicate that thumbnail is clickable */
                            cursor: pointer;

                            &::before {
                                /** Position on top of image */
                                content: "";
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                z-index: 2;

                                /** Prepare hover transitions */
                                transition: background-color 0.2s linear;
                                background: rgba(69, 50, 102, 0);
                            }

                            &:hover {
                                transform: scale(1.1);

                                &::before {
                                    background-color: rgba(69, 50, 102, 0.5);
                                }
                            }
                        }

                        & img {
                            /** We display as a block to avoid weird 4px forced margin */
                            display: block;
                            position: relative;

                            /** 
                            * Attempt to fit the image as best as possible within
                            * the given dimensions 
                            */
                            object-fit: cover;
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .placeholder {
                        /** Position on top of image */
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;

                        /** Prepare fade-in transitions */
                        transition: opacity 0.2s linear;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Method that'll get triggered as soon as the thumbnail image has loaded
     * in order to reflect that in the UI
     */
    private onImageLoad = () => {
        this.setState({ hasLoaded: true });
    }
}