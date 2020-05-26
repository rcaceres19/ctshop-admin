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
    }
    
    componentDidMount() {
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref('products/' + userId).once('value', (snapshot) => {
            this.setState({ products: [snapshot.val()] })
        })
    }

    buildProducts() {
        const {products} = this.state;
        console.log(products)
        let result = products.map((items) => {
            let dataArray = Object.values(items).map((item, index) => {

                return (
                    <ProductHolder id={item.id} 
                    name={item.name} 
                    category={item.cat} 
                    description={item.desc} 
                    outStock={item.outStock} 
                    price={item.price} 
                    stock={item.stock}
                    images={item.images[0]}
                    featured={'No'}
                    />
                )
            })
            return dataArray 
        })

        return result
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
