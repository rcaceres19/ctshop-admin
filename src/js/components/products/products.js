import React, {Component} from 'react';
import firebase from '../../../firebase';
import ProductHolder from '../productHolder/productHolder'
import '../../../css/components/productHolder/productHolder.scss';



class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
        }

        this.buildProducts = this.buildProducts.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    
    componentDidMount() {
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref('products/' + userId).once('value', (snapshot) => {
            if(snapshot.exists()) {
                this.setState({ products: snapshot.val() })
            }
        })
    }

    

    handleDelete(e) {
        const userId = firebase.auth().currentUser.uid;
        let {products} = this.state;
        let product = e;
        let filterProducts = {};

        for(let i in products) {
            if(products.hasOwnProperty(i)) {
                if(products[i].id == product.id) {
                    
                    firebase.database().ref(`/products/${userId}/${i}`).remove().then(() => {
                        console.log('Producto Removido')
                    })
                } else {
                    filterProducts[i] = (products[i])
                }
            }
        }

        this.setState({products: filterProducts})

    }

    handleEdit(e) {
        this.props.history.push({
            pathname: '/addProduct',
            state: {editProduct: e}
        })
    }

    buildProducts() {
        const {products} = this.state;
            let dataArray = Object.values(this.state.products).map((item, index) => {
                return (
                    <div className="item-holder">
                        <div className="item">
                            <div className="item-pic">
                                <img src={item.images} />
                            </div>
                            <div className="item-info holder">
                                <div className="item-basic-info">
                                    <p><b>Nombre de Producto:</b> {item.name}</p>
                                    <p><b>Precio: </b>L{item.price} </p>
                                    <p><b>Descripci&oacute;n: </b>{item.desc}</p>
                                    {/* <p><b>Cantidad disponible: </b>{item.stock}</p> */}
                                    <p><b>Descuento: </b>{item.descuento.porcentaje}</p>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button className="item-button button is-info" onClick={() => this.handleEdit(item)}>
                                    <span className="icon is-small">
                                        <i className="fa fa-edit" />
                                    </span>
                                </button>
                                <button className="item-button button is-danger" onClick={() => this.handleDelete(item)}>
                                    <span className="icon is-small">
                                        <i className="fa fa-trash" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })
            return dataArray 

    }

    render() {
        
        return(
            <div className="container">
                <p className="products-title title is-1">Productos</p>
                {!this.state.products == {} && <h1>Te invitamos a agregar nuevos productos</h1>} 
                    
                {
                   this.buildProducts()
                }
            </div>
        )
    }
}

export default Products;
