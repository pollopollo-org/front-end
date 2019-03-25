import React from "react";
import { easings } from "src/ts/config";
import { getSVG } from "src/assets/svg";

export type ThumbnailProps = {
    /**
     * Specifies the source of the thumbnail to render, if no source is specifeied
     * then the placeholder will be rendered indefinitely
     */
    src?: string;

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
        }
    }

    /**
     * Setup main render method
     */
    public render(): JSX.Element {
        return (
            <div className={`thumbnail ${this.state.hasLoaded ? "hasLoaded" : "notLoaded"}`}>
                <img src={this.props.src} alt="" role="presentation" />                    
                <i className="placeholder">
                    { getSVG("image") }
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

                        /** Display image as soon as it has loaded */
                        &.hasLoaded {
                            & img {
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
                            & img {
                                opacity: 0;
                                pointer-events: none;
                            }

                            & .placeholder {
                                opacity: 1;
                            }
                        }
                    }

                    img {
                        /** We display as a block to avoid weird 4px forced margin */
                        display: block;

                        /** 
                         * Attempt to fit the image as best as possible within
                         * the given dimensions 
                         */
                        object-fit: cover;
                        width: 100%;
                        height: 100%;

                        /** Indicate that thumbnail is clickable */
                        cursor: pointer;

                        /** Prepare hover transitions */
                        opacity: 0;
                        transition: transform 0.2s ${ easings.inOutQuad }, opacity 0.2s linear;

                        &:hover {
                            transform: scale(1.15);
                            opacity: 0.9;
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