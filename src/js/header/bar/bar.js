import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from '../../components/login/login';
import Register from '../../components/register/register';
import Logout from '../../components/logout/logout';
import addProduct from '../../components/addProduct/addProduct'
import ProtectedRoutes from '../../helpers/protectedRoutes';
import '../../../css/components/bar/bar.scss'
import logo from '../../../assets/images/logo.png';
import Products from '../../components/products/products';

class Bar extends Component{
    constructor(props){
        super(props);
        this.state = {
            isVisible: false
        }
        this.toogleMenu = this.toogleMenu.bind(this)
    }

    toogleMenu() {
        this.setState(prevState => ({ isVisible: !prevState.isVisible }));
    }


    render() {
        const {isVisible} = this.state;
        console.log(isVisible)
        return(
            <div>
                <Router>                
                    <nav className="navbar" role="navigation" aria-label="main navigation">
                    
                    <div className="navbar-brand">
                        <a className="navbar-item" href="/home">
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
                                        <Link className="navbar-item" to="/products">Products</Link>
                                        <Link className="navbar-item" to="/addProduct">Add Product</Link>
                                    </div>
                                    <div className="navbar-end">                                       
                                        <Logout />
                                    </div>
                                </div>
                            :
                                <div id="navbarBasicExample" className={`navbar-menu ${isVisible ? "is-active" : "hidden"}`}>
                                    <div className="navbar-end">
                                        <Link className="navbar-item is-primary" to="/login">
                                            <button className="button is-primary log-button">Login</button>
                                        </Link>
                                        <Link className="navbar-item" to="/register">
                                            <button className="button is-primary log-button">Register</button>
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>    
                    </nav>

                    <Switch>
                        <Route authenticated={this.props.authenticated} path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <ProtectedRoutes component={addProduct} path="/addProduct" authenticated={this.props.authenticated} />
                        <ProtectedRoutes component={Products} path="/products" authenticated={this.props.authenticated} />
                        {/* <ProtectedRoutes component={Companies} path="/companies" authenticated={this.props.authenticated} />
                        <ProtectedRoutes component={Products} path="/companies" authenticated={this.props.authenticated} /> */}
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Bar;