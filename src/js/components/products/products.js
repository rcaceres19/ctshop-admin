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
    }
    
    componentDidMount() {
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref('products/' + userId).once('value', (snapshot) => {
            if(snapshot.exists()) {
                this.setState({ products: snapshot.val() })
            }
        })
    }

    buildProducts() {
        const {products} = this.state;
            let dataArray = Object.values(products).map((item, index) => {
                return (
                    <div className="item-holder">
                        <div className="item">
                            <div className="item-pic">
                                <img src={item.images} />
                            </div>
                            <div className="item-info holder">
                                <div className="item-basic-info">
                                    <p><b>Nombre de producto:</b> {item.name}</p>
                                    <p><b>Precio: </b>{item.price} L.</p>
                                    <p><b>Descripcion: </b>{item.description}</p>
                                    {/* <p><b>Cantidad disponible: </b>{item.stock}</p> */}
                                    <p><b>Promocion: </b>{item.featured}</p>
                                </div>
                            </div>
                            <div className="item-actions">
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

    handleDelete(e) {
        
        let {products} = this.state;
        let arrayProducts = [products];
        let selectedProduct = e
        
        
        // let newArray = Object.keys(products).map((item) => {
        //     return { [item]: products[item] };
        // });

        // let filteredItems = newArray.map((item) => {
        //     for(let counter in item) {
        //         if(item[counter] !== e) {
        //             return item
        //         }
        //     }
        // }).filter(item =>  item !== undefined);
        
        // console.log(filteredItems)
        // firebase.database().ref('proucts/' + currentUser).set(
        //     products,
        //     err => console.log(err ? 'error while pushing to DB' : 'succesful push')
        // )


    }

    render() {
        
        return(
            <div className="container">
                <p className="products-title title is-1">Productos</p>
                {
                   this.buildProducts()
                }
            </div>
        )
    }
}

export default Products;
