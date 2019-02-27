import React from "react";
import { CSSTransition } from "react-transition-group";
import { easings } from "src/ts/config/easings";

/**
 * Specification of the transition duration in milliseconds.
 */
const DURATION = 200;

let incrementedId = 0;

/**
 * Simple css transition that'll fade and scale the content into view the first
 * time the page is being opened.
 */
// tslint:disable-next-line variable-name no-reserved-keywords completed-docs
export const InitialFade: React.SFC<{ in?: boolean; withTransform?: boolean }> = (props) => {
    const id = ++incrementedId;

    return (
        <CSSTransition
            { ...props }
            appear={true}
            timeout={ DURATION }
            classNames={`initialFade-${id}`}
        >
            <>
                { props.children }

                <style jsx global>{`
                    .initialFade-${id}-enter,
                    .initialFade-${id}-appear {
                        opacity: 0.001;
                        transform: ${ props.withTransform ? "translateY(5px)" : null };
                    }

                    .initialFade-${id}-enter-active,
                    .initialFade-${id}-appear-active {
                        opacity: 1;
                        transform: ${ props.withTransform ? "translateY(0)" : null };
                        transition:
                            opacity ${ DURATION }ms linear,
                            transform ${ DURATION }ms ${ easings.inOutQuart };
                    }
                `}</style>
            </>
        </CSSTransition>
    );
};
