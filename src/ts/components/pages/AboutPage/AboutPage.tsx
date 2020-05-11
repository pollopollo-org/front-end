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
         <div className="page">
            <div className="divtop centertext">
                  <a href="#guides" className="anchors">Guides</a>&nbsp;|&nbsp;
                  <a href="#faq" className="anchors">FAQ</a>&nbsp;|&nbsp;
                  <a href="#team" className="anchors">The team</a>&nbsp;|&nbsp;
                  <a href="#articles" className="anchors">Articles</a>&nbsp;|&nbsp;
                  <a href="#terms" className="anchors">Terms & Conditions</a>
            </div>

            <div className="centertext">
               {/*tslint:disable-next-line: react-a11y-accessible-headings */}
               <h1 id="whatispollopollo">What is PolloPollo</h1>
               <p>PolloPollo is a fully decentralized charitable platform using Distributed Ledger Technology. <br />It brings donors, applicants and providers of physical products together.<br />This 2 minute introduction video explains how the platform works.</p>


               {/*tslint:disable-next-line: react-iframe-missing-sandbox */}
               <iframe className="videoframe" width="560" height="315" src="https://www.youtube.com/embed/v8nxs0YRwUQ?autoplay=0" frameBorder="0" allowFullScreen></iframe><br />
               <a href="https://www.youtube.com/watch?v=2W3XCSLQsAA"><p className="smalltext">Versión en español</p></a><br />
            </div>
               
            {/*tslint:disable-next-line: react-a11y-accessible-headings */}
            <h1 id="guides">Guides</h1>
            <p>We always strive to make the platform as easy and non-technical as possible, to stay relevant to people without technical or IT skills. We created some guides, that you can find in the section below:</p>
            <div className="divtop centertext">
               <div className="divblock">
                  <a href="https://medium.com/@casper_43503/basic-principles-of-dlt-based-charity-platform-pollopollo-7ed59f65de3e">How the platform works</a>
               </div>
               <div className="divblock">
                  Donors
               </div>
               <div className="divblock">
                  <a href="https://docs.google.com/document/d/1sN_CIXZtkwUaHt9XB4NV-2DrJptvTksWPKL_Sa5zuy8/edit?usp=sharing">Guide for Producers</a>
               </div>
               <div className="divblock">
                  Applicants
               </div>
            </div>

            {/*tslint:disable-next-line: react-a11y-accessible-headings */}
            <h1 id="faq">Frequently Asked Questions</h1>       
            <br />     
            <details>
               <summary className="question">Why can I only use Obyte cryptocurrency for donations?</summary>
               <p>The entire PolloPollo platform is built on the Obyte platform. To enable donations in other currencies, a more complex setup is required, both in terms of technology as well as regulatory frameworks. We do plan to enable other currencies as well.</p>
            </details>
            <br />
            <details>
               <summary className="question">Where can I acquire Bytes for donations?</summary>
               <p>Bytes can be bought at several cryptocurrency exchanges. <a href="https://obyte.org/#exchanges" target="_blank" rel="noreferrer">See the list here.</a></p>
            </details>                  
            <br />
            <details>
               <summary className="question">Why is there no applications showing?</summary>
               <p>If applicants haven't applied for donation of products, there are no open applications. PolloPollo does not control when applicants apply for donations of products.</p>
            </details>                  
            <br />
            <details>
               <summary className="question">Is there a way to support the PolloPollo project directly?</summary>
               <p>We rely 100% on the work of volunteers, and always welcome more to help us improve the platform. Please join our <a href="https://discord.pollopollo.org" target="_blank" rel="noreferrer">Community Discord</a> and let us know you want to help.</p>
            </details>
            <br />
            <details>
               <summary className="question">Is there a way to financially support PolloPollo?</summary>
               <p>Thanks to the generous partners helping us, the operational cost of the platform is close to zero. The best help would be to make donations regularly or suggesting new improvements to the platform.</p>
            </details>

            {/*tslint:disable-next-line: react-a11y-accessible-headings */}
            <h1 id="team">The team</h1>
            <p>PolloPollo is built and maintained 100% by volunteers. Over time a lot of people has helped. These are the awesome people making this platform possible:</p>
            <div className="divtop">
               <div className="divblock">
               <img
                  className="image" // for styling
                  title="Avatar" 
                  src={`${process.env.PUBLIC_URL}/team/casper.png`}
                  alt="a picture"
               /><br />
                  Casper Niebe (DK)<br/>
                  Founder
               </div>
               <div className="divblock">
                  <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/santiago.png`}
                     alt="a picture"
                  /><br />
                  Santiago Law (VE)<br />
                  Representative, Venezuela
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/paul.png`}
                     alt="a picture"
                  /><br />
                  Paul Murray (MX)<br />
                  Digital Content
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/john.png`}
                     alt="a picture"
                  /><br />
                  John McLeod (UK)<br />
                  Public Relations
               </div>
            </div>
            <br />
            <div className="divtop">
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/markus.png`}
                     alt="a picture"
                  /><br />
                  Markus Olesen Mohr (DK)<br/>
                  Developer
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/sif.png`}
                     alt="a picture"
                  /><br />
                  Sif Kristensen (DK)<br />
                  Developer
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/jesper.png`}
                     alt="a picture"
                  /><br />
                  Jesper Falkenberg (DK)<br />
                  Developer
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/lasse.jpg`}
                     alt="a picture"
                  /><br />
                  Lasse Felskov Agersten (DK)<br />
                  Developer
               </div>
            </div>
            <br />
            <div className="divtop">
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/trine.png`}
                     alt="a picture"
                  /><br />
                  Trine Borre (DK)<br/>
                  Developer
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/sophia.jpg`}
                     alt="a picture"
                  /><br />
                  Sophia Aumüller-Wagner (DK)<br />
                  Scrum Master
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/muhammet.jpg`}
                     alt="a picture"
                  /><br />
                  Muhammet Agar (DK)<br />
                  Scrum Master
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/josefine.jpg`}
                     alt="a picture"
                  /><br />
                  Josefine Bowring (DK)<br />
                  Business Coach
               </div>
            </div>            
            <br />
            <div className="divtop">
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/christina.jpg`}
                     alt="a picture"
                  /><br />
                  Christina Steinhauer (DK)<br/>
                  Developer
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/valerius.png`}
                     alt="a picture"
                  /><br />
                  Valerius Coppens (NL)<br/>
                  Advisory board
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/maxym.png`}
                     alt="a picture"
                  /><br />
                  Maxym Ukrainskyi (RU)<br />
                  Representative Russia
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/daniel.jpg`}
                     alt="a picture"
                  /><br />
                  Daniel Schledermann (DK)<br />
                  DevOps
               </div>
            </div>            
            <br />            
            <div className="divtop">
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/avatar_male.png`}
                     alt="a picture"
                  /><br />
                  "Slackjore" (UK)<br />
                  Advisory board
               </div>
               <div className="divblock">
               <img
                     className="image" // for styling
                     title="Avatar" 
                     src={`${process.env.PUBLIC_URL}/team/avatar_male.png`}
                     alt="a picture"
                  /><br />
                  Reny Ochoa (VE)<br />
                  Representative, Venezuela
               </div>
            </div>            
            <br />

            {/*tslint:disable-next-line: react-a11y-accessible-headings */}
            <h1 id="articles">Articles</h1>
            <br />
            <a href="https://www.telegraph.co.uk/global-health/science-and-disease/cyptocurrency-platform-delivers-food-medicine-struggling-venezuelans/">The Telegraph (UK) - Cryptocurrency platform delivers food and medicine to struggling Venezuelans</a><br />
            <a href="https://www.cityam.com/wp-content/uploads/2019/07/Cityam-2019-07-23.pdf">City A.M. (UK) - Blockchain Enables Charitable Donations In Venezuela</a><br />
            <a href="https://decrypt.co/10972/pollopollo-the-crypto-project-putting-chicken-back-on-the-table-in-venezuela">Decrypt Media (US) - PolloPollo the crypto project putting chicken back on the table in Venezuela</a><br />
            <a href="https://digitalasset.live/2019/10/09/how-dlt-will-enhance-charities/">Digital Asset (DK) - How DLT will enhance charities</a><br />
            <a href="https://es.cointelegraph.com/news/pollopollos-representative-venezuela-blockchain-demonstrated-allows-implementation-decentralized-donation-without-intermediaries">Coin Telegraph (ES) - Venezuela Blockchain allows decentralized donations without intermediaries</a><br />
            <a href="https://www.criptonoticias.com/comunidad/beneficencia/travesia-bitcoiner-venezolano-premio-labitconf/">Cripto Noticias (VE) - Travesia bitcoiner venezolano premic LABitConf</a><br />
            <a href="https://es.cointelegraph.com/news/blockchain-charity-platform-to-fight-against-the-coronavirus-outbreak">Coin Telegraph (ES) - Blockchain charity platform to fight against the coronavirus outbreak</a><br />
            <a href="https://es.ambcrypto.com/bitcoin-btc-proyecto-humanitario-en-blockchain-lleva-comida-a-venezuela/">ABM Crypto (ES) - Bitcoin BTC proyecto humanitario en blockchain lleva comida a Venezuela </a><br />

