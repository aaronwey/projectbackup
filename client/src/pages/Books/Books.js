import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";

class Books extends Component {
  state = {
    currency: [],
    title: "",
    author: "",
    synopsis: "",
    name: "",
    price: "",
    units: "",
    sell: "",
    destinations: []
  };
  componentDidMount() {
    this.loadCryptoDB();
  };


  loadCrypto = (name) => {
    
    API.getCrypto(name)
      .then((res) =>{
          let price = res.data[0].price_usd;
          const value = price * this.state.currency[0].units;
          return console.log(value);
        })
  };

  checkCrypto = (name) => {
    this.intervalId = setInterval(() => {
    API.getCrypto(name)
      .then((res) => {
        if (Number.parseInt(res.data[0].price_usd, 10) >= Number.parseInt(this.state.price, 10)){
            alert('sell');
          } 
        })
      .catch(err => console.log(err));
    }, 5000);
  };

  loadCryptoDB = () => {
    API.getCryptoDB()
      .then(res =>
        this.setState({ currency: res.data })
      )
      .then(console.log(this.state.currency))
      .catch(err => console.log(err));
  };

  // mapDB = () => {
  //   this.state.currency.map(coin =>
  //     ()
  // }

  deleteCrypto = id => {
    API.deleteCrypto(id)
      .then(res => this.loadCryptoDB())
      .catch(err => console.log(err));
  };
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.name && this.state.units) {
      API.saveCrypto({
        name: this.state.name,
        units: this.state.units
      })
        .then(console.log(this.state.name, this.state.units))
        .then(res => this.loadCryptoDB())
        .catch(err => console.log(err));
    }
  };

  display = () =>{
    API.display()
      .then((res) =>{

        for (let i = 0; i < res.data.length; i ++){
          if (parseInt(res.data[i].price) <= 100){
            this.state.destinations.push(res.data[i]);
          }
        }
        console.log(this.state.destinations);
      })
  };

  scrape = () => {
    API.scrapper()
      .then((res) =>{
        console.log(res);
    })
  };

  checkState = (event) =>{
    event.preventDefault();
    console.log(this.state);
  };



  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>what crypto?</h1>
            </Jumbotron>
              <button onClick={() => this.loadCrypto(this.state.name)}>
                work baby!
              </button>
               <button onClick={() => this.scrape()}>
               scrape! 
              </button>
               <button onClick={() => this.display()}>
               display! 
              </button>
              <button onClick={() => console.log(this.state.currency)}>
               currency
              </button>
            <form>
              <Input
                value={this.state.name}
                onChange={this.handleInputChange}
                name="name"
                placeholder="name (required)"
              />
              <Input
                value={this.state.units}
                onChange={this.handleInputChange}
                name="units"
                placeholder="units (required)"
              />
              <Input
                value={this.state.price}
                onChange={this.handleInputChange}
                name = "price"
                placeholder="price"
              />

              <FormBtn
                disabled={!(this.state.name && this.state.units)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
              <button onClick={this.checkState}>
                state!
              </button>
              <button onClick={() => this.checkCrypto(this.state.name)}>
                check it!
              </button>
              <button onClick={() => clearInterval(this.intervalId)}>
               stop! 
              </button>
              <button onClick={() => this.display()}>
               display! 
              </button>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>current currencies</h1>
            </Jumbotron>
            {this.state.currency.length ? (
              <List>
                {this.state.currency.map(coin => (
                  <ListItem key={coin._id}>
                    <Link to={"/crypto/" + coin._id}>
                      <strong>
                        {coin.name} : units {coin.units} : price {coin.units}
                      </strong>
                    </Link>
                    
                    <DeleteBtn onClick={() => this.loadCrypto(coin.name)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Books;