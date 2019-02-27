import React from "react";
import { CSSTransition } from "react-transition-group";
import { easings } from "src/ts/config/easings";

/**
 * Specification of the transition duration in milliseconds.
 */
const DURATION = 320;

/**
 * Simple css transition that'll fade and scale the content into view the first
 * time the page is being opened.
 */
// tslint:disable-next-line variable-name no-reserved-keywords completed-docs
export const HeaderFade: React.SFC<{ in?: boolean }> = (props) => {
    return (
        <CSSTransition
            { ...props }
            appear={true}
            timeout={ DURATION }
            classNames="initialHeaderFade"
        >
            <>
                { props.children }

                <style jsx global>{`
                    .initialHeaderFade-enter,
                    .initialHeaderFade-appear {
                        opacity: 0.001;
                        transform: translateY(-50%);
                    }

                    .initialHeaderFade-enter-active,
                    .initialHeaderFade-appear-active {
                        opacity: 1;
                        transform: translateY(0);
                        transition:
                            opacity ${ DURATION }ms linear,
                            transform ${ DURATION * 0.8 }ms ${ easings.inOutQuart };
                    }
                `}</style>
            </>
        </CSSTransition>
    );
};
