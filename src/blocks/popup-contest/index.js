import React, { Component } from 'react';
import './styles.scss';

class PopUpContest extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    this.setState({
    })
  }

  render() {
    var prefix = 'day-' + this.props.monthId + '-';
    return (
      <div id={"card-contest-" + this.props.contents.date.replace('/', '-') + "-16"} className="card-popup mfp-hide">
        <div className="contest">
          <form className="ajaxForm form" data-parsley-validate method="POST" action="https://6mylxq1qkc.execute-api.us-west-2.amazonaws.com/production/games/v1/sweepstake/">
            <input type="hidden" name="contestId" value={this.props.contestId} />
            <h2 className="title">Jeu concours</h2>
            <h3 className="title small">Tentez votre chance pour remporter <br/>un bon d’achat C&amp;A de 500€</h3>
            <h4 className="subtitle">Inscription</h4>
            <div className="data">
              <fieldset>
                <label><span>Nom*</span></label>
                <div>
                  <input type="text" name="lastName" data-parsley-required />
                </div>
              </fieldset>
              <fieldset>
                <label><span>Prénom*</span></label>
                <div>
                  <input type="text" name="firstName" data-parsley-required />
                </div>
              </fieldset>
              <fieldset>
                <label><span>Email*</span></label>
                <div>
                  <input type="email" name="email" id={prefix + "primaryEmail"} data-parsley-required />
                </div>
              </fieldset>
              <fieldset>
                <label><span>Confirmation adresse Email*</span></label>
                <div>
                  <input type="email" name="email" data-parsley-required data-parsley-equalto={"#" +  prefix + "primaryEmail"} />
                </div>
              </fieldset>
            </div>

            <div className="checkboxes">
              <fieldset className="check">
                <input type="checkbox" name="rulesAcceptance" id={prefix + "rulesAcceptance"} data-parsley-required />
                <label htmlFor={prefix + "rulesAcceptance"}>J'ai lu et j'accepte le <a href={process.env.PUBLIC_URL + "/pdf/reglement.pdf"} target="_blank">réglement du jeu concours</a>*</label>
              </fieldset>

              <fieldset className="check">
                <input type="checkbox" name="optin1" id="{{prefix}}optin1" />
                <label htmlFor={prefix +"optin1"}>Je souhaite m´abonner à la newsletter C&amp;A pour recevoir les dernières actualités sur nos collections et promotions. J´ai pour cela lu et accepté la <a href="http://www.c-and-a.com/webapp/wcs/stores/servlet/InfoPopupView?categoryId=11013&amp;langId=-2&amp;storeId=10155" target="_blank">déclaration de protection des données</a>.</label>
              </fieldset>
            </div>

            <hr/>

            <div className="form-control submit">
              <button className="formSubmit" type="submit">Je valide</button>
            </div>

            <p className="legal">* Champs obligatoires</p>
          </form>
        </div>
      </div>
    );
  }
};

export default PopUpContest;
