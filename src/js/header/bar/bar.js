import React, { Component } from 'react';
import firebase from '../../../firebase';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { browserHistory } from 'react-router'
//rutas
import Home from '../../components/home/home';
import Login from '../../components/login/login';
import Register from '../../components/register/register';
import Logout from '../../components/logout/logout';
import Subscribe from '../../components/subscribe/subscribe';
import addProduct from '../../components/addProduct/addProduct';
import Confirmation from '../../components/confirmation/confirmation';
import Venta from '../../components/venta/venta'
import updateSell from '../../components/updateSell/updateSell';
//proteccion de rutas
import ProtectedRoutes from '../../helpers/protectedRoutes';

//MISC
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
            <div className="header">
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
                                        <Link className="navbar-item" to="/">Inicio</Link>
                                        {!this.state.subscribed.status && <Link className="navbar-item" to="/subscribe">Subscribete</Link>}                                            
                                        {this.state.subscribed.status && <Link className="navbar-item" to="/products">Productos</Link>}
                                        {this.state.subscribed.status && <Link className="navbar-item" to="/addProduct">Agregar Productos</Link>}    
                                        {this.state.subscribed.status && <Link className="navbar-item" to="/ventaManual">Venta manual</Link>}    
                                        <a className="navbar-item" href="https://catrachosshop.com/">Empieza a comprar</a>
                                    </div>
                                    <div className="navbar-end">
                                        <div className="navbar-item has-dropdown is-hoverable navbar-item">
                                            <a className="navbar-link">
                                                <i className="fa fa-user-circle-o" aria-hidden="true" />
                                                Cuenta
                                            </a>

                                            <div className="navbar-dropdown">
                                                {/* <Link className="navbar-item" to="/reporte">
                                                    Reporte de ventas
                                                </Link> */}
                                                <Link className="navbar-item" to="/pedidos">
                                                    Actualizar pedido
                                                </Link>
                                                {/* <Link className="navbar-item" to="/account">
                                                    Mis datos
                                                </Link> */}
                                            </div>
                                        </div>
                                    </div>                                   
                                    <Logout />
                                </div>
                            :
                                <div id="navbarBasicExample" className={`navbar-menu ${isVisible ? "is-active" : "hidden"}`}>
                                    <div className="navbar-start">
                                        <a className="navbar-item" href="https://catrachosshop.com/">Empieza a comprar</a>
                                    </div>
                                    <div className="navbar-end">
                                        <Link className="navbar-item" to="/login">
                                            <i className="fa fa-sign-in "></i>
                                            <p>Iniciar Sesion</p>
                                        </Link>
                                        <Link className="navbar-item" to="/register">
                                            <i className="fa fa-wpforms "></i>  
                                            <p>Registrate</p>
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
                        <Route authenticated={this.props.authenticated} path="/ventaManual" component={Venta} />
                        <Route authenticated={this.props.authenticated} path="/pedidos" component={updateSell} />
                        <Route path="/register" component={Register} />
                        <ProtectedRoutes component={Confirmation} path="/confirmation" authenticated={this.props.authenticated} />  
                        <ProtectedRoutes component={addProduct} path="/addProduct" authenticated={this.props.authenticated} />
                        <ProtectedRoutes component={Products} path="/products" authenticated={this.props.authenticated} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Bar;