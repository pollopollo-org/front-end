import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { getSVG } from "src/assets/svg";
import notFoundJson from "src/assets/data/NotFoundPage.json";

/**
 * Error 404 page
 */
export class UnwrappedNotFoundPage extends React.PureComponent<RouteComponentProps> {
   /**
    * Render 404 page
    */
    render(){
        return <div className="notFoundCenterWrapper">
            <div className="notFoundSpacer">
                <h1 className="notFound">{notFoundJson.title}</h1>
                <div className="image">
                    <i className="notFoundImage">{getSVG("chicken-egg") }</i>
                </div>
                <p className="notFoundLinkText">
                    <Link style={{ fontSize: 18 }} to="/">{notFoundJson.linkText}</Link>
                </p>
            </div>

            <style jsx>{`
                /* Center content in middle */
                .notFoundCenterWrapper {
                    flex-grow: 1;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                /* Top and bottom margin for 404 page */
                .notFoundSpacer {
                    margin-top: 10%;
                    margin-bottom: 5%;
                }

                /* Center header text */
                .notFound {
                    text-align: center
                }

                /* Center link */
                .notFoundLinkText {
                    text-align: center
                }

                /* Size of svg */
                .image i {
                    margin: auto;
                    display: block;
                    height: 150px;
                    width: 150px;
                    padding-top: 5px;
                }
            `}</style>
      </div>;
    }
}

export const NotFoundPage = withRouter(UnwrappedNotFoundPage);
