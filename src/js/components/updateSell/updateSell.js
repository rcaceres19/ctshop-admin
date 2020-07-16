import React, {Component} from 'react';
import Firebase from '../../../firebase';

class updateSell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pedidos: {
                pendientes: [],
                completados: []
            },
            pedidosArray: {},
            pedidosSeleccionados: {
                pendientes: true,
                completados: false
            }
        }

        this.handleOrganize = this.handleOrganize.bind(this);
        this.handleOrdersPendientes = this.handleOrdersPendientes.bind(this);
        this.handleOrdersCompletadas = this.handleOrdersCompletadas.bind(this);
        this.constructCards = this.constructCards.bind(this);
        this.handleInfo = this.handleInfo.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged((user) => {
            Firebase.database().ref('orders/' + user.uid).once('value', snapshot => {
                if(snapshot.exists()) {
                    this.setState({pedidosArray:snapshot.val()})
                    this.handleOrganize()
                }
            })
        })    

        
    }

    handleOrganize() {
        const { pedidosArray } = this.state
        let { pedidos } = this.state
        
        for(let i in pedidosArray) {
            if(pedidosArray.hasOwnProperty(i)) {
                if(pedidosArray[i].status == 'pendiente') {
                    pedidos.pendientes.push({[i]: pedidosArray[i]})
                }
                if(pedidosArray[i].status == 'completado') {
                    pedidos.completados.push({[i]: pedidosArray[i]})
                }
            }
        }


        this.setState({ pedidos })
    }   

    constructCards(i, items) {
        return (
            <div className="box">
                <div className="pedido-item">
                    <div className="level">
                        <div className="level-item has-text-centered">
                            <div className="order-id">
                                <p><b>Pedido ID: <label className="has-text-link">{[i]}</label></b></p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <p><b>Status: <label className="has-text-link">{items[i].status}</label></b></p>
                        </div>
                        <div className="level-item has-text-centered">
                            <div className="select">
                                <select name="change-state" onChange={(e) => this.handleUpdate(items[i], e)}>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="completado">Completado</option>
                                </select>
                            </div>
                        </div>
                    </div>                                            
                <hr/>
                    <div className="columns">
                        <div className="column">
                            <div className="column-header">
                                <p className="title is-5">Informacion del cliente</p>
                                <br/>
                            </div>
                            <div className="client-info">
                                <label for="clientName">Nombre del cliente</label>
                                <input name="clientName" className="input is-rounded" type="text" value={items[i].clientname} disabled />
                                <label for="phoneNumber">Numero de telefono</label>
                                <input name="phoneNumber" type="number" className="input is-rounded" value={items[i].phone} disabled />
                                <label for="email">Correo electronico</label>
                                <input name="email" type="text" className="input is-rounded" value={items[i].email} disabled />
                                <label for="dirEnvio">Direccion de envio</label>
                                <textarea name="dirEnvio" type="text" className="textarea" value={items[i].address} disabled />
                            </div>  
                        </div>
                        <div className="column">
                            <div className="column-header">
                                <p className="title is-5">Descripcion de productos</p>
                                <br/>
                            </div>
                        {
                            items[i].products.map(products => {
                                return(
                                    <div className="product-info">
                                        <label for="productName">Producto</label>
                                        <input name="productName" className="input is-rounded" type="text" value={products.product.name} disabled />
                                        <label for="productQty">Cantidad</label>
                                        <input name="productQty" className="input is-rounded" type="number" value={products.qty} disabled />
                                        <label for="productPrice">Precio</label>
                                        <input name="productPrice" className="input is-rounded" type="number" value={products.product.price} disabled />
                                        <label for="productPrice">Descuento</label>
                                        <input name="productPrice" className="input is-rounded" type="number" value={products.product.descuento.porcentaje} disabled />
                                        <hr/>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="column">
                            <div className="column-header">
                                <p className="title is-5">Total de orden</p>
                                <br/>
                            </div>
                            <label for="OrderCant">Cantidad de productos</label>
                            <input name="OrderCant" className="input is-rounded" type="text" value={items[i].totalItems} disabled />
                            <label for="orderShipping">Envio</label>
                            <input name="orderShipping" className="input is-rounded" type="text" value={items[i].shipping} disabled />        
                            <label for="orderTotal">Total del pedido</label>
                            <input name="orderTotal" className="input is-rounded" type="text" value={items[i].totalPrice} disabled />
                        </div>
                    </div>
                    <hr/>
                    <button className="button is-info" onClick={() => this.handleUpdate(items[i])}>Actualizar pedido</button>
                </div>
            </div>
        )
    }

    handleInfo(e) {
        let { name } = e.target
        let { pedidosSeleccionados } = this.state
        
        if(name === 'pendientes') {
            pedidosSeleccionados.pendientes = true
            pedidosSeleccionados.completados = false
        } else {
            pedidosSeleccionados.pendientes = false
            pedidosSeleccionados.completados = true
        }

        this.setState(pedidosSeleccionados);
    }

    handleOrdersPendientes() {
        let pendientes = []

        
            pendientes = this.state.pedidos.pendientes.map((items) => {
                for(let i in items) {
                    return(
                        this.constructCards(i, items)
                    )
                }  
            });

        return pendientes;
    }

    handleOrdersCompletadas() {
        let completados = []

        completados = this.state.pedidos.completados.map((items) => {
            for(let i in items) {
                return (
                    this.constructCards(i, items)
                )
            }
        });

        return completados
    }

    handleUpdate(item, e) {
        let { value } = e.target;
        let {pedidos} = this.state;

        let filtered = pedidos.pendientes.map(items => {
            for( let i in items ) {
                if(items[i].orderId == item.orderId) {
                    items[i].status = value;
                    pedidos.completados.push(items)
                } else {
                    return items
                }
            }
        }).filter(items => items !== undefined)

        pedidos.pendientes = filtered;

        this.setState({pedidos: pedidos})

        console.log(filtered)
    }

    render() {
        
        return(
            <div className="actualizar-pedido-vw container"> 
                <p className="products-title title is-1">Actualizar pedido</p>
                    <div className="columns">
                        <div className="column is-three-quarters">
                    {
                        this.state.pedidosSeleccionados.pendientes ? this.handleOrdersPendientes() : this.handleOrdersCompletadas()
                    }
                        </div>
                        <div className="column">
                            <div class="buttons has-addons is-centered">
                                <button class="button is-fullwidth" name="pendientes" onClick={this.handleInfo} >Pendientes</button>
                                <button class="button is-fullwidth" name="completados" onClick={this.handleInfo} >Completados</button>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default updateSell