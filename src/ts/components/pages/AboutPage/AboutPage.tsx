import React from "react";
import { fonts, colors } from "src/ts/config";

/**
 * The is the about page
 */
export default class AboutPage extends React.Component {
    /**
     * Her er docs
     */
   // tslint:disable-next-line: max-func-body-length
   render(){
      return (
         <div>
            <h1>About</h1>
            <p>Info about PolloPollo...</p>
            <a href="https://pollopollo.org/" target="_blank" rel="noreferrer">Example link to PolloPollo</a>
            

            <style jsx>{`
               h1{
                  /** Override defaults */
                  margin: 30px 0 15px 0;

                  /** Setup font */
                  font-family: ${ fonts.heading};
                  font-weight: 500;
                  line-height: 1;
                  margin-bottom: 5px;
               }

               a {
                  color: ${colors.primary};
                  text-decoration: underline;
               }
               
               a:hover {
                  color: ${colors.secondary};
                  }
            `}</style>
         </div>
      );
   }
}
