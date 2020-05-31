import React, {Component} from 'react';
import firebase from '../../../firebase'
import Check from '../../../assets/images/checkOrder.png';

class Confirmation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmationData: this.props.location.state.data,   
            startDate: this.props.location.state.startDate,
            type: this.props.location.state.type,
            companie: {}
        }
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref('/companies/'+user.uid).once('value', snapshot => {
                    if(snapshot.exists) {
                        this.setState({ companie:snapshot.val() });
                    }
                })
            } else {
                console.log('no existe')
            }
        });

    }

    handleUpdate() {
        let { companie, type, startDate } = this.state

        companie.subscribed = {
            status: true,
            type: type,
            startDate: startDate.toLocaleDateString("en-US")
        }        
        console.log(companie)

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref('/companies/'+user.uid).update({ subscribed: companie.subscribed }).then(() => {
                    console.log('Felicidades te has suscrito');
                }).catch ((error) => {
                    console.log(error)
                })
            } else {
                console.log('no existe')
            }
        });
    }

    render() {
        const {confirmationData, type} = this.state
        {this.handleUpdate()}
        return(
            <div className="content">
                <section class="hero is-success has-text-centered">
                    <div class="hero-body">
                        <div class="container">
                        <h1 class="title">
                            Felicidades por tu suscripcion
                        </h1>
                        <h2 class="subtitle">
                            Te has suscrito al plan {type}
                        </h2>
                        </div>
                    </div>
                </section>
                <div className="columns is-centered">
                    <div className="column is-four-fifths">
                        <div className="box">
                            <nav className="level">
                                <div className="level-item">
                                    <figure className="image is-128x128 is-inline-block">
                                        <img src={Check} />
                                    </figure>
                                </div>
                            </nav>
                            <section className="info-suscriptor">
                                <h1 className="title has-text-centered">¡Felicidades! te has suscrito</h1>
                                <h2 className="subtitle has-text-centered">Tu numero de orden es: <label className="has-text-primary">{confirmationData.subscriptionID}</label></h2>
                            </section>
                            <section>
                                <div className="columns is-centered">
                                    <div className="column is-three-fifths">
                                        <a href="/addProduct">
                                            <button className="button is-success is-fullwidth is-4-quarters">Agrega tu primer producto</button>
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Confirmation;