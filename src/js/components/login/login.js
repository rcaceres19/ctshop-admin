import React, {Component} from 'react';
import firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import Register from '../register/register';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import '../../../css/components/login/login.scss';

class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: "",
            password: "",
            users: []
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.passHandler = this.passHandler.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('users/').once('value', (snapshot) => {
            this.setState({ users: [...this.state.users, ...[snapshot.val()] ]})   
        })
    }

    emailHandler(e){
        const val = e.target.value;

        this.setState({ email: val });
    }

    passHandler(e){
        const val = e.target.value;

        this.setState({ password: val });
    }

    handleSubmit(){
        const {email, password, } = this.state;
        let {users} = this.state;   
        
        users.filter(item => {
            Object.values(item).map((items) => {
                if(items.email == email && items.type == "company") {
                    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
                        this.props.history.push('/');
                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    
                        console.log(errorCode, errorMessage);
                    })  
                }
            }) 
        })
    }

    render() {
        return(
            <div className="container ">
                <div className="columns is-centered ">    
                    <div  className="column is-half login-form">
                        <hr/>
                        <p className="subtitle is-6 has-text-centered">Ingresa tus credenciales</p>
                        <hr/>
                        <div className="box">
                            <p className="is-size-1  has-text-centered">
                                <i className="fa fa-user title"></i>
                            </p>
                            <p className="title is-3 has-text-centered">Inicia Sesion</p>
                            <div className="field">   
                                <label className="label">Email</label>
                                <div className="control has-icons-left">
                                    <input type="text" className="input" placeholder="Example@example.com" onChange={ this.emailHandler } />
                                    <span className="icon is-left">
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                </div>                       
                            </div>
                            <div className="field">   
                                <label className="label">Password</label>
                                <div className="control has-icons-left">
                                    <input type="password" className="input" placeholder="Password" onChange={ this.passHandler } />
                                    <span className="icon is-left">
                                        <i className="fa fa-lock "></i>
                                    </span>
                                </div>                        
                            </div>
                            
                            <div className="control has-text-centered">
                                <br />
                                <button className="button is-success signin-btn" onClick={this.handleSubmit} value="Submit">Iniciar Sesion</button>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        )
    }


}

export default Login;