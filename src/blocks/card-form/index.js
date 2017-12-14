import React, { Component } from 'react';
var axios = require('axios');
import './styles.scss';

import CardSingle from '../../blocks/card-single';
import PopUpTotal from '../../blocks/popup-total';
import PopUpSingle from '../../blocks/popup-single';
import PopUpSlider from '../../blocks/popup-slider';

import Draft from '../../blocks/Draft';

//import Draft from '../../blocks/Draft';

class CardForm extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      month: this.props.month,
      previewImage: false,
      card: {
        "status" : "offline",
        "date" : "",
        "rank" : "",
        "white" : false,
        "type" : "image", 
        "image" : "preview/card.png",
        "copy" : false,
        "popin" : 
          {
            "type" : "single", 
            "copy" : "",
            "products" : [], 
            "image" : "preview/pop-in.png",
            "url" : "#"
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
    if(this.props.contents){
      // If it does though, then we just take that month data off the prop and feed it to the fields
      _this.setState({
        month: _this.props.month, 
        card: _this.props.contents
      });
    }
  }

  // Props can take a while to come through as the ajax request may take a while
  componentWillReceiveProps(nextProps) {
    // We ensure here the component knows what to do when the props change
    this.setState({
      card: nextProps.contents
    });
  }

  // Every other text input updates the state through the following method
  updateState(event){
    var itemToUpdate = event.target.id, 
        newValue = event.target.value,
        depth = itemToUpdate.split('-'),
        card = this.state.card;

    // If you're changing the pop-in type, I'll have to check for products
    if(depth[0]==='popin'){
      if((depth[1] === "type" && newValue === "slider" && this.state.card.popin.products.length > 0) ||
        (depth[1] === "type" && card.popin.type === "slider" && this.state.card.popin.products.length > 0) ){
        // if there are products and you're switching to or from a slider type, then they'll have to go 
        var checkForProducts = confirm('Les produits que vous avez ajouté à cette carte devront être recréés'); 
        if(checkForProducts){
          card['popin'][depth[1]] = newValue;
          card['popin']['products'] = [];
        }
      }
      else{
        card['popin'][depth[1]] = newValue;
      }
    }
    else{
      card[itemToUpdate] = newValue;
    }
    this.setState((prevState, props) => ({
      card: card
    }));
    console.log(this.state.card);
  }

  // Let's update the date color
  updateColor(event){
    var card = this.state.card;
    card["white"] = !card["white"];
    this.setState({
      card: card
    })
  }

  // Let's update the card image
  cardImageChange(event){
    event.preventDefault();
    var reader = new FileReader(),
        file = event.target.files[0];

    var card = this.state.card;
    reader.onloadend = () =>{
      card["image"] = reader.result
      this.setState({
        card: card, 
        previewImage: true
      })
    }
    reader.readAsDataURL(file);
  }

  // Changes to the intro and popin copy are directly reported to the state object
  copyChange(value){
    var card = this.state.card;
    card.copy = value;
    this.setState((prevState, props) => ({
      card: card
    }));
  }
  popinCopyChange(value){
    var card = this.state.card;
    card.popin.copy = value;
    this.setState((prevState, props) => ({
      card: card
    }));
  }

  // Pop-in image has to be added to the state if present
  popinImageFactory(event){
    event.preventDefault();
    var reader = new FileReader(),
        file = event.target.files[0],
        card = this.state.card;
    reader.onloadend = () =>{
      card.popin.image = reader.result
      this.setState((prevState, props) => ({
        card: card
      }));
    }
    reader.readAsDataURL(file);
  }

  // Let's hold a product image when you create a product slider
  productImageFactory(event){
    event.preventDefault();
    var reader = new FileReader(),
        file = event.target.files[0];
    reader.onloadend = () =>{
      this.setState({
        productImage: reader.result
      })
    }
    reader.readAsDataURL(file);
  }
  // add a product to the card
  addProduct(event){
    var name = this.refs.productName.value,
        price = this.refs.productPrice.value,
        card = this.state.card, 
        product;
    // Determine pop-in type and therefore product structure
    if(this.state.card.popin.type !== "slider") {
      if(name && price){
        product = name + ", <strong>" + price + "</strong>";
        card.popin.products.push(product);
        this.setState((prevState, props) => ({
          card: card
        }));
        this.refs.productName.value = ""; 
        this.refs.productPrice.value = "";
      }
      else{
        return false;
      }
    }
    else{
      var desc = this.refs.productDescription.value,
        image = this.state.productImage;

      if(name && price && desc && image){
        product = {
          title: name,
          price: price, 
          copy: desc,
          image: image
        };
        card.popin.products.push(product);
        this.setState((prevState, props) => ({
          card: card
        }));
        this.refs.productName.value = ""; 
        this.refs.productPrice.value = "";
        this.refs.productDescription.value = "";
        this.refs.productImage.value = "";
      }
      else{
        return false;
      }
    }
  }
  removeProduct(event){
    console.log(event.target.dataset.index);
    var targetIndex = event.target.dataset.index, 
        card = this.state.card;

    card.popin.products.splice(targetIndex, 1);
    this.setState((prevState, props) => ({
      card: card
    }));
    console.log(this.state.card.popin.products);
  }

  
  // here, we submit the form
  manageSubmit(event){
    event.preventDefault();
    console.log(this.state.card);

    // Let's make a few helper function
    function isDate(str) {
       var dateRegex = "(\\d{2}\\/\\d{2})$";
       var date = new RegExp(dateRegex, 'i');
       return str.length < 2083 && date.test(str);
    }
    function isRank(str) {
       var rankRegex = "(\\d)$";
       var rank = new RegExp(rankRegex, 'i');
       return str.length < 2083 && rank.test(str);
    }
    function emptyFields(){
      alert("Merci de renseigner tous les champs marqués d'un *");
    }
    function badDate(){
      alert("Merci de renseigner une date au format 'jj/mm' ex: 31/12");
    }
    function badRank(){
      alert("Le rang doit être un chiffre entier inférieur à 99.");
    }

    // Check that fields are not empty
    if(this.state.card.date === '' || 
      this.state.card.rank === '' || 
       this.state.card.popin.copy === '' || 
       this.state.card.image === "preview/card.png"){
      emptyFields();
    }
    // If not empty, check the URL is indeed a URL
    else if(this.state.card.date !== '' && !isDate(this.state.card.date) ){
      badDate();
    }
    else if(this.state.card.rank !== '' && !isRank(this.state.card.rank) ){
      badRank();
    }
    // if all is well, proceed
    else{
      // Now, let's check what action whe need to undertake
      if(this.props.actionType && this.props.actionType === "edit"){
        // We're here to edit some stuff, so let's push the right things in
        // All the copy elements should automatically update the state, but the images values are kept separate
        // We therefore need to reinsert them into the "month" state

        var card = this.state.card, 
            targetMonth = this.props.month.id;
        var cardCopy = card.copy;
        
        if(cardCopy === "<p>&nbsp;<br/></p>" || cardCopy === "<p><br/></p>" || cardCopy === "<p><br></p>"){
          cardCopy = false;
          card.copy = cardCopy;
          this.setState((prevState, props) => ({
            card: card
          }));
        }

        // below we would then update the data, then redirect to the previously browsed month
        console.log('Edit card with date ' + this.state.card.date + ' in month ' + targetMonth + ' with: ');
        console.log(this.state.card);
        alert('Cette carte a été modifiée!');
        const path = "/month/" + targetMonth;
        this.context.router.push(path);
      }
      else{
        // If it's not specified, we'll assume the type is "create a card"
        // We should have the card object in hand now, but just to be sure we'll clean up some parts 
        // Card copy can get polluted by the RTE, so it's better to clean it up before sending it off
        var card = this.state.card, 
            targetMonth = this.props.month;
        var cardCopy = card.copy;
        
        if(cardCopy === "<p>&nbsp;<br/></p>" || cardCopy === "<p><br/></p>" || cardCopy === "<p><br></p>"){
          cardCopy = false;
          card.copy = cardCopy;
          this.setState((prevState, props) => ({
            card: card
          }));
        }

        console.log('Create card in month ' + targetMonth + ' with: ');
        console.log(this.state.card);
        alert('This card has been added!');
        const path = "/month/" + targetMonth;
        this.context.router.push(path);
      }
    }
  }

  render() {
    var _this = this;

    // Determine type of the popin to preview
    var popInType = function(){
      if(_this.state.card.popin.type === "total"){
        return (
          <PopUpTotal contents={_this.state.card.popin} date={_this.state.card.date} key={"popup-" + _this.state.card.type + '-' + _this.state.card.date.replace('/', '-')}/>
        )
      }
      else if(_this.state.card.popin.type === "single"){
        return(
          <PopUpSingle contents={_this.state.card.popin} date={_this.state.card.date} key={"popup-" + _this.state.card.type + '-' + _this.state.card.date.replace('/', '-')}/>
        )
      }
      else{
        return(
          <PopUpSlider contents={_this.state.card.popin} date={_this.state.card.date} key={"popup-" + _this.state.card.type + '-' + _this.state.card.date.replace('/', '-')}/>
        )
      }
    }
    
    // Create the RTE for the card copy
    var defaultCopy = function(){
      if(_this.state.card.copy){
        return(
          <fieldset>
            <label htmlFor="copy">Texte optionnel</label>
            <textarea id="copy" className="richEditor" type="hidden" value={_this.state.card.copy}></textarea>
            <Draft default={_this.state.card.copy} onChange={_this.copyChange.bind(_this)} />
          </fieldset>
        )
      }
      else{
        return(
          <fieldset>
            <label htmlFor="copy">Texte optionnel</label>
            <textarea id="copy" className="richEditor" type="hidden" value={_this.state.card.copy}></textarea>
            <Draft onChange={_this.copyChange.bind(_this)} button="advanced" />
          </fieldset>
        )
      }
    }
    // Create the RTE for the pop-in copy
    var popinCopy = function(){
      if(_this.state.card.popin.copy){
        return(
          <fieldset>
            <label htmlFor="popin-copy">Texte du pop-in*</label>
            <textarea id="popin-copy" className="richEditor" type="hidden" value={_this.state.card.popin.copy}></textarea>
            <Draft default={_this.state.card.popin.copy} onChange={_this.popinCopyChange.bind(_this)} />
          </fieldset>
        )
      }
      else{
        return(
          <fieldset>
            <label htmlFor="popin-copy">Texte du pop-in*</label>
            <textarea id="popin-copy" className="richEditor" type="hidden" value={_this.state.card.popin.copy}></textarea>
            <Draft onChange={_this.popinCopyChange.bind(_this)} button="advanced" />
          </fieldset>
        )
      }
    }

    // Depending on popin type, create the popinimage input
    var popinImageInput = function(){
      if(_this.state.card.popin.type !== "slider"){
        return(
          <fieldset>
            <label htmlFor="popinImage">Image du popin*</label>
            <input type="file" id="popinImage" accept="image/gif,image/jpeg,image/png" onChange={(event)=>_this.popinImageFactory(event)}/>
          </fieldset>
        )
      }
    }
      
    // Creating the dropdown choices for the popin type
    var types = ['slider', 'total', 'single'];
    var popInOptions = types.map(function(type){
      return(
        <option value={type} key={'pop-' + type}>{type}</option>
      )
    });

    // Create the list of available products
    var productList = function(){
      var makeList = _this.state.card.popin.products.map(function(product, index){
        var contents;
        if(typeof(product) !== "string"){
          contents= {__html: product.title + " | <strong>" + product.price + "</strong> | " + product.copy }; 
          var productImage; 
          if(product.image.split(":")[0] === "data"){
            productImage = <figure><img src={product.image} alt="" /></figure>
          }
          else{
            productImage = <img src={process.env.PUBLIC_URL + "/images/" + product.image} alt="" />
          }
          return(
            <div className="product-item slide" key={"product-" + index}>
              <button className="remove" type="button" ref="removeItem" data-index={index} title="Supprimer" onClick={_this.removeProduct.bind(_this)}>-</button>
              <p dangerouslySetInnerHTML={contents}></p>
              <figure>{productImage}</figure>
            </div>
          )
        }
        else{
          contents= {__html: product}; 
          return(
            <div className="product-item" key={"product-" + index}>
              <button className="remove" type="button" ref="removeItem" data-index={index} title="Supprimer" onClick={_this.removeProduct.bind(_this)}>-</button>
              <p dangerouslySetInnerHTML={contents}></p>
            </div>
          )
        }
      })

      if(_this.state.card.popin.products.length > 0){
        return(
          makeList
        )
      }
      else{
        return(
          <p className="warning">Il n'y a pas de produits liés pour le moment.<br/> Ajoutez un produit ci-dessous.</p>
        )
      }
    }

    // Create the component responsible for adding products.
    var productComponent = function(){
      if(_this.state.card.popin.type !== "slider"){
        return(
          <div className="productAddForm" ref="productForm">
            <fieldset>
              <label htmlFor="productName">Nom du produit</label>
              <input ref="productName" id="productName" type="text"></input>
            </fieldset>
            <fieldset>
              <label htmlFor="productPrice">Prix du produit</label>
              <input ref="productPrice" id="productPrice" type="text"></input>
            </fieldset>
            <fieldset>
              <button type="button" className="btn blue small" onClick={_this.addProduct.bind(_this)}>Ajouter</button>
            </fieldset>
          </div>
        )
      }
      else{
        return(
          <div className="productAddForm" ref="productForm">
            <fieldset>
              <label htmlFor="productName">Nom du produit</label>
              <input ref="productName" id="productName" type="text"></input>
            </fieldset>
            <fieldset>
              <label htmlFor="productPrice">Prix du produit</label>
              <input ref="productPrice" id="productPrice" type="text"></input>
            </fieldset>
            <fieldset>
              <label htmlFor="productDescription">Description du produit</label>
              <input ref="productDescription" id="productName" type="text"></input>
            </fieldset>
            <fieldset>
              <label htmlFor="productImage">Image du produit</label>
              <input type="file" ref="productImage" id="productImage" accept="image/gif,image/jpeg,image/png" onChange={_this.productImageFactory.bind(_this)}/>
            </fieldset>
            <fieldset>
              <button type="button" className="btn blue small" onClick={_this.addProduct.bind(_this)}>Ajouter</button>
            </fieldset>
          </div>
        )
      }
    }

    return (
      <div className="cardForm">
        <div className={"column preview " + this.state.fixedPreview} ref="previewColumn">
          <CardSingle previewImage={_this.state.previewImage} ref="card" type={this.state.card.type}  status={this.state.card.status} month={this.state.month}  key={"card-" + this.state.card.type + '-' + this.state.card.date} card={this.state.card} preview="true" />
          {popInType()}
          &nbsp;
        </div>
        <div className="column controls">
          <form className="form" onSubmit={this.manageSubmit.bind(this)}>
            <h2 className="section-title">Carte</h2>
            <fieldset>
              <label htmlFor="date">Date*</label>
              <input ref="date" type="text" id="date" value={this.state.card.date} onChange={this.updateState.bind(this)} placeholder="jj/mm"/>
              <div className="check">
                <label htmlFor="white">Date en blanc</label>
                <input type="checkbox" id="white" value="white" onChange={this.updateColor.bind(this)} />
              </div>
            </fieldset>
            <fieldset>
              <label htmlFor="rank">Rang*</label>
              <input type="number" id="rank" value={this.state.card.rank} onChange={this.updateState.bind(this)}/>
            </fieldset>
            <fieldset>
              <label htmlFor="cardImage">Image de la carte*</label>
              <input type="file" id="cardImage" accept="image/gif,image/jpeg,image/png" onChange={(event)=>this.cardImageChange(event)}/>
            </fieldset>
            {defaultCopy()}

            <h2 className="section-title">Pop-in</h2>
            <fieldset>
              <label htmlFor="popin-type">Type de pop-in</label>
              <select id="popin-type" defaultValue={this.state.card.popin.type} onChange={this.updateState.bind(this)}>
                {popInOptions}
              </select>
            </fieldset>

            {popinCopy()}

            {popinImageInput()}

            <fieldset>
              <label>Produits rattachés</label>
              {productList()}
              {productComponent()}
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
CardForm.contextTypes = {
  router: React.PropTypes.object
}

export default CardForm;
