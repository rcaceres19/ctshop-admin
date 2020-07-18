import React, {Component} from 'react';
import SuscripcionImg from '../../../assets/images/subcription.png'

class Subscribe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            company: {}
        }
        this.renderButton = this.renderButton.bind(this);
    }

    componentDidMount() {
        this.renderButton();
    }

    renderButton() {
    
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe',
                
            },
            createSubscription: (data, actions) => {
                return actions.subscription.create({
                    'plan_id': 'P-6TS119066H727125LL3JRIWY',
                    "payee": {
                        "email": "sb-avjzv1549038@business.example.com"
                    },
                });
            },
            onApprove: (data, actions) =>{
                this.props.history.push({
                    pathname: '/confirmation',
                    state: {data, type: 'mensual', startDate: new Date()}
                })
            }
        }).render('#paypal-button-container-mensual');


        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe',
                
            },
            createSubscription: (data, actions) => {
                return actions.subscription.create({
                    'plan_id': 'P-6166259261310510YL3JR26I',
                    "payee": {
                        "email": "sb-avjzv1549038@business.example.com"
                    },  
                });
            },
            onApprove: (data, actions) => {
                this.props.history.push({
                    pathname: '/confirmation',
                    state: {data, type: 'anual', startDate: new Date()}
                })
            }
        }).render('#paypal-button-container-anual');


    }

    render() {
        return (
            <div>
                <div className="container" >
                    <div>
                        <h1 className="title">Suscribete</h1>
                        <hr />
                        <p className="has-text-centered">
                            Suscr&iacute;bite a Catrachos Shop, somos una empresa responsable que nos importa nuestros clientes<br/>
                            Los cuales los ayudamos a crecer, si tu creces nosotros crecemos.
                        </p>
                    </div>
                    <hr />
                    <div className="columns">
                        <div className="column">
                            <div className="columns">
                                <div className="column is-half has-text-centered">
                                    <div className="box item-suscripcion">
                                        <div className="suscription-name-image ">
                                            <nav className="level">
                                                <div className="level-item">
                                                    <figure className="image is-128x128 is-inline-block">
                                                        <img className="subscription-img " src={SuscripcionImg} />
                                                    </figure>
                                                </div>
                                            </nav>
                                            <h1 className="title">Suscripci&oacute;n Mensual</h1>
                                        </div>
                                        <hr />
                                        <div className="suscription-info">
                                            <h2 className="subtitle"><b>Ventajas</b></h2>
                                            <hr />
                                            <dl className="has-text-left is-relative">
                                                <li>
                                                Utiliza la herramienta sin necesidad de realizar una gran inversión.
                                                </li>
                                                <li>
                                                Acceso único: a publicar tus productos. 
                                                </li>
                                                <li>
                                                Exclusividad en el servicio, somos los únicos enfocados en las MIPYMES.
                                                </li>
                                                <li>
                                                El pago es recurrente, no necesita preocuparse por los pagos este es descontado de su tarjeta de crédito/débito.
                                                </li>
                                                <li>
                                                La plataforma web te ayudará a comercializar tus productos.
                                                </li>
                                            </dl>
                                            <hr/>
                                            <div className="pricing-container">
                                                <h2 className="subtitle"><b>Precio</b></h2>
                                                <hr/>
                                                <div className="price has-text-left">
                                                    <p className>$20</p>
                                                    <p className="has-text-danger"><b>Tipo de suscripci&oacute;n:</b> <label className="has-text-black">Mensual</label></p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="suscribe-container">
                                                <h2 className="subtitle"><b>Suscr&iacute;bete</b></h2>
                                                <hr />
                                                <div className="column is-two-thirds is-offset-2">
                                                    <div id="paypal-button-container-mensual" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-half has-text-centered">
                                <div className="box item-suscripcion">
                                        <div className="suscription-name-image ">
                                            <nav className="level">
                                                <div className="level-item">
                                                    <figure className="image is-128x128 is-inline-block">
                                                        <img className="subscription-img " src={SuscripcionImg} />
                                                    </figure>
                                                </div>
                                            </nav>
                                            <h1 className="title">Suscripcion Anual</h1>
                                        </div>
                                        <hr />
                                        <div className="suscription-info">
                                            <h2 className="subtitle"><b>Ventajas</b></h2>
                                            <hr />
                                            <dl className="has-text-justified">
                                                <li>
                                                Utiliza la herramienta sin necesidad de realizar una gran inversión. 
                                                </li>
                                                <li>
                                                Recibes un descuento al contratar la suscripción anual, solo pagarías $150.
                                                </li>
                                                <li>
                                                Acceso único: a publicar tus productos. 
                                                </li>
                                                <li>
                                                Exclusividad en el servicio, somos los únicos enfocados en las MIPYMES.
                                                </li>
                                                <li>
                                                El pago es recurrente, no necesita preocuparse por los pagos este es descontado de su tarjeta de crédito/débito.
                                                </li>
                                                <li>
                                                La plataforma web te ayudará a comercializar tus productos.
                                                </li>
                                            </dl>
                                            <hr/>
                                            <div className="pricing-container">
                                                <h2 className="subtitle"><b>Precio</b></h2>
                                                <hr/>
                                                <div className="price has-text-left">
                                                    <p className>L. 3721.00</p>
                                                    <p className="has-text-danger"><b>Tipo de suscripci&oacute;n:</b> <label className="has-text-black">Anual</label></p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="suscribe-container">
                                                <h2 className="subtitle"><b>Suscr&iacute;bete</b></h2>
                                                <hr />
                                                <div className="column is-two-thirds is-offset-2">
                                                    <div id="paypal-button-container-anual" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Subscribe;   