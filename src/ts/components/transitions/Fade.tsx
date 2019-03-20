import React from "react";
import { CSSTransition } from "react-transition-group";

/**
 * Specification of the fade duration given in milliseconds.
 */
const DURATION = 175;

/**
 * Simple css fade transition that'll fade the dropdown in / out when it's being
 * shown / hidden.
 */
// tslint:disable-next-line variable-name
export const Fade: React.SFC = (props) => {
    return (
        <CSSTransition
            { ...props }
            timeout={ DURATION }
            classNames="utils__fade"
        >
            <>
                { props.children }

                <style jsx global>{`
                    .utils__fade-enter,
                    .utils__fade-appear {
                        opacity: 0.001;
                    }

                    .utils__fade-enter-active,
                    .utils__fade-appear-active {
                        animation: fadeIn ${ DURATION }ms linear forwards;
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0.001;
                        }

                        to {
                            opacity: 1;
                        }
                    }

                    .utils__fade-exit {
                        opacity: 1;
                    }

                    .utils__fade-exit-active {
                        opacity: 0.001;

                        /** Apply transition */
                        transition: opacity ${ DURATION }ms linear;
                    }

                    .utils__fade-exit-done {
                        opacity: 0;
                    }
                `}</style>
            </>
        </CSSTransition>
    );
};
