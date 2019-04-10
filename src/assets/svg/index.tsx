import React from "react";

/**
 * Prepare a context that includes all available .svg files within this folder.
 */
const context = require.context("./", false, /\.svg$/);

/**
 * Specification of available options when rendering icons.
 */
type IconOptions = {
    /**
     * Specifies the fill color applied to the paths within the svg element.
     */
    fillColor?: string;

    /**
     * Specifies the fill color applied to the paths within the svg element,
     * when the user is hovering the icon.
     */
    fillHoverColor ?: string;

    /**
     * Specifies the stroke color applied to the paths within the svg element.
     */
    strokeColor?: string;

    /**
     * Specifies the stroke color applied to the paths within the svg element,
     * when the user is hovering the icon.
     */
    strokeHoverColor?: string;

    /**
     * Specifies the transition duration when changing color on hover (default
     * is 0.1s).
     */
    transitionDuration?: number;
};

/**
 * Helper that'll return a React element, which will render the desired svg file
 * filling up the parent node.
 */
// tslint:disable-next-line export-name
export function getSVG(name: string, options: IconOptions = {}): JSX.Element {
    // Load svg content
    const svg = context(`./${name}.svg`) as string;

    // We KNOW that content will always come from our own files, there is no
    // way to actually perform xss here...
    // tslint:disable react-no-dangerous-html
    return (
        <React.Fragment>
            <span className="svgIcon" dangerouslySetInnerHTML={{ __html: svg }}>

            </span>

            <style jsx>{`
                span {
                    /** Make sure the wrapper fills up the placeholder */
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }

                span > :global(svg) {
                    /** Make sure that the injected svg fills up the wrapper */
                    width: 100%;
                    height: 100%;
                }

                span > :global(svg) :global(path),
                span > :global(svg) :global(circle),
                span > :global(svg) :global(rect),
                span > :global(svg) :global(polygon) {
                    /** Prepare color transitions */
                    transition:
                        fill 0.1s linear,
                        stroke 0.1s linear;
                }
            `}</style>

            <style jsx>{`
                span > :global(svg) :global(path),
                span > :global(svg) :global(circle),
                span > :global(svg) :global(rect),
                span > :global(svg) :global(polygon) {
                    fill: ${ options.fillColor || null };
                    stroke: ${ options.strokeColor || null };
                    transition-duration: ${ options.transitionDuration || 100 }ms;
                }

                span:hover > :global(svg) :global(path),
                span:hover > :global(svg) :global(circle),
                span:hover > :global(svg) :global(rect),
                span:hover > :global(svg) :global(polygon) {
                    fill: ${ options.fillHoverColor || options.fillColor || null};
                    stroke: ${ options.strokeHoverColor || options.strokeColor || null };
                }
            `}</style>
        </React.Fragment>
    );
    // tslint:enable react-no-dangerous-html
}
