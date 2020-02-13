import React from "react";
import { Image, ImageBackground, ScrollView, Linking } from "react-native";
import {
  Text,
  Button,
  View,
  Item,
  Input,
  CardItem,
  Body,
  Header,
  Left,
  Right
} from "native-base";
import styles from "../Styles.js";
import GradientButton from "react-native-gradient-buttons";
import Hyperlink from "react-native-hyperlink";
import {set} from "../wallet/seed.js";

const buttonAccept = store => {
  const changePage = (tab) => () => {
    if (!store.current.seed) {
      return;
    }
    set(store.current.seed);
    store.current.page = tab;
  };
  return (
    <GradientButton
      style={styles.gradientBtnPh}
      text="Accept"
      textStyle={{ fontSize: 14 }}
      gradientBegin="#9d41eb"
      gradientEnd="#9d41eb"
      gradientDirection="diagonal"
      height={50}
      width={"100%"}
      radius={10}
      onPressAction={changePage("wallets", true)}
    />
  );
};

export default ({ store }) => {
  const terms = store => {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <Text style={styles.textTermsStyle}>Terms of Use</Text>
        <Text style={styles.textTermsStyle}>
          THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS
          ACTION RIGHTS AS DETAILED IN SECTION 13. PLEASE READ THE AGREEMENT
          CAREFULLY.
        </Text>
        <Text />
        <Text style={styles.textTermsStyle}>
          Our Terms of Use have been updated as of September 5, 2016
        </Text>
        <Text />
        <Text style={styles.textTermsStyle}>1. Acceptance of Terms</Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet provides a platform for managing Ethereum (or "ETH")
          accounts, and allowing ordinary websites to interact with the Ethereum
          blockchain, while keeping the user in control over what transactions
          they approve, through our website located at{" "}
          <Text
            style={styles.linkTermsStyle}
            onPress={() => {
              Linking.openURL("https://velas.com/");
            }}
          >
            https://velas.com/
          </Text>
          and browser plugin (the "Site") — which includes text, images, audio,
          code and other materials (collectively, the “Content”) and all of the
          features, and services provided. The Site, and any other features,
          tools, materials, or other services offered from time to time by Velas
          Wallet are referred to here as the “Service.” Please read these Terms
          of Use (the “Terms” or “Terms of Use”) carefully before using the
          Service. By using or otherwise accessing the Services, or clicking to
          accept or agree to these Terms where that option is made available,
          you (1) accept and agree to these Terms (2) consent to the collection,
          use, disclosure and other handling of information as described in our
          Privacy Policy and (3) any additional terms, rules and conditions of
          participation issued by Velas Wallet from time to time. If you do not
          agree to the Terms, then you may not access or use the Content or
          Services.
        </Text>
        <Text style={styles.textTermsStyle}>
          2. Modification of Terms of Use
        </Text>
        <Text style={styles.textTermsStyle}>
          Except for Section 13, providing for binding arbitration and waiver of
          class action rights, Velas Wallet reserves the right, at its sole
          discretion, to modify or replace the Terms of Use at any time. The
          most current version of these Terms will be posted on our Site. You
          shall be responsible for reviewing and becoming familiar with any such
          modifications. Use of the Services by you after any modification to
          the Terms constitutes your acceptance of the Terms of Use as modified.
        </Text>
        <Text style={styles.textTermsStyle}>3. Eligibility</Text>
        <Text style={styles.textTermsStyle}>
          You hereby represent and warrant that you are fully able and competent
          to enter into the terms, conditions, obligations, affirmations,
          representations and warranties set forth in these Terms and to abide
          by and comply with these Terms.
        </Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet is a global platform and by accessing the Content or
          Services, you are representing and warranting that, you are of the
          legal age of majority in your jurisdiction as is required to access
          such Services and Content and enter into arrangements as provided by
          the Service. You further represent that you are otherwise legally
          permitted to use the service in your jurisdiction including owning
          cryptographic tokens of value, and interacting with the Services or
          Content in any way. You further represent you are responsible for
          ensuring compliance with the laws of your jurisdiction and acknowledge
          that Velas Wallet is not liable for your compliance with such laws.
        </Text>
        <Text style={styles.textTermsStyle}>
          4 Account Password and Security
        </Text>
        <Text style={styles.textTermsStyle}>
          When setting up an account within Velas Wallet, you will be responsible
          for keeping your own account secrets, which may be a twelve-word seed
          phrase, an account file, or other locally stored secret information.
          Velas Wallet encrypts this information locally with a password you
          provide, that we never send to our servers. You agree to (a) never use
          the same password for Velas Wallet that you have ever used outside of
          this service; (b) keep your secret information and password
          confidential and do not share them with anyone else; (c) immediately
          notify Velas Wallet of any unauthorized use of your account or breach
          of security. Velas Wallet cannot and will not be liable for any loss or
          damage arising from your failure to comply with this section.
        </Text>
        <Text style={styles.textTermsStyle}>
          5. Representations, Warranties, and Risks
        </Text>
        <Text style={styles.textTermsStyle}>5.1. Warranty Disclaimer</Text>
        <Text style={styles.textTermsStyle}>
          You expressly understand and agree that your use of the Service is at
          your sole risk. The Service (including the Service and the Content)
          are provided on an "AS IS" and "as available" basis, without
          warranties of any kind, either express or implied, including, without
          limitation, implied warranties of merchantability, fitness for a
          particular purpose or non-infringement.
        </Text>
        <Text style={styles.textTermsStyle}>
          You acknowledge that Velas Wallet has no control over, and no duty to
          take any action regarding: which users gain access to or use the
          Service; what effects the Content may have on you; how you may
          interpret or use the Content; or what actions you may take as a result
          of having been exposed to the Content. You release Velas Wallet from
          all liability for you having acquired or not acquired Content through
          the Service. Velas Wallet makes no representations concerning any
          Content contained in or accessed through the Service, and Velas Wallet
          will not be responsible or liable for the accuracy, copyright
          compliance, legality or decency of material contained in or accessed
          through the Service.
        </Text>
        <Text style={styles.textTermsStyle}>
          5.2 Sophistication and Risk of Cryptographic Systems
        </Text>
        <Text style={styles.textTermsStyle}>
          By utilizing the Service or interacting with the Content or platform
          in any way, you represent that you understand the inherent risks
          associated with cryptographic systems; and warrant that you have an
          understanding of the usage and intricacies of native cryptographic
          tokens, like Ether (ETH) and Bitcoin (BTC), smart contract based
          tokens such as those that follow the Ethereum Token Standard{" "}
          <Text
            style={styles.linkTermsStyle}
            onPress={() => {
              Linking.openURL("https://github.com/ethereum/EIPs/issues/20");
            }}
          >
            (https://github.com/ethereum/EIPs/issues/20)
          </Text>
          , and blockchain-based software systems.
        </Text>
        <Text style={styles.textTermsStyle}>
          5.3 Risk of Regulatory Actions in One or More Jurisdictions
        </Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet and ETH could be impacted by one or more regulatory
          inquiries or regulatory action, which could impede or limit the
          ability of Velas Wallet to continue to develop, or which could impede
          or limit your ability to access or use the Service or Ethereum
          blockchain.
        </Text>
        <Text style={styles.textTermsStyle}>
          5.4 Risk of Weaknesses or Exploits in the Field of Cryptography
        </Text>
        <Text style={styles.textTermsStyle}>
          You acknowledge and understand that Cryptography is a progressing
          field. Advances in code cracking or technical advances such as the
          development of quantum computers may present risks to cryptocurrencies
          and Services of Content, which could result in the theft or loss of
          your cryptographic tokens or property. To the extent possible, Velas
          Wallet intends to update the protocol underlying Services to account
          for any advances in cryptography and to incorporate additional
          security measures, but does not guarantee or otherwise represent full
          security of the system. By using the Service or accessing Content, you
          acknowledge these inherent risks.
        </Text>
        <Text style={styles.textTermsStyle}>
          5.5 Volatility of Crypto Currencies
        </Text>
        <Text style={styles.textTermsStyle}>
          You understand that Ethereum and other blockchain technologies and
          associated currencies or tokens are highly volatile due to many
          factors including but not limited to adoption, speculation, technology
          and security risks. You also acknowledge that the cost of transacting
          on such technologies is variable and may increase at any time causing
          impact to any activities taking place on the Ethereum blockchain. You
          acknowledge these risks and represent that Velas Wallet cannot be held
          liable for such fluctuations or increased costs.
        </Text>
        <Text style={styles.textTermsStyle}>5.6 Application Security</Text>
        <Text style={styles.textTermsStyle}>
          You acknowledge that Ethereum applications are code subject to flaws
          and acknowledge that you are solely responsible for evaluating any
          code provided by the Services or Content and the trustworthiness of
          any third-party websites, products, smart-contracts, or Content you
          access or use through the Service. You further expressly acknowledge
          and represent that Ethereum applications can be written maliciously or
          negligently, that Velas Wallet cannot be held liable for your
          interaction with such applications and that such applications may
          cause the loss of property or even identity. This warning and others
          later provided by Velas Wallet in no way evidence or represent an
          on-going duty to alert you to all of the potential risks of utilizing
          the Service or Content.
        </Text>
        <Text style={styles.textTermsStyle}>6. Indemnity</Text>
        <Text style={styles.textTermsStyle}>
          You agree to release and to indemnify, defend and hold harmless Velas
          Wallet and its parents, subsidiaries, affiliates and agencies, as well
          as the officers, directors, employees, shareholders and
          representatives of any of the foregoing entities, from and against any
          and all losses, liabilities, expenses, damages, costs (including
          attorneys’ fees and court costs) claims or actions of any kind
          whatsoever arising or resulting from your use of the Service, your
          violation of these Terms of Use, and any of your acts or omissions
          that implicate publicity rights, defamation or invasion of privacy.
          Velas Wallet reserves the right, at its own expense, to assume
          exclusive defense and control of any matter otherwise subject to
          indemnification by you and, in such case, you agree to cooperate with
          Velas Wallet in the defense of such matter.
        </Text>
        <Text style={styles.textTermsStyle}>7. Limitation on liability</Text>
        <Text style={styles.textTermsStyle}>
          YOU ACKNOWLEDGE AND AGREE THAT YOU ASSUME FULL RESPONSIBILITY FOR YOUR
          USE OF THE SITE AND SERVICE. YOU ACKNOWLEDGE AND AGREE THAT ANY
          INFORMATION YOU SEND OR RECEIVE DURING YOUR USE OF THE SITE AND
          SERVICE MAY NOT BE SECURE AND MAY BE INTERCEPTED OR LATER ACQUIRED BY
          UNAUTHORIZED PARTIES. YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE
          SITE AND SERVICE IS AT YOUR OWN RISK. RECOGNIZING SUCH, YOU UNDERSTAND
          AND AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,
          NEITHER Velas Wallet NOR ITS SUPPLIERS OR LICENSORS WILL BE LIABLE TO
          YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          PUNITIVE, EXEMPLARY OR OTHER DAMAGES OF ANY KIND, INCLUDING WITHOUT
          LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER
          TANGIBLE OR INTANGIBLE LOSSES OR ANY OTHER DAMAGES BASED ON CONTRACT,
          TORT, STRICT LIABILITY OR ANY OTHER THEORY (EVEN IF Velas Wallet HAD
          BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM THE
          SITE OR SERVICE; THE USE OR THE INABILITY TO USE THE SITE OR SERVICE;
          UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA;
          STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SITE OR SERVICE; ANY
          ACTIONS WE TAKE OR FAIL TO TAKE AS A RESULT OF COMMUNICATIONS YOU SEND
          TO US; HUMAN ERRORS; TECHNICAL MALFUNCTIONS; FAILURES, INCLUDING
          PUBLIC UTILITY OR TELEPHONE OUTAGES; OMISSIONS, INTERRUPTIONS,
          LATENCY, DELETIONS OR DEFECTS OF ANY DEVICE OR NETWORK, PROVIDERS, OR
          SOFTWARE (INCLUDING, BUT NOT LIMITED TO, THOSE THAT DO NOT PERMIT
          PARTICIPATION IN THE SERVICE); ANY INJURY OR DAMAGE TO COMPUTER
          EQUIPMENT; INABILITY TO FULLY ACCESS THE SITE OR SERVICE OR ANY OTHER
          WEBSITE; THEFT, TAMPERING, DESTRUCTION, OR UNAUTHORIZED ACCESS TO,
          IMAGES OR OTHER CONTENT OF ANY KIND; DATA THAT IS PROCESSED LATE OR
          INCORRECTLY OR IS INCOMPLETE OR LOST; TYPOGRAPHICAL, PRINTING OR OTHER
          ERRORS, OR ANY COMBINATION THEREOF; OR ANY OTHER MATTER RELATING TO
          THE SITE OR SERVICE.
        </Text>
        <Text style={styles.textTermsStyle}>
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR
          THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR
          CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY
          NOT APPLY TO YOU.
        </Text>
        <Text style={styles.textTermsStyle}>8. Our Proprietary Rights</Text>
        <Text style={styles.textTermsStyle}>
          All title, ownership and intellectual property rights in and to the
          Service are owned by Velas Wallet or its licensors. You acknowledge and
          agree that the Service contains proprietary and confidential
          information that is protected by applicable intellectual property and
          other laws. Except as expressly authorized by Velas Wallet, you agree
          not to copy, modify, rent, lease, loan, sell, distribute, perform,
          display or create derivative works based on the Service, in whole or
          in part. Velas Wallet issues a license for Velas Wallet, found here. For
          information on other licenses utilized in the development of Velas
          Wallet, please see our attribution page at:{" "}
          <Text
            style={styles.linkTermsStyle}
            onPress={() => {
              Linking.openURL("https://Velas.space/attributions.html");
            }}
          >
            https://Velas.space/attributions.html
          </Text>
        </Text>
        <Text style={styles.textTermsStyle}>9. Links</Text>
        <Text style={styles.textTermsStyle}>
          The Service provides, or third parties may provide, links to other
          World Wide Web or accessible sites, applications or resources.
        </Text>
        <Text style={styles.textTermsStyle}>
          Because Velas Wallet has no control over such sites, applications and
          resources, you acknowledge and agree that Velas Wallet is not
          responsible for the availability of such external sites, applications
          or resources, and does not endorse and is not responsible or liable
          for any content, advertising, products or other materials on or
          available from such sites or resources. You further acknowledge and
          agree that Velas Wallet shall not be responsible or liable, directly or
          indirectly, for any damage or loss caused or alleged to be caused by
          or in connection with use of or reliance on any such content, goods or
          services available on or through any such site or resource.
        </Text>
        <Text style={styles.textTermsStyle}>
          10. Termination and Suspension
        </Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet may terminate or suspend all or part of the Service and
          your Velas Wallet access immediately, without prior notice or
          liability, if you breach any of the terms or conditions of the Terms.
          Upon termination of your access, your right to use the Service will
          immediately cease.
        </Text>
        <Text style={styles.textTermsStyle}>
          The following provisions of the Terms survive any termination of these
          Terms: INDEMNITY; WARRANTY DISCLAIMERS; LIMITATION ON LIABILITY; OUR
          PROPRIETARY RIGHTS; LINKS; TERMINATION; NO THIRD PARTY BENEFICIARIES;
          BINDING ARBITRATION AND CLASS ACTION WAIVER; GENERAL INFORMATION.
        </Text>
        <Text style={styles.textTermsStyle}>
          11. No Third Party Beneficiaries
        </Text>
        <Text style={styles.textTermsStyle}>
          You agree that, except as otherwise expressly provided in these Terms,
          there shall be no third party beneficiaries to the Terms.
        </Text>
        <Text style={styles.textTermsStyle}>
          12. Notice and Procedure For Making Claims of Copyright Infringement
        </Text>
        <Text style={styles.textTermsStyle}>
          If you believe that your copyright or the copyright of a person on
          whose behalf you are authorized to act has been infringed, please
          provide Velas Wallet’s Copyright Agent a written Notice containing the
          following information:
        </Text>
        <Text style={styles.textTermsStyle}>
          · an electronic or physical signature of the person authorized to act
          on behalf of the owner of the copyright or other intellectual property
          interest;
        </Text>
        <Text style={styles.textTermsStyle}>
          · a description of the copyrighted work or other intellectual property
          that you claim has been infringed;
        </Text>
        <Text style={styles.textTermsStyle}>
          · a description of where the material that you claim is infringing is
          located on the Service;
        </Text>
        <Text style={styles.textTermsStyle}>
          · your address, telephone number, and email address;
        </Text>
        <Text style={styles.textTermsStyle}>
          · a statement by you that you have a good faith belief that the
          disputed use is not authorized by the copyright owner, its agent, or
          the law;
        </Text>
        <Text style={styles.textTermsStyle}>
          · a statement by you, made under penalty of perjury, that the above
          information in your Notice is accurate and that you are the copyright
          or intellectual property owner or authorized to act on the copyright
          or intellectual property owner's behalf.
        </Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet’s Copyright Agent can be reached at:
        </Text>
        <Text style={styles.textTermsStyle}>
          Email: copyright at Velas Wallet dot io
        </Text>
        <Text style={styles.textTermsStyle}>Mail:</Text>
        <Text style={styles.textTermsStyle}>Attention:</Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet Copyright ℅ ConsenSys
        </Text>
        <Text style={styles.textTermsStyle}>49 Bogart Street</Text>
        <Text style={styles.textTermsStyle}>Brooklyn, NY 11206</Text>
        <Text style={styles.textTermsStyle}>
          13. Binding Arbitration and Class Action Waiver
        </Text>
        <Text style={styles.textTermsStyle}>
          PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT YOUR
          LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT
        </Text>
        <Text style={styles.textTermsStyle}>
          13.1 Initial Dispute Resolution
        </Text>
        <Text style={styles.textTermsStyle}>
          The parties shall use their best efforts to engage directly to settle
          any dispute, claim, question, or disagreement and engage in good faith
          negotiations which shall be a condition to either party initiating a
          lawsuit or arbitration.
        </Text>
        <Text style={styles.textTermsStyle}>13.2 Binding Arbitration</Text>
        <Text style={styles.textTermsStyle}>
          If the parties do not reach an agreed upon solution within a period of
          30 days from the time informal dispute resolution under the Initial
          Dispute Resolution provision begins, then either party may initiate
          binding arbitration as the sole means to resolve claims, subject to
          the terms set forth below. Specifically, all claims arising out of or
          relating to these Terms (including their formation, performance and
          breach), the parties’ relationship with each other and/or your use of
          the Service shall be finally settled by binding arbitration
          administered by the American Arbitration Association in accordance
          with the provisions of its Commercial Arbitration Rules and the
          supplementary procedures for consumer related disputes of the American
          Arbitration Association (the "AAA"), excluding any rules or procedures
          governing or permitting class actions.
        </Text>
        <Text style={styles.textTermsStyle}>
          The arbitrator, and not any federal, state or local court or agency,
          shall have exclusive authority to resolve all disputes arising out of
          or relating to the interpretation, applicability, enforceability or
          formation of these Terms, including, but not limited to any claim that
          all or any part of these Terms are void or voidable, or whether a
          claim is subject to arbitration. The arbitrator shall be empowered to
          grant whatever relief would be available in a court under law or in
          equity. The arbitrator’s award shall be written, and binding on the
          parties and may be entered as a judgment in any court of competent
          jurisdiction.
        </Text>
        <Text style={styles.textTermsStyle}>
          The parties understand that, absent this mandatory provision, they
          would have the right to sue in court and have a jury trial. They
          further understand that, in some instances, the costs of arbitration
          could exceed the costs of litigation and the right to discovery may be
          more limited in arbitration than in court.
        </Text>
        <Text style={styles.textTermsStyle}>13.3 Location</Text>
        <Text style={styles.textTermsStyle}>
          Binding arbitration shall take place in New York. You agree to submit
          to the personal jurisdiction of any federal or state court in New York
          County, New York, in order to compel arbitration, to stay proceedings
          pending arbitration, or to confirm, modify, vacate or enter judgment
          on the award entered by the arbitrator.
        </Text>
        <Text style={styles.textTermsStyle}>13.4 Class Action Waiver</Text>
        <Text style={styles.textTermsStyle}>
          The parties further agree that any arbitration shall be conducted in
          their individual capacities only and not as a class action or other
          representative action, and the parties expressly waive their right to
          file a class action or seek relief on a class basis. YOU AND Velas
          Wallet AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR
          OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN
          ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. If any court or
          arbitrator determines that the class action waiver set forth in this
          paragraph is void or unenforceable for any reason or that an
          arbitration can proceed on a class basis, then the arbitration
          provision set forth above shall be deemed null and void in its
          entirety and the parties shall be deemed to have not agreed to
          arbitrate disputes.
        </Text>
        <Text style={styles.textTermsStyle}>
          13.5 Exception - Litigation of Intellectual Property and Small Claims
          Court Claims
        </Text>
        <Text style={styles.textTermsStyle}>
          Notwithstanding the parties' decision to resolve all disputes through
          arbitration, either party may bring an action in state or federal
          court to protect its intellectual property rights ("intellectual
          property rights" means patents, copyrights, moral rights, trademarks,
          and trade secrets, but not privacy or publicity rights). Either party
          may also seek relief in a small claims court for disputes or claims
          within the scope of that court’s jurisdiction.
        </Text>
        <Text style={styles.textTermsStyle}>13.6 30-Day Right to Opt Out</Text>
        <Text style={styles.textTermsStyle}>
          You have the right to opt-out and not be bound by the arbitration and
          class action waiver provisions set forth above by sending written
          notice of your decision to opt-out to the following address: Velas
          Wallet ℅ ConsenSys, 49 Bogart Street, Brooklyn NY 11206 and via email
          at legal-opt@Velas.space. The notice must be sent within 30 days of
          September 6, 2016 or your first use of the Service, whichever is
          later, otherwise you shall be bound to arbitrate disputes in
          accordance with the terms of those paragraphs. If you opt-out of these
          arbitration provisions, Velas Wallet also will not be bound by them.
        </Text>
        <Text style={styles.textTermsStyle}>13.7 Changes to This Section</Text>
        <Text style={styles.textTermsStyle}>
          Velas Wallet will provide 60-days’ notice of any changes to this
          section. Changes will become effective on the 60th day, and will apply
          prospectively only to any claims arising after the 60th day.
        </Text>
        <Text style={styles.textTermsStyle}>
          For any dispute not subject to arbitration you and Velas Wallet agree
          to submit to the personal and exclusive jurisdiction of and venue in
          the federal and state courts located in New York, New York. You
          further agree to accept service of process by mail, and hereby waive
          any and all jurisdictional and venue defenses otherwise available.
        </Text>
        <Text style={styles.textTermsStyle}>
          The Terms and the relationship between you and Velas Wallet shall be
          governed by the laws of the State of New York without regard to
          conflict of law provisions.
        </Text>
        <Text style={styles.textTermsStyle}>14. General Information</Text>
        <Text style={styles.textTermsStyle}>14.1 Entire Agreement</Text>
        <Text style={styles.textTermsStyle}>
          These Terms (and any additional terms, rules and conditions of
          participation that Velas Wallet may post on the Service) constitute the
          entire agreement between you and Velas Wallet with respect to the
          Service and supersedes any prior agreements, oral or written, between
          you and Velas Wallet. In the event of a conflict between these Terms
          and the additional terms, rules and conditions of participation, the
          latter will prevail over the Terms to the extent of the conflict.
        </Text>
        <Text style={styles.textTermsStyle}>
          14.2 Waiver and Severability of Terms
        </Text>
        <Text style={styles.textTermsStyle}>
          The failure of Velas Wallet to exercise or enforce any right or
          provision of the Terms shall not constitute a waiver of such right or
          provision. If any provision of the Terms is found by an arbitrator or
          court of competent jurisdiction to be invalid, the parties
          nevertheless agree that the arbitrator or court should endeavor to
          give effect to the parties' intentions as reflected in the provision,
          and the other provisions of the Terms remain in full force and effect.
        </Text>
        <Text style={styles.textTermsStyle}>14.3 Statute of Limitations</Text>
        <Text style={styles.textTermsStyle}>
          You agree that regardless of any statute or law to the contrary, any
          claim or cause of action arising out of or related to the use of the
          Service or the Terms must be filed within one (1) year after such
          claim or cause of action arose or be forever barred.
        </Text>
        <Text style={styles.textTermsStyle}>14.4 Section Titles</Text>
        <Text style={styles.textTermsStyle}>
          The section titles in the Terms are for convenience only and have no
          legal or contractual effect.
        </Text>
        <Text style={styles.textTermsStyle}>14.5 Communications</Text>
        <Text style={styles.textTermsStyle}>
          Users with questions, complaints or claims with respect to the Service
          may contact us using the relevant contact information set forth above
          and at communications@Velas.space.
        </Text>
        <Text style={styles.textTermsStyle}>15 Related Links</Text>
        <Text />
      </View>
    );
  };
  return (
    <View style={styles.viewFlex}>
      <ImageBackground
        source={require("../assets/intro-bg.jpg")}
        style={styles.introBackground}
      >
        <Header transparent style={styles.mtIphoneX}>
          <Left style={styles.viewFlex} />
          <Body style={styles.viewFlex} />
          <Right style={styles.viewFlex} />
        </Header>
        <View style={styles.containerFlexStart}>
          <Image
            source={require("../assets/velas-logo.png")}
            style={styles.styleLogo}
          />
          <Text style={styles.textH1Seed}>Terms of Use</Text>
          <View style={styles.card1}>
            <CardItem style={styles.cardItemSeed}>
              <Body>
                <View style={styles.bodyTerms}>
                  <ScrollView style={{ padding: 10 }}>
                    {terms(store)}
                  </ScrollView>
                </View>

                <Text style={{ fontSize: 14, color: "#fff", marginTop: 15 }}>
                  By clicking the button you accept the terms of use
                </Text>

                <View style={styles.marginBtn}>{buttonAccept(store)}</View>
              </Body>
            </CardItem>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
