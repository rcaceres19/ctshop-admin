import React, {Component} from 'react';
import Firebase from '../../../firebase';
import moment from 'moment';

class Venta extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fechaVenta: + new Date(),
            products: [],
            selectedProduct: {
                product: [],
                qty: 0
            },
            cliente: {
                nombre: 'Cliente Tienda',
                email: '------',
                telefono: '00000000',
                direccion: '-------',
            }
        }

        this.generarVenta = this.generarVenta.bind(this);
        this.guardarVenta = this.guardarVenta.bind(this);
    }

    async componentDidMount() {
        const userId = Firebase.auth().currentUser.uid;
        
        Firebase.database().ref(`/products/${userId}`).once('value', snapshot => {
            if(snapshot.exists()) {
                this.setState({products:snapshot.val()})
            }
        })
    }

    guardarVenta(e) {
        let {selectedProduct} = this.state;

        if(e.target) {
            selectedProduct.qty = parseInt(e.target.value)
        } else {
            selectedProduct.product = e
        }

        this.setState({selectedProduct});
    }

    generarVenta(e) {
        const userId = Firebase.auth().currentUser.uid;
        let { selectedProduct, products, cliente, fechaVenta } = this.state
        moment(fechaVenta).format('L')

        let productFilter = Object.values(products).map((item, index) => {
            if(item.id == selectedProduct.product.id) {
                return item
            } 
        }).filter(item => item !== undefined)

        productFilter.map(item => {
            item.stock = item.stock - selectedProduct.qty
        })

        for(let i in products) {
            if(products.hasOwnProperty(i)) {
                if(products[i].id == selectedProduct.product.id) {
                    let compiler = {
                        selectedProduct: selectedProduct,
                        client: cliente,
                        fecha: fechaVenta,
                        total: products[i].price * selectedProduct.qty
                    }
                    console.log({[i]: products[i]})
                    Firebase.database().ref(`/ventas/${userId}/cliente-tienda/${i}`).push(
                        compiler
                    )
                    Firebase.database().ref(`/products/${userId}/${i}`).update({stock: products[i].stock}).then(() => {
                        console.log('Producto Actualizado')
                    })
                } 
            }
        }
    }

    render() {
        const{ products } = this.state
        return (
            <div className="venta-vw container">
                <p className="products-title title is-1">Venta de Productos en Tienda en Físico</p>
                <div className="box">
                    <div className="columns">
                        <div className="column">
                            <div class="field">
                                <label class="label">Producto Vendido</label>
                                <div class="control">
                                    <div class="select">
                                        <select>
                                            <option hidden={true} >Selecciona un Producto</option>
                                            {
                                                Object.values(products).map(item => {
                                                    return(
                                                        <option name="productItem" onClick={() => this.guardarVenta(item)} value={item}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div class="field">
                                <label class="label">Cantidad Vendida</label>
                                <div class="control">
                                    <input class="input" type="number" placeholder="Cantidad vendida" onChange = {this.guardarVenta} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="button is-success" onClick={this.generarVenta}>Generar Venta</button>
            </div>
        )
    }
}

export default Venta;