import React, {Component} from 'react' 
import buy from '../../../assets/images/inicioIMG.jpeg'
import SimpleSlider from '../../helpers/carousel';
import '../../../css/components/home/home.scss'
import firebase from '../../../firebase';
import IMG1 from '../../../assets/images/inico-catrachosshop.png';
import IMG2 from '../../../assets/images/inicio-catrachosshop2.png';
import IMG3 from '../../../assets/images/inicio-catrachosshop3.png';
import IMG4 from '../../../assets/images/inicio-catrachosshop4.png';
import IMG5 from '../../../assets/images/home-it-works.jpeg';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subscribed: false
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.database().ref('/companies/'+user.uid).once('value', snapshot => {
                    this.setState({subscribed: snapshot.val().subscribed.status})
                })
            } else {
              // No user is signed in.
            }
        });
    }
    
    render() {
        let images = [IMG1, IMG2, IMG3, IMG4 ];

        return(
            <div className="container">
                <div className="colums is-centered">
                <div className="welcome=msg">
                    <br />
                    <h1 className="title is-h2">Bienvenido a Catrachos Shop</h1>
                    <br/>
                </div>
                { 
                    this.state.subscribed ?
                    ""
                    :
                    <div className="box subscribe-message">
                        <div>
                            <h1 className="title is-h1">Suscribete</h1>
                            <hr />
                            <p>Suscribete a catrachos Shop para empezar a ganar dinero vendiendo tus productos,
                            vistos por miles de hondureños cada dia</p>
                        </div>
                    </div>
                }
                    <div className="box info-box" >
                        <nav className="level" >
                            <div className="level-item">
                                <SimpleSlider images={images} />    
                            </div>
                            
                        </nav>
                        <br/>
                        <hr/>
                        <div className="column">
                            <div className="columns">
                                <div className="column is-half has-text-left">
                                    <section className="hero">
                                        <div className="hero-body">
                                            <h1 className="title">
                                                ¿Como funciona catrachos shop en las empresas?
                                            </h1>
                                            <hr />
                                            <p className="has-text-left">Catrachos Shop es una plataforma de tiendas online que te permite crear tu propio comercio
                                            en línea a través de una suscripción mensual. Si necesitas una tienda online para tu micro,
                                            pequeña o mediana empresa esta es una excelente forma de crearla.
                                            Con una inversión mínima obtendrás todas las funcionalidades necesarias para abrir tu negocio al mundo de Internet.
                                            Esta herramienta te brinda la posibilidad de expandir tu mercado para adquirir nuevos clientes
                                            y de generarte mayor competitividad. </p>

                                            <hr/>
                                            <p>Estos son algunos datos que debes conocer sobre como funciona Catrachos Shop:</p>
                                            <ol>
                                                <li><i className="fa fa-check" aria-hidden="true"></i>Regístrate</li>
                                                <li><i className="fa fa-check" aria-hidden="true"></i>Realiza la suscripción</li>
                                                <li><i className="fa fa-check" aria-hidden="true"></i>Al efectuar la verificación de tus datos se habilitará tu usuario</li>
                                                <li><i className="fa fa-check" aria-hidden="true"></i>Configura tu tienda online, describe tus productos y agregar imágenes en cuestión de minutos. </li>
                                                <li><i className="fa fa-check" aria-hidden="true"></i>Tus clientes tendrán a la disposición el catálogo de tus productos. Además, 
                                                que ellos podrán realizar el pago con tarjeta de crédito/débito o PayPal de forma segura.</li>
                                            </ol>
                                            <hr/>
                                            <p><b>¡Expande tu negocio y adquieres nuevos clientes!</b></p>
                                        </div>
                                    </section>
                                </div>
                                <div className="column is-half has-text-centered ">
                                    <img src={IMG5}/>   
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;