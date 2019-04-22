import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import NavBar from './navbar';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { TabMenu } from 'primereact/tabmenu';
import { Rating } from 'primereact/rating';
import axios from 'axios';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import BottomNavBar from './BottomNavbar'

var initialState = {
    components: {
        overview: true,
        menu: false,
        reviews: false,
    }
}

function changeState(state = initialState, action) {
    switch (action.type) {
        case 'Overview':
            var stateCopy = Object.assign({}, state);
            stateCopy.components.overview = true;
            stateCopy.components.menu = false;
            stateCopy.components.reviews = false;
            return stateCopy;
        case 'Menu':
            var stateCopy = Object.assign({}, state);
            stateCopy.components.overview = false;
            stateCopy.components.menu = true;
            stateCopy.components.reviews = false;
            return stateCopy;
        case 'Reviews':
            var stateCopy = Object.assign({}, state);
            stateCopy.components.overview = false;
            stateCopy.components.menu = false;
            stateCopy.components.reviews = true;
            return stateCopy;
        default:
            return state
    }
}

var store = createStore(changeState);

class TabMenuDemo extends Component {
    constructor() {
        super();
        this.state = {
            items: [
                {
                    label: 'Overview',
                    icon: 'pi pi-fw pi-home',
                    command: () => {
                        var action = {
                            type: 'Overview'
                        }
                        store.dispatch(action)
                    }
                },
                {
                    label: 'Menu',
                    icon: 'pi pi-fw pi-file',
                    command: () => {
                        var action = {
                            type: 'Menu'
                        }
                        store.dispatch(action)
                    }
                },
                {
                    label: 'Reviews',
                    icon: 'pi pi-fw pi-comments',
                    command: () => {
                        var action = {
                            type: 'Reviews'
                        }
                        store.dispatch(action)
                    }
                }
            ]
        };
    }
    componentDidMount() {

    }

    render() {
        return (
            <TabMenu model={this.state.items} />
        );
    }
}

class Overview extends React.Component {
    constructor(props) {
        super(props);
        console.log("overvie props   ", this.props)
    }
    render() {
        return (
            <React.Fragment>
                <div className="card"  style={{ marginTop:40, marginBottom:40 }}>
                    <div className="card-body" style={{ textAlign: "center" }}>
                        <h3 className="card-title">{this.props.overview}</h3>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: {},
            price: {},
            btnDelete: {},
            buttonActive: false,
            totalQuantity: 0,
            buttonDelete: false
        }
        this.props.menu.map(item => {
            this.state.cart[item.dishName] = 0
            this.state.price[item.dishName] = 0
        })

    }
    render() {
        console.log("12121", this.state.cart)
        console.log(this.state.price)
        console.log("8r8hjkfgeafyggaf", this.state.btnDelete)
        return (
            <div className="card" style={{ marginTop: 40, marginBottom:40 }}>
                <h3 className="card-header" style={{ textAlign: "center" }} >Menu</h3>
                <div className="card-body" style={{ textAlign: "center" }}>
                    {
                        (this.props.menu.length > 0) ?
                            <div>
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th>Dish Name</th>
                                            <th>Price</th>
                                            <th>Availability</th>
                                            <th>Order</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.menu.map(item => {
                                            var t = item.dishName
                                            return (
                                                <tr key={item.dishName} style={{ paddingTop: 60 }}>
                                                    <td className="text align-middle">{item.dishName}</td>
                                                    <td className="text align-middle">{item.price}</td>
                                                    <td className="text align-middle">{(item.available) ? <span>Yes</span> : <span>No</span>}</td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-success" name={item.dishName} value={item.price} onClick={(event) => {
                                                                let temp = this.state.cart
                                                                let price = this.state.price
                                                                let btn = this.state.btnDelete
                                                                btn[event.target.name] = true
                                                                console.log(btn)
                                                                temp[event.target.name] += 1
                                                                price[event.target.name] = temp[event.target.name] * event.target.value
                                                                let pp = price[event.target.name]
                                                                this.setState({ cart: temp, price: price, buttonActive: true, totalQuantity: this.state.totalQuantity + 1, btnDelete: btn })
                                                            }} > + </button>
                                                            <button className="btn btn-light" style={{ width: 35 }} id={item.dishName}>
                                                                <span className="text text-dark">{this.state.cart[t]}
                                                                </span>
                                                            </button>
                                                            <button className="btn btn-danger" name={item.dishName} value={item.price} disabled={!this.state.btnDelete[item.dishName]} onClick={(event) => {
                                                                let temp = this.state.cart
                                                                let price = this.state.price
                                                                let btn = this.state.btnDelete
                                                                if (temp[event.target.name] > 1) {
                                                                    temp[event.target.name] -= 1
                                                                    price[event.target.name] = temp[event.target.name] * event.target.value
                                                                    this.setState({ cart: temp, price: price, totalQuantity: this.state.totalQuantity - 1 })
                                                                }
                                                                else if (temp[event.target.name] === 1) {
                                                                    btn[event.target.name] = false
                                                                    temp[event.target.name] = 0
                                                                    price[event.target.name] = temp[event.target.name] * event.target.value
                                                                    this.setState({ cart: temp, price: price, totalQuantity: this.state.totalQuantity - 1, btnDelete: btn })
                                                                }
                                                                console.log("this state cartetr", this.state.totalQuantity)
                                                                if (this.state.totalQuantity === 1) {
                                                                    this.setState({ buttonActive: false })
                                                                }
                                                            }} > - </button>
                                                        </div></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <br />
                                <button className="btn btn-primary" disabled={!this.state.buttonActive} onClick={this.placeOrder}>Order</button>
                            </div>
                            : null
                    }
                </div>
            </div>
        )
    }
}
class Reviews extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                {(this.props.reviews) ?
                    this.props.reviews.map(review => {
                        console.log(review)
                        return (
                            <div className="container">
                                <div className="row" style={{ marginTop:40, marginBottom:40 }}>
                                    <div className="col-sm-1"></div>
                                    <div className="col-sm-10">
                                        <div className="card">
                                            <div className="card-body">
                                                <blockquote class="blockquote">
                                                    <p>
                                                        {review.review}
                                                    </p>
                                                    <footer class="blockquote-footer text-right" key={review._id}>
                                                        {review.reviewBy}
                                                    </footer>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </div>
                        )
                    })
                    : null}
            </div>
        )
    }
}


