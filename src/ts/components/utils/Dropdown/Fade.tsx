import React from "react";
import { CSSTransition } from "react-transition-group";
import { easings } from "src/ts/config";

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
            classNames="utils__dropdown__fade"
        >
            <>
                { props.children }

                <style jsx global>{`
                    .utils__dropdown__fade-enter,
                    .utils__dropdown__fade-appear {
                        opacity: 0.001;
                        transform: translateY(-5px);
                    }

                    .utils__dropdown__fade-enter-active,
                    .utils__dropdown__fade-appear-active {
                        animation: fadeIn ${ DURATION }ms linear forwards;
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0.001;
                            transform: translateY(-5px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .utils__dropdown__fade-exit {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .utils__dropdown__fade-exit-active {
                        opacity: 0.001;
                        transform: translateY(5px);

                        /** Apply transition */
                        transition:
                            opacity ${ DURATION }ms linear,
                            transform ${ DURATION }ms ${ easings.inOutQuad };
                    }

                    .utils__dropdown__fade-exit-done {
                        opacity: 0;
                    }
                `}</style>
            </>
        </CSSTransition>
    );
};
