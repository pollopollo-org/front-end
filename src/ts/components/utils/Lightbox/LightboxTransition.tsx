import React from "react";
import { CSSTransition } from "react-transition-group";
import { easings } from "src/ts/config";

/**
 * Specification of the fade duration given in milliseconds.
 */
const DURATION = 300;

/**
 * Simple css fade transition that'll fade the lightbox in / out when it's being
 * shown / hidden.
 */
// tslint:disable-next-line variable-name completed-docs
export const LightboxTransition: React.SFC<{in?: boolean; unmountOnExit?: boolean; mountOnEnter?: boolean}> = (props) => {
    return (
        <CSSTransition
            { ...props }
            mountOnEnter
            unmountOnExit
            timeout={ DURATION }
            classNames="utils__lightbox"
        >
            <>
                { props.children }

                <style jsx global>{`
                    .utils__lightbox-enter,
                    .utils__lightbox-appear {
                        opacity: 0.001;

                        & .lightbox {
                            transform: translate(-50%, -50%) scale(0.2);
                            opacity: 0;
                        }
                    }

                    .utils__lightbox-enter-active,
                    .utils__lightbox-appear-active {
                        opacity: 1;
                        transition: opacity ${ DURATION * 0.8 }ms linear;

                        & .lightbox {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 1;
                            transition: opacity ${ DURATION }ms linear, transform ${ DURATION }ms ${ easings.inOutQuart };
                        }
                    }

                    .utils__lightbox-exit {
                        opacity: 1;
                    }

                    .utils__lightbox-exit-active {
                        opacity: 0.001;

                        /** Apply transition */
                        transition: opacity ${ DURATION * 0.5 }ms linear;
                    }

                    .utils__lightbox-exit-done {
                        opacity: 0;
                    }
                `}</style>
            </>
        </CSSTransition>
    );
};