class Restaurant extends React.Component {

    constructor() {
        super();
        this.state = {
            val1: null,
            restaurantData: [],
            loading: true
        };
    }
    componentWillUnmount(){
        this.state.overview = true
        this.state.menu = false
        this.state.review = false
        console.log("unununununununununmount", this.state)
    }
    componentDidMount() {
        if (Number(this.props.customerId)) {
            this.setState({
                restaurantData: [],
                localLoggedIn: true,
            })
        }
        console.log("mount", this.props.overview)
        axios.get('http://localhost:1050/getRestaurantDetails/' + this.props.restaurantName).then(res => {
            console.log(res.data.message[0])
            this.setState({ restaurantData: res.data.message[0], errorMessage: "", loading: false })
        }).catch(error => {
            if (error.res) {
                this.setState({ errorMessage: error.res.data.message, loading: false })
            }
            else {
                this.setState({ errorMessage: "Server Error", loading: false })
            }
        })

    }

    render() {
        return (
            <React.Fragment>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <br />
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-7">
                            <div className="card">
                                <img className="card-img-top" src={require("../assets/default-res-back.jpg")} height="300" alt="Card imag cap" />
                                <div className="card-body">
                                    <h3 className="card-title" style={{ display: 'inline' }}>{this.props.restaurantName}</h3>
                                    <span style={{ display: 'inline' }}><Rating value={this.state.val1} cancel={false} onChange={(e) => this.setState({ val1: e.value })} /></span>
                                    <p className="card-text">
                                        {(this.state.loading) ?
                                            <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="6" fill="#EEEEEE" animationDuration=".5s" />
                                            : null}
                                        <span>{this.state.restaurantData.location} </span>
                                        <span></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Nearby restaurants</h5>
                                </div>
                                <img className="card-img-top" src={require("../assets/portal-image.png")} height="300" alt="Card imag cap" />

                            </div>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <br />
                    {(this.state.loading) ?
                        <div className="container-fluid">
                            <div className="text text-center">
                                <ProgressSpinner style={{ width: '50px', height: '50px', align: "center" }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />

                            </div>
                        </div>

                        :

                        <div className="row" style={{minHeight:400, marginBottom: 50}}>
                            <div className="col-md-7 offset-md-1" >
                                <TabMenuDemo />
                                {(this.props.overview) ? <Overview overview={this.state.restaurantData.overview} /> : null}
                                {(this.props.menuTab) ? <Menu menu={this.state.restaurantData.menu} /> : null}
                                {(this.props.reviews) ? <Reviews reviews={this.state.restaurantData.reviews} /> : null}
                            </div>
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

class RestaurantHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customerId: this.props.match.params.customerId,
            name: this.props.match.params.name,
            location: this.props.match.params.location,
            restaurantName: this.props.match.params.restaurantName
        }
    }
    componentDidMount = () => {
        if (Number(this.state.customerId)) {
            this.setState({
                localLoggedIn: true
            })
        }

        console.log("sssssssssssssssssssssssssssssss", store)
    }
    render() {
        return (
            <Provider store={store}>
                <NavBar customerId={this.state.customerId} name={this.state.name} home={false} location={this.state.location} restaurantName={this.state.restaurantName} />
                <Restaurant customerId={this.state.customerId} name={this.state.name} home={false} location={this.state.location} restaurantName={this.state.restaurantName} />
                <BottomNavBar customerId={this.state.customerId} name={this.state.name} />
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    console.log("statsststststsststs",state)

    return {
        overview: state.components.overview,
        menuTab: state.components.menu,
        reviews: state.components.reviews,
    }
}
Restaurant = connect(mapStateToProps)(Restaurant);
export default RestaurantHome;
