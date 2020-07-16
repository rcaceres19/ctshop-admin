import React, {Component} from 'react';
import firebase from '../../../firebase';
import { withRouter } from 'react-router-dom';
import "../../../css/components/subscribe/subscribe.scss";
import Swal from 'sweetalert2';

class Subscribe extends Component {    
    constructor(props) {
        super(props);


        console.log(props);
        this.state = {
                company: "",
                rtn: "",
                email: "",
                representante: "",
                password: "",
                faddress: "",
                saddress: "",
                tel: "",
                description: "",
                subscribed: {
                    status: false,
                    type: '',
                },
                type: 'company',
                images: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }


    handleChange(e) {
        let val = e.target.value
        
        this.setState({
            ...this.state,
            [e.target.name] : val 
        })
    }

    uploadImage(e) {
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref(`images/companies/${file.name}`);
        storageRef.put(file).then((snapshot) => {
            let {images} = this.state;

            storageRef.getDownloadURL().then((result) => {
                images = result;
                
                this.setState({ images:images })  
            })
        })
    }
    
    handleSubmit() {
        
        const { email, password } = this.state

        firebase.auth().createUserWithEmailAndPassword(email, password).then((users) => {
            
            Swal.fire({
                icon: 'success',
                title: 'Felicidades',
                text: 'Hemos creado tu cuenta, seras redirigido a la pagina principal',
                confirmButtonText: '<a class="fa fa-thumbs-up"></a> Genial!',
            })
            this.addToDatabase()
            this.props.history.push('/');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if( errorCode == "auth/email-already-in-use") {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario en uso',
                    text: 'Lamentablemente el email ya ha sido usado',
                    confirmButtonText: '<a class="fa fa-thumbs-up"></a> Genial!',
                }) 
            }
            console.log(error)
        }) 
        
    }


    addToDatabase() {
        const users = firebase.auth().currentUser.uid;
        const {company, rtn, email, faddress, saddress, tel, type, images, subscribed, description, representante} = this.state
        
        firebase.database().ref('companies/' + users).set({
            company: company,
            rtn: rtn,
            email: email,
            representante: representante,
            faddress: faddress,
            saddress: saddress,
            tel: tel,
            subscribed: subscribed,
            description: description,
            images: images
        });

        firebase.database().ref('users/' + users).set({
            email: email,
            type: type
        })
    }


    render() {
        return(
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half ">
                    <hr/>
                        <p className="subtitle is-6 has-text-centered">Ingresa la informacion de tu empresa</p>
                    <hr/>
                        <div className="box">
                            <p className="is-size-1  has-text-centered">
                                <i className="fa fa-wpforms"></i>
                            </p>
                            <p className="title is-3 has-text-centered">Reg&iacute;strate</p>
                            <div className="field">
                                <label className="label">Empresa<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="text" name="company" className="input" onChange={this.handleChange} required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Representante legal<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="text" name="representante" className="input" onChange={this.handleChange} required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">RTN<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="text" maxLength="14" name="rtn" className="input" onChange={this.handleChange} required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-id-card "></i>
                                    </span>
                                </div>
                                
                            </div>
                            <div className="field">
                                <label className="label">Email<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="text" name="email" className="input" onChange={this.handleChange}  required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Contraseña<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="password" name="password" className="input" onChange={this.handleChange} required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-key"></i>
                                    </span>
                                    <small>NOTA*: Ingrese al menos 6 caracteres</small>
                                </div>
                            </div>
                        
                        
                            <div className="field">
                                <label className="label">Telefono<small>*</small></label>
                                <div className="control has-icons-left">
                                    <input type="text" maxLength="8" name="tel"
                                    pattern="/^-?\d+\.?\d*$/" 
                                    onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                                    className="input" onChange={this.handleChange} required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-phone "></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Direccion #1</label>
                                <div className="control has-icons-left">
                                    <input type="text" name="faddress" className="input" onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-home "></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Direccion #2</label>
                                <div className="control has-icons-left">
                                    <input type="text" name="saddress" className="input" onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-home "></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label className="label">Descripcion de la empresa*</label>
                                <div class="control has-icons-lef">
                                    <textarea class="textarea is-primary" name="description" onChange={this.handleChange} placeholder="Primary textarea"></textarea>
                                </div>
                            </div>
                            <div className="level">
                                <div className="level-item">
                                    <div className="field">
                                        <div className="file is-success">
                                            <label className="file-label">
                                            <input className="file-input" name="imagenes" type="file" onChange={this.uploadImage} required />
                                                <span className="file-cta">
                                                    <span className="file-icon">
                                                    <i className="fa fa-upload"></i>
                                                    </span>
                                                    <span className="file-label">
                                                        Elija archivos *
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="button is-success is-fullwidth" onClick={this.handleSubmit} value="Submit">Submit</button> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Subscribe);