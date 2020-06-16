import React, {Component} from 'react' 
import buy from '../../../assets/images/inicioIMG.jpeg'
import SimpleSlider from '../../helpers/carousel';
import '../../../css/components/home/home.scss'
import firebase from '../../../firebase';
import IMG1 from '../../../assets/images/inico-catrachosshop.png';
import IMG2 from '../../../assets/images/inicio-catrachosshop2.png';
import IMG3 from '../../../assets/images/inicio-catrachosshop3.png';
import IMG4 from '../../../assets/images/inicio-catrachosshop4.png';
import IMG5 from '../../../assets/images/inicio-catrachosshop5.jpeg';

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
        console.log(this.state.subscribed)
        return(
            <div className="container">
                <div className="colums is-centered">
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
                    <nav className="level" >
                        <div className="level-item">
                            <SimpleSlider images={images} />    
                        </div>
                    </nav>
                    <div className="box info-box" >
                        <div className="column">
                            <div className="columns">
                                <div className="column is-half has-text-centered">
                                <img src={IMG5}/>
                                </div>
                                <div className="column is-half has-text-centered "> 
                                    <section className="hero is-primary">
                                        <div className="hero-body">
                                            <div className="container">
                                            <h1 className="title">
                                                Catrachos Shop
                                            </h1>
                                            <h2 className="subtitle">
                                                Creciendo con la pequeña empresa
                                            </h2>
                                            <hr />
                                            <p>Es una plataforma de tiendas online para las MIPYMES (micro, pequeña y mediana empresa) donde nuestros afiliados podrán ofrecer sus productos o servicios a través de la red de la misma manera que comercializan en su tienda física.
                                            Esta herramienta brinda la posibilidad de expandir sus negocios, ampliar su mercado y de aprovechar las ventajas de un comercio virtual.
                                            Puedes crear tu tienda online, configurarla, describir los productos y añadir imágenes en cuestión de minutos. 
                                            Tus clientes pueden pagar con tarjeta de crédito/débito o PayPal. 
                                            Solo debes suscribirte y elegir uno de los diferentes planes para empezar a comercializar. 
                                            Vender en línea puede ser muy fácil. ¡Suscríbete! Y crea tu tienda online hoy mismo. Comienza a vender por Internet.</p>
                                            </div>
                                        </div>
                                    </section>
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