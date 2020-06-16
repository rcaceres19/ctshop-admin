import React, { Component } from 'react';
import firebase from '../../../firebase';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { browserHistory } from 'react-router'
import Home from '../../components/home/home';
import Login from '../../components/login/login';
import Register from '../../components/register/register';
import Logout from '../../components/logout/logout';
import Subscribe from '../../components/subscribe/subscribe';
import addProduct from '../../components/addProduct/addProduct';
import Confirmation from '../../components/confirmation/confirmation';
import ProtectedRoutes from '../../helpers/protectedRoutes';
import '../../../css/components/bar/bar.scss';
import logo from '../../../assets/images/logo.png';
import Products from '../../components/products/products';

class Bar extends Component{
    constructor(props){
        super(props);
        this.state = {
            isVisible: false,
            subscribed: false
        }
        this.toogleMenu = this.toogleMenu.bind(this);
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.database().ref('/companies/'+user.uid).once('value', snapshot => {
                    this.setState({subscribed: snapshot.val().subscribed})
                })
            } else {
              // No user is signed in.
            }
        });
    }

    toogleMenu() {
        this.setState(prevState => ({ isVisible: !prevState.isVisible }));
    }

    render() {
        const {isVisible, subscribed} = this.state;
        return(
            <div>
                <Router history={browserHistory} >                
                    <nav className="navbar" role="navigation" aria-label="main navigation">
                    
                    <div className="navbar-brand">
                        <a className="navbar-item" href="/">
                            <img src={logo} className="logo-png" />
                        </a>

                        <a role="button" onClick={this.toogleMenu} className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                        <div className="container">                       
                            { this.props.authenticated ?                    
                                <div id="navbarBasicExample" className={`navbar-menu ${isVisible ? "is-active" : "hidden"}`}>
                                    <div className="navbar-start">
                                        <Link className="navbar-item is-inline-block" to="/">Inicio</Link>
                                        {
                                            this.state.subscribed.status == false ? 
                                            <Link className="navbar-item is-inline-block" to="/subscribe">Subscribete</Link>
                                            :
                                            <div>
                                                <Link className="navbar-item is-inline-block" to="/products">Productos</Link>
                                                <Link className="navbar-item is-inline-block" to="/addProduct">Agregar Productos</Link>
                                            </div>
                                        }
                                    </div>
                                    <div className="navbar-end">                                       
                                        <Logout />
                                    </div>
                                </div>
                            :
                                <div id="navbarBasicExample" className={`navbar-menu ${isVisible ? "is-active" : "hidden"}`}>
                                    <div className="navbar-end">
                                        <Link className="navbar-item" to="/login">
                                            <i className="fa fa-sign-in has-text-white"></i>
                                            <p className="has-text-white">Iniciar Sesion</p>
                                        </Link>
                                        <Link className="navbar-item" to="/register">
                                            <i className="fa fa-wpforms has-text-white"></i>  
                                            <p className="has-text-white">Registrate</p>
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>    
                    </nav>

                    <Switch>
                        <Route exact path="/" subscribed={subscribed} component={Home}></Route>
                        <Route authenticated={this.props.authenticated} path="/login" component={Login} />    
                        <Route authenticated={this.props.authenticated} path="/subscribe" component={Subscribe} />
                        <ProtectedRoutes component={Confirmation} path="/confirmation" authenticated={this.props.authenticated} />
                        <Route path="/register" component={Register} />
                        <ProtectedRoutes component={addProduct} path="/addProduct" authenticated={this.props.authenticated} />
                        <ProtectedRoutes component={Products} path="/products" authenticated={this.props.authenticated} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Bar;