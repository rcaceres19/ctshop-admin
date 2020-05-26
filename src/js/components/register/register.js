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
                password: "",
                faddress: "",
                saddress: "",
                tel: "",
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
        const storageRef = firebase.storage().ref();
        const url = `images/companies/${file.name}`;
        const uploadTask = storageRef.child(url);
        
        uploadTask.put(file)
        storageRef.child(url).getDownloadURL().then((url) => {
            let {images} = this.state;
            
            images = url;

            this.setState({images})
            console.log(images)
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
            this.props.history.push('/home');
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
        const {company, rtn, email, faddress, saddress, tel, type, images} = this.state
        
        firebase.database().ref('companies/' + users).set({
            company: company,
            rtn: rtn,
            email: email,
            faddress: faddress,
            saddress: saddress,
            tel: tel,
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
                <article className="panel is-primary">
                    <p className="panel-heading">
                        Suscribete como vendedor en City Queen Shop
                    </p>
                    <div className="content">
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
                            <label className="label">RTN<small>*</small></label>
                            <div className="control has-icons-left">
                                <input type="text" name="rtn" className="input" onChange={this.handleChange} required />
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
                            <label className="label">Password<small>*</small></label>
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
                                <input type="text" name="tel" className="input" onChange={this.handleChange} required />
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
                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <div className="file is-primary">
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
                        <button className="button is-primary" onClick={this.handleSubmit} value="Submit">Submit</button>
                    </div>
                </article>
            </div>
        )
    }
}

export default withRouter(Subscribe);