<br /><br />
            {/*tslint:disable-next-line: react-a11y-accessible-headings */}
            <div className="terms">
            <h1 id="terms">Terms and Conditions</h1>
<p>Last updated: May 11, 2020</p>
<p>Please read these terms and conditions carefully before using Our Service.</p>
<h1>Interpretation and Definitions</h1>
<h2>Interpretation</h2>
<p>The words of which the initial letter is capitalized have meanings defined under the following conditions.</p>
<p>The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
<h2>Definitions</h2>
<p>For the purposes of these Terms and Conditions:</p>
<ul>
<li>
<p><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
</li>
<li>
<p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to PolloPollo.</p>
</li>
<li>
<p><strong>Country</strong> refers to:  Denmark</p>
</li>
<li>
<p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
</li>
<li>
<p><strong>Service</strong> refers to the Website.</p>
</li>
<li>
<p><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the <a href="https://www.termsfeed.com/terms-conditions-generator/" target="_blank" rel="noreferrer">Terms and Conditions Generator</a>.</p>
</li>
<li>
<p><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p>
</li>
<li>
<p><strong>Website</strong> refers to PolloPollo, accessible from <a href="https://pollopollo.org" rel="external nofollow noopener noreferrer" target="_blank">https://pollopollo.org</a></p>
</li>
<li>
<p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
</li>
</ul>
<h1>Acknowledgement</h1>
<p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
<p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
<p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
<p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
<p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
<h1>Links to Other Websites</h1>
<p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
<p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
<p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
<h1>Termination</h1>
<p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
<p>Upon termination, Your right to use the Service will cease immediately.</p>
<h1>Limitation of Liability</h1>
<p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
<p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
<p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
<h1>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</h1>
<p>The Service is provided to You &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p>
<p>Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
<p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p>
<h1>Governing Law</h1>
<p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
<h1>Disputes Resolution</h1>
<p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>
<h1>For European Union (EU) Users</h1>
<p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in.</p>
<h1>United States Legal Compliance</h1>
<p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a &quot;terrorist supporting&quot; country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
<h1>Severability and Waiver</h1>
<h2>Severability</h2>
<p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
<h2>Waiver</h2>
<p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.</p>
<h1>Translation Interpretation</h1>
<p>These Terms and Conditions may have been translated if We have made them available to You on our Service.
You agree that the original English text shall prevail in the case of a dispute.</p>
<h1>Changes to These Terms and Conditions</h1>
<p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
<p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>
<h1>Contact Us</h1>
<p>If you have any questions about these Terms and Conditions, You can contact us:</p>
<ul>
<li>
<p>By email: pollopollo@pollopollo.org</p>
</li>
<li>
<p>By visiting this page on our website: <a href="https://discord.pollopollo.org" rel="external nofollow noopener noreferrer" target="_blank">https://discord.pollopollo.org</a></p>
</li>
</ul>
<br />
            </div>


            <style jsx>{`
               h1{
                  /** Override defaults */
                  margin: 30px 0 15px 0;

                  /** Setup font */
                  font-family: ${ fonts.heading};
                  color: ${ colors.primary};
                  font-weight: 500;
                  line-height: 1;
                  margin-bottom: 0px;
               }

               a {
                  color: ${colors.secondary};
                  text-decoration: underline;
               }

               .page {
                  margin-left: 20px;
                  margin-bottom: 20px;
                  margin-top: 20px;
              }

              .image {
                 width: 120px;
                 height: 120px;
              }

              .terms {
                 font-family: "Courier New";
                 font-size: 12px;
                 background-color: #EEEEEE;
                 padding-left: 20px;
                 padding-right: 20px;
                 padding-top: 10px;
              }

               .anchors {
                  margin: 30px 0 15px 0;
                  font-family: ${ fonts.heading};
                  font-size: 16px;
                  text-decoration: underline;
                  line-height: 1;
                  text-align: center;
               }
               
               a:hover {
                  color: ${colors.secondary};
                  }
               
               .centertext {
                  text-align: center;
               }

               .videoframe {
                  display: block;
                  margin: auto;
               }

               .smalltext {
                  font-size: 14px;
                  margin: 0px 0 0px 0;
               }

               .question {
                  font-weight: bold;
               }

               .divtop {
                  width: 100%;
               }

               .divblock {
                  width: 25%;
                  display: inline-block;
               }

            `}</style>
         </div>
      );
   }
}
