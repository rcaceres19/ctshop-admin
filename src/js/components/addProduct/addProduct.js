import React, {Component} from 'react';
import '../../../css/components/addProduct/addProduct.scss';
import SimpleSlider from '../../helpers/carousel';
import Uniqid from 'uniqid';
import firebase from '../../../firebase';
import Swal from 'sweetalert2';


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
                price: 0,
                stock: 1,
                outStock: false,
                images: [],
                descuento: {
                    status: false,
                    porcentaje: 0,
                    startDate: "",
                    endDate: ""
                },
                promocion: {
                    status: false,
                    promo: "",
                    startDate: "",
                    endDate: ""
                },
                talla: ''
            },
            products: [],
            offerflg: false,
            tallaflg: false,
            promocionflg: false,
            errorflg: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.agregarProducto = this.agregarProducto.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.checkProduct = this.checkProduct.bind(this);
    }

    handleChange(e) {
        let {name, value} = e.target;
        let {product} = this.state;
        let date = product.descuento.startDate;
        let endDate = product.descuento.endDate; 
        
        if(name == 'ofertaStatus') {
            if(value == "true") {
                this.setState({offerflg:true})
                product.descuento.status = true;
                date = new Date();
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                product.descuento.startDate = date.toLocaleDateString("en-US");
                product.descuento.endDate = endDate.toLocaleDateString("en-US");
                console.log(endDate)
            } 

            if(value == "false") {
                this.setState({offerflg:false});
                product.descuento.status = false;
                product.descuento.porcentaje = 0;
                product.descuento.startDate = "";
                product.descuento.endDate = "";
            }
        }

        if(name == 'promocionStatus') {
            if(value == "true") {
                this.setState({promocionflg:true})
                product.promocion.status = true;
                date = new Date();
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                product.promocion.endDate = endDate.toLocaleDateString("en-US");
                product.promocion.startDate = date.toLocaleDateString("en-US");
            } 
            if(value == "false") {
                this.setState({promocionflg:false})
                product.promocion.startDate = "";
                product.promocion.endDate = "";
                product.promocion.promo = "";
                product.promocion.status = false;
            }
        }

        
        if(name == 'cat' && value == 'deporte' || value == 'calzado' || value == 'ropa') {
            this.setState({tallaflg:true})
        } 
        if(name == 'cat' && value == 'cuidadop' || value == 'electrodomesticos' || value == 'electronica'|| value == 'hogar'|| value == 'mundob' ) {
            this.setState({tallaflg:false})
            product.talla = ""
        }
        
        if(name == 'porcentaje' && product.descuento.status == true) {
            product.descuento.porcentaje = parseInt(value);
        }
        if( name !== 'promocionStatus' && name !== 'promo' && name !== 'ofertaStatus' && name !== 'porcentaje') {
            product[name] = value;
        }

        if(name == 'promo' && product.promocion.status == true) {
            product.promocion.promo = value;
        }

        this.setState({product:product})
        
    }

    uploadImage(e) {
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref();
        const url = `images/${user}/${file.name}`;
        const uploadTask = storageRef.child(url);
        const user = firebase.auth().currentUser.uid;

        uploadTask.put(file)
        storageRef.child(url).getDownloadURL().then((url) => {
            let {product} = this.state;
            
            product.images.push(url);

            this.setState({ product:product })
        })
    }

    checkProduct(e) {
        let {product, products} = this.state;
        let error = false;
        let errorPro = false;

        if(product.promocion.status == true && product.promocion.promo == '2x1' && product.stock <= 1) {
            console.log('entro a 2')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Minima cantidad de producto: 2',
                footer: '<a href>Porque tengo este problema?</a>'
            })
            errorPro = true
        }
        if(product.promocion.status == true && product.promocion.promo == '3x2' || product.promocion.promo == '3x1' && product.stock <= 2) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Minima cantidad de producto: 3',
                footer: '<a href>Porque tengo este problema?</a>'
            })
            errorPro = true
        }
        if(product.promocion.status == true && product.promocion.promo == '5x3' && product.stock <= 4) {
            console.log('entro a 5')
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Minima cantidad de producto: 5',
                footer: '<a href>Porque tengo este problema?</a>'
            })
            errorPro = true
        }

        if(product.name == "" || product.cat == "" || product.images.length == 0 || product.price == 0 ) {
            console.log('nombre, cat, images, price vacio')
            error = true
        }

        if(product.cat == "deporte" || product.cat == "calzado" || product.cat == "ropa" ) {
            console.log(product)
            if(product.talla == "") {
                error = true
            }
        }

        if(product.descuento.status == true && product.descuento.porcentaje == 0) {
            error = true
        }

        if(error  == false && errorPro == false) { 
            this.agregarProducto()
        }

        if(error == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Complete todos los campos'
            })
            error = false
        }
        if(errorPro == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Necesita agregar mas cantidad de producto'
            })
            errorPro = false
        } 
    }

    agregarProducto(e) {
        
        const user = firebase.auth().currentUser.uid;
        let {product, products} = this.state;

        product.id = Uniqid();
        this.setState({product});

        if(product.outStock == false) { 
            products.push(product);
            firebase.database().ref('products/' + user).push(
                product,
                err => console.log(err ? 'error while pushing to DB' : 'succesful push')
            )
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href>Why do I have this issue?</a>'
            })
        }
    }


    render() {
 
        let {product, offerflg, tallaflg, promocionflg} = this.state;

        return (
            <div className="container">
                <div className="box has-text-centered">
                    <div className="carrousel">
                        <SimpleSlider images={product.images}  />
                    </div>
                    <div className="columns">
                        <div className="column">
                            <div>
                                <div className="field">
                                    <label className="label">Nombre del producto</label>
                                    <div className="control">
                                        <input type="text" className="input" name="name" placeholder="Nombre" required onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <div>
                                <div className="field">
                                    <label className="label">Categoria</label>
                                    <div className="control">
                                        <div className="select">
                                            <select name="cat" required onChange={this.handleChange}>
                                                <option hidden={true}>Categoria</option>
                                                <option value="cuidadop">Cuidado Personal</option>
                                                <option value="deporte">Deporte</option>
                                                <option value="electrodomesticos">Electrodomésticos</option>
                                                <option value="escolar">Escolar y Oficina</option>
                                                <option value="electronica">Electrónica</option>
                                                <option value="hogar">Hogar</option>
                                                <option value="ropa">Ropa y Accesorios</option>
                                                <option value="mundob">Mundo del Bebé</option>
                                                <option value="calzado">Calzado</option>         
                                            </select>   
                                        </div>
                                    </div>            
                                </div>
                                <div>
                                    <div className="field">
                                        <label className="label">Descripcion del producto</label>
                                        <div className="control">
                                            <textarea required className="textarea" name="desc" placeholder="escriba una descripcion" onChange={ this.handleChange  } />
                                        </div>            
                                    </div>   
                                </div>
                            </div>
                        </div>
                        <div className="column ">
                            <div>
                                <div className="field">
                                    <label className="label">Precio</label>
                                    <div className="control">
                                        <input type="number" className="input" name="price" required placeholder="Precio" onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <hr />
                            <div className="level">
                                <div>
                                    <div className="field">
                                        <label className="label">Cantidad de producto disponible</label>
                                        <div className="control">
                                            <input type="number" className="input" name="stock" required placeholder="Producto Disponible" onChange={ this.handleChange  } />
                                        </div>            
                                    </div>
                                </div>
                                <div>
                                    <div className="field">
                                        <label className="label">Fuera de stock</label>
                                        <div className="control">
                                            <div className="select" >
                                                <select name="outStock"  onChange={this.handleChange}>
                                                    <option value={ false }>No</option>
                                                    <option value={ true }>Si</option>
                                                </select>   
                                            </div>
                                        </div>            
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="level">
                                    <div>
                                        <div className="field">
                                            <label className="label">Descuento</label>
                                            <div className="control">
                                                <div className="select" >
                                                    <select name="ofertaStatus" onChange={this.handleChange}>
                                                    
                                                        <option value={ false }>No</option>
                                                        <option value={ true }>Si</option>
                                                        
                                                    </select>   
                                                </div>
                                            </div>            
                                        </div>
                                    </div>
                                    {
                                        offerflg ?
                                            <div>
                                                <div className="field">
                                                    <label className="label">Porcentaje</label>
                                                    <div className="control">
                                                        <input type="text" className="input" required name="porcentaje" placeholder="Porcentaje" onChange={ this.handleChange  } />
                                                    </div>            
                                                </div>
                                            </div>
                                            
                                        :

                                            ""
                                    }
                                    {
                                        tallaflg ? 
                                        <div>
                                            <div className="field">
                                                <label className="label">Tallas</label>
                                                <div className="control">
                                                    <div className="select" >
                                                        <select name="talla" onChange={this.handleChange}>
                                                            <option hidden={true}>Talla</option>
                                                            <option value={'S'}>S</option>
                                                            <option value={'M'}>M</option>
                                                            <option value={'L'}>L</option>
                                                            <option value={'XL'}>XL</option>
                                                            <option value={'XXL'}>XXL</option>
                                                        </select>   
                                                    </div>
                                                </div>            
                                            </div>
                                        </div>
                                        :
                                        ""
                                    }
                                </div>
                            </div>
                            <hr />
                            <div className="level">
                                <div className="field">
                                    <label className="label">Oferta</label>
                                    <div className="control">
                                        <div className="select" >
                                            <select name="promocionStatus" onChange={this.handleChange}>
                                                <option value={false}>No</option>
                                                <option value={true}>Si</option>
                                            </select>   
                                        </div>
                                    </div>            
                                </div>
                                {
                                    promocionflg ?
                                    <div className="field">
                                        <label className="label">Oferta</label>
                                        <div className="control">
                                            <div className="select" >
                                                <select name="promo" onChange={this.handleChange}>
                                                    <option hidden={true}>Promocion</option>
                                                    <option value='2x1'>2x1</option>
                                                    <option value='3x1'>3x1</option>
                                                    <option value='3x2'>3x2</option>
                                                    <option value='5x3'>5x3</option>
                                                </select>   
                                            </div>
                                        </div>            
                                    </div>
                                    :
                                    ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
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
                            <button className="button is-info" onClick={this.checkProduct}>Agregar Producto</button>
                        </div>            
                    </div>
                </div>
            </div>
        )
    }

}

export default AddProduct;