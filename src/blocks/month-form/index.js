import React, { Component } from 'react';
var axios = require('axios');
import './styles.scss';

import CardInterview from '../../blocks/card-interview';
import PopUpInterview from '../../blocks/popup-interview';
import Draft from '../../blocks/Draft';

class MonthForm extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      months: [],
      fixedPreview: '',
      portraitPreview: null,
      portraitFile: '',
      logoPreview: null,
      logoFile: '',
      newId:'', 
      newDate: '',
      month: {
        id : "preview",
        fullDate : "preview",
        guest : "",
        interview : {
          portrait: "preview/portrait.png",
          date : "preview",
          name : "",
          intro:"<p>Preview du texte d'introduction</p>",
          logo : 'preview/logo.png',
          url : "",
          popin : "<p><strong>Exemple de question</strong></p><p>Exemple de réponse</p>"
        }
      }
    };
  }

  componentDidMount() {
    var _this = this;
    // This setps up the static scrolling for the preview card
    var staticScroll = function (){
      var previewOffset = _this.refs.previewColumn.getClientRects()[0].top;        
      window.addEventListener('scroll', function() {
        var currentScroll = window.scrollY;
        if(currentScroll + 120 >= previewOffset){
          _this.setState({
            fixedPreview: 'fixed'
          })
        }
        else{
          _this.setState({
            fixedPreview: ''
          })
        }
      });
    };
    staticScroll();

    // If the component has a "contents" prop then we're not creating new stuff but editing old stuff. 
    if(!this.props.contents){
      // But if it doesn't then we need to know which months are available to create
      axios.get("../data/data.json").then(function(result) {    
        _this.setState({
          months: result.data.months.reverse()
        });
      });
    }
    else{
      // If it does though, then we just take that month data off the prop and feed it to the fields
      _this.setState({
        month: _this.props.contents
      });
    }
  }
  
  // Props can take a while to come through as the ajax request may take a while
  componentWillReceiveProps(nextProps) {
    // We ensure here the component knows what to do when the props change
    this.setState({
      month: nextProps.contents
    });
  }

  // Changing the portrait image (when you select a file to upload)
  portraitChange(event){
    event.preventDefault();
    var reader = new FileReader(),
        file = event.target.files[0];
    reader.onloadend = () =>{
      this.setState({
        portraitFile: file,
        portraitPreview: reader.result
      });
    }
    reader.readAsDataURL(file);
  }

  // Same for the logo
  logoChange(event){
    event.preventDefault();
    var reader = new FileReader(),
        file = event.target.files[0];
    reader.onloadend = () =>{
      this.setState({
        logoFile: file,
        logoPreview: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  // Changes to the intro are directly reported to the state object
  introChange(value){
    var month = this.state.month;
    month.interview.intro = value;
    this.setState((prevState, props) => ({
      month: month
    }));
  }

  // Same with the interview copy
  popinChange(value){
    var month = this.state.month;
    month.interview.popin = value;
    this.setState((prevState, props) => ({
      month: month
    }));
  }
  // Every other text input updates the state through the following method
  updateState(event){
    var itemToUpdate = event.target.id, 
        newValue = event.target.value,
        depth = itemToUpdate.split('-'),
        month = this.state.month;

    if(depth[0]==='interview'){
      month['interview'][depth[1]] = newValue;
    }
    else{
      month[itemToUpdate] = newValue;
    }
    this.setState((prevState, props) => ({
      month: month
    }));
  }
  // When you pick an available month down the list, the state is warned
  updateChosenMonth(event){
    console.log(event.target.value);
    var value = event.target.value,
        newId = value.split('_')[0], 
        newDate = value.split('_')[1];

    this.setState({
      newId: newId,
      newDate: newDate
    })
  }

  // here, we submit the form
  manageSubmit(event){
    event.preventDefault();

    // Let's make a few helper function
    function isURL(str) {
       var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
       var url = new RegExp(urlRegex, 'i');
       return str.length < 2083 && url.test(str);
    }
    function emptyFields(){
      alert('Tous les champs sont obligatoires, merci de les renseigner !');
    }
    function badUrl(){
      alert("L'URL du blog n'est pas valide. Merci de respecter le format 'http://www.xyz.com'");
    }

    // Check that fields are not empty
    if(this.state.month.guest === '' || 
       this.state.month.interview.name === '' || 
       this.state.month.interview.url === '' || 
       this.state.month.interview.intro === "<p>Preview du texte d'introduction</p>" || 
       this.state.month.interview.popin === "<p><strong>Exemple de question</strong></p><p>Exemple de réponse</p>" || 
       this.state.month.interview.intro === "" || 
       this.state.month.interview.popin === "" || 
       (this.state.newId === '' && this.state.month.id === 'preview') || 
       (this.state.newDate === '' && this.state.month.fullDate === 'preview')){
      emptyFields();
    }
    // If not empty, check the URL is indeed a URL
    else if(this.state.month.interview.url !== '' && !isURL(this.state.month.interview.url) ){
      badUrl();
    }
    // if all is well, proceed
    else{
      // Now, let's check what action whe need to undertake
      if(this.props.actionType && this.props.actionType === "edit"){
        // We're here to edit some stuff, so let's push the right things in
        // All the copy elements should automatically update the state, but the images values are kept separate
        // We therefore need to reinsert them into the "month" state
        
        // If the portrait has been changed, we store its base64 value:
        var updatePackage = this.state.month;
        if(this.state.portraitPreview){
          updatePackage.interview.portrait = this.state.portraitPreview;
          this.setState((prevState, props) => ({
            month: updatePackage
          }));
        }

        // If the logo has been changed, we store its base64 value:
        if(this.state.logoPreview){
          updatePackage.interview.logo = this.state.logoPreview;
          this.setState((prevState, props) => ({
            month: updatePackage
          }));
        }

        // below we would then update the data, then redirect to the previously browsed month
        console.log("Edit month " + this.state.month.id + " with: ");
        console.log(this.state.month);
        alert('This month has been updated!');
        const path = "/month/" + this.state.month.id;
        this.context.router.push(path);
      }
      else{
        // If it's not specified, we'll assume the type is "create a month"
        // So we build the necessary object as such:
        var portrait = this.state.portraitPreview,
            logo = this.state.logoPreview,
            id = this.state.newId, 
            fullDate = this.state.newDate, 
            guest= this.state.month.guest, 
            intro = this.state.month.interview.intro, 
            url = this.state.month.interview.url, 
            popin = this.state.month.interview.popin;

        var updateObject = {
          filled : true, 
          id: id, 
          fullDate: fullDate, 
          status: 'offline', 
          guest: guest, 
          interview: {
            portrait: portrait, 
            date: id, 
            name: guest, 
            intro: intro, 
            logo: logo, 
            url: url, 
            popin: popin
          } 
        }

        console.log('Create month with: ');
        console.log(updateObject);
        alert('This month has been created!');
        const path = "/";
        this.context.router.push(path);
      }
    }
  }

  render() {
    var _this = this;
    var previewImages = {
      portrait: this.state.portraitPreview,
      logo: this.state.logoPreview,
    }

    // Available months are either a list (creating a new month)
    var availableMonths;
    if(this.state.months.length > 0){
      // Which is provided as a array and therefore is looped
      availableMonths = _this.state.months.reverse().map(function(month) {
        if(!month.filled){
          return (
            <option value={month.id + "_" + month.fullDate} key={"month-" + month.id}>{month.fullDate}</option>
          )
        }
        else{
          return false;
        }
      });
    }
    else{
      // Or it's a already been defined and therefore is just the one lonely option
      availableMonths = <option value={this.state.month.id + "_" + this.state.month.fullDate} key={"month-" + this.state.month.id}>{this.state.month.fullDate}</option>;
    }

    return (
      <div className="monthForm">
        <div className={"column preview " + this.state.fixedPreview} ref="previewColumn">
          <CardInterview month={this.state.month} preview="true" previewImages={previewImages} />
          <PopUpInterview interview={this.state.month.interview} />
          &nbsp;
        </div>
        <div className="column controls">
          <form className="form" onSubmit={this.manageSubmit.bind(this)}>
            <h2 className="section-title">Carte</h2>
            <fieldset>
              <label htmlFor="months">Mois disponibles</label>
              <select id="months" onChange={this.updateChosenMonth.bind(this)}>
                {availableMonths}
              </select>
            </fieldset>

            <fieldset>
              <label htmlFor="portrait">Portrait du mois</label>
              <input type="file" id="portrait" accept="image/gif,image/jpeg,image/png" onChange={(event)=>this.portraitChange(event)}/>
            </fieldset>

            <fieldset>
              <label htmlFor="logo">Logo du mois</label>
              <input type="file" id="logo" accept="image/gif, image/jpeg, image/png" onChange={(event)=>this.logoChange(event)} />
            </fieldset>

            <fieldset>
              <label htmlFor="copy">Texte d'introduction</label>
              <textarea id="copy" className="richEditor" type="hidden" value={this.state.month.interview.intro}></textarea>
              <Draft default={this.state.month.interview.intro} onChange={this.introChange.bind(this)} button="standards" />
            </fieldset>

            <h2 className="section-title">Pop-up</h2>

            <fieldset>
              <label htmlFor="name">Nom de l'invitée</label>
              <input ref="guest" type="text" id="guest" value={this.state.month.guest} onChange={this.updateState.bind(this)}/>
            </fieldset>

            <fieldset>
              <label htmlFor="interview-name">Nom du blog</label>
              <input ref="name" type="text" id="interview-name" value={this.state.month.interview.name} onChange={this.updateState.bind(this)}/>
            </fieldset>

            <fieldset>
              <label htmlFor="interview-url">URL du blog</label>
              <input ref="url" placeholder="http://www.ywz.fr" type="text" id="interview-url" value={this.state.month.interview.url} onChange={this.updateState.bind(this)}/>
            </fieldset>

            <fieldset>
              <label htmlFor="interview">Interview</label>
              <textarea id="interview" className="richEditor" type="hidden" value={this.state.month.interview.popin}></textarea>
              <Draft default={this.state.month.interview.popin} onChange={this.popinChange.bind(this)} button="standards" />
            </fieldset>

            <fieldset>
              <label htmlFor="illus">Image de l'interview</label>
              <input type="file" id="illus" accept="image/gif, image/jpeg, image/png" />
            </fieldset>

            <fieldset className="text-center">
              <button type="submit" className="btn blue">Valider</button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
};

// We need this to enable redirects within the methods
MonthForm.contextTypes = {
  router: React.PropTypes.object
}

export default MonthForm;
