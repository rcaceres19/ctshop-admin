import React, {Component} from 'react';
import '../../../css/components/addProduct/addProduct.scss';
import SimpleSlider from '../../helpers/carousel';
import Uniqid from 'uniqid';
import firebase from '../../../firebase';


class AddProduct extends Component{ 
    constructor(props) {
        super(props);

        this.state = {
            idCompany: "",
            product: {
                id: Uniqid(),
                name: "",
                desc: "",
                cat: "",
                price: "",
                stock: 1,
                outStock: false,
                images: [],
            },
            products: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.agregarProducto = this.agregarProducto.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    handleChange(e) {
        let {name, value} = e.target;
        let {product} = this.state;

        product[name] = value;
        this.setState({product})
        
    }

    uploadImage(e) {
        const file = e.target.files[0];
        const user = firebase.auth().currentUser.uid;
        const storageRef = firebase.storage().ref();
        const url = `images/${user}/${file.name}`;
        const uploadTask = storageRef.child(url);
        
        uploadTask.put(file)
        storageRef.child(url).getDownloadURL().then((url) => {
            let {images} = this.state.product;
            let {product} = this.state;
            
            images.push(url);

            product.images = images;
            this.setState({product})
            console.log(images)
        })
    }

    agregarProducto(e) {
        const user = firebase.auth().currentUser.uid;
        let {product, products} = this.state;

        product.id = Uniqid();
        this.setState({product});

        products.push(product);
        firebase.database().ref('products/' + user).push(
            product,
            err => console.log(err ? 'error while pushing to DB' : 'succesful push')
        )

    }


    render() {
        let {images} = this.state.product;

        return (
            <div className="container">
                <article className="panel is-link article-holder">
                    <p className="panel-heading">
                        Informacion basica
                    </p>
                    <div className="content">
                        <div className="carrousel">
                            <SimpleSlider images={images} />
                        </div>

                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Nombre del producto</label>
                                    <div className="control">
                                        <input type="text" className="input" name="name" placeholder="Nombre" onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Categoria</label>
                                    <div className="control">
                                        <div className="select">
                                            <select name="cat" onChange={this.handleChange}>
                                                
                                                <option value="cuidadop">Cuidado Personal</option>
                                                <option value="deporte">Deporte</option>
                                                <option value="electrodomesticos">Electrodomésticos</option>
                                                <option value="escolar">Escolar y Oficina</option>
                                                <option value="electronica">Electrónica</option>
                                                <option value="hogar">Hogar</option>
                                                <option value="ropa">Ropa y Accesorios</option>
                                                <option value="mundob">Mundo del Bebé</option>
                        
                                            </select>   
                                        </div>
                                    </div>            
                                </div>
                            </div>
                        </div>
                        <div className="field is-expanded">
                            <label className="label">Descripcion del producto</label>
                            <div className="control">
                                <textarea className="textarea" name="desc" placeholder="escriba una descripcion" onChange={ this.handleChange  } />
                            </div>            
                        </div>    
                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Precio</label>
                                    <div className="control">
                                        <input type="text" className="input" name="price" placeholder="Precio" onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Cantidad de producto disponible</label>
                                    <div className="control">
                                        <input type="number" className="input" name="stock" placeholder="Producto Disponible" onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <div className="level-item">
                                <div className="field">
                                    <label className="label">Fuera de stock</label>
                                    <div className="control">
                                        <div className="select" >
                                            <select name="outStock" onChange={this.uploadImge}>
                                                <option value={true}>Si</option>
                                                <option value={false}>No</option>
                                            </select>   
                                        </div>
                                    </div>            
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="level-item">
                                <div className="field">
                                    <div className="file is-primary">
                                        <label className="file-label">
                                        <input className="file-input" name="imagenes" type="file" onChange={this.uploadImage} />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                <i className="fa fa-upload"></i>
                                                </span>
                                                <span className="file-label">
                                                    Elija archivos
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-info" onClick={this.agregarProducto}>Agregar Producto</button>
                            </div>            
                        </div>
                    </div>
                </article>
            </div>
        )
    }

}

export default AddProduct;