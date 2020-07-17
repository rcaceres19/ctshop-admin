import React, {Component} from 'react';
import '../../../css/components/addProduct/addProduct.scss';
import SimpleSlider from '../../helpers/carousel';
import Uniqid from 'uniqid';
import firebase from '../../../firebase';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import algoliasearch from 'algoliasearch'

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
                // promocion: {
                //     status: false,
                //     promo: "",
                //     startDate: "",
                //     endDate: ""
                // },
                talla: ''
            },
            prodcuts: [],
            offerflg: false,
            tallaflg: false,
            promocionflg: false,
            errorflg: false,
            tallaArray: [],
            editProductFlg: false,
            company: {}
            // promocionArray: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.agregarProducto = this.agregarProducto.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.checkProduct = this.checkProduct.bind(this);
        this.addtalla = this.addtalla.bind(this);
        this.deleteTalla = this.deleteTalla.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.editProduct = this.editProduct.bind(this);
        // this.addOferta = this.addOferta.bind(this);
    }

    componentDidMount() {
        let {product} = this.state;
        const user = firebase.auth().currentUser.uid;

        try {
            let editProduct = this.props.location.state.editProduct;
            if(this.props.location.state.editProduct) {
                product = editProduct
            }
            this.setState({product})
            this.setState({editProductFlg: true})
        } catch (error) {
            console.log(error)
        }
        
        firebase.database().ref(`/products/${user}`).once('value', snapshot => {
            if(snapshot.exists()) {
                this.setState({products: snapshot.val()})
            }
        })

        firebase.database().ref(`/companies/${user}`).once('value', snapshot => {
            if(snapshot.exists()) {
                this.setState({company: snapshot.val()})
            }
        })
    }

    handleChange(e) {
        let {name, value} = e.target;
        let {product} = this.state;
        let date = product.descuento.startDate;
        let endDate = product.descuento.endDate; 
        
        console.log(product)
        if(name == 'ofertaStatus') {
            if(value == "true") {
                this.setState({offerflg:true})
                product.descuento.status = true;
                date = new Date();
                endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                product.descuento.startDate = date.toLocaleDateString("en-US");
                product.descuento.endDate = endDate.toLocaleDateString("en-US");
                
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

    async uploadImage(e) {
        const file = e.target.files[0];
        firebase.auth().onAuthStateChanged((user) => {
            const storageRef = firebase.storage().ref(`images/${user.uid}/${file.name}`);
            storageRef.put(file).then((snapshot) => {
                let {product} = this.state;
    
                storageRef.getDownloadURL().then((result) => {
                    product.images.push(result);
                    
                    console.log(product)
                    this.setState({ product:product })  
                })
            })
        })    

        // uploadTask.put(file)
        
        // storageRef.child(url).getDownloadURL().then((url) => {
        //     let {product} = this.state;
            
        //     product.images.push(url);

        //     this.setState({ product:product })
        // })
    }

    addtalla(e) {
        let {product, tallaArray} = this.state;

            if(product.talla == '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Seleccione una talla',
                })
            } else {
                tallaArray.push({
                    cantidad: parseInt(product.stock),
                    talla: product.talla
                })
            }
        
        this.setState({ tallaArray })
        
    }

    // addOferta(e) {
    //     let {product, promocionArray} = this.state;

    //         if(product.promocion.promo == '') {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Seleccione una oferta',
    //             })
    //         } else {
    //             promocionArray.push(product.promocion.promo)
    //         }
        
    //     this.setState({ promocionArray })
    // }

    deleteTalla(e) {
        const {tallaArray} = this.state
        
        const newArray = tallaArray.filter(item => item  !== e)
        
        this.setState({tallaArray:newArray})
        
    }

    deleteImage(e) {
        let {product} = this.state
        
        product.images = product.images.filter(item => item  !== e)
        
        console.log(product)

        this.setState({product})
    }

    checkProduct(e) {
        let {product, products} = this.state;
        let error = false;
        let errorPro = false;

        console.log(product.stock)

        if(product.name == "" || product.cat == "" || product.images.length == 0 || product.price == 0 ) {
            console.log('nombre, cat, images, price vacio')
            error = true
        }

        if(product.cat == "calzado" || product.cat == "ropa" ) {
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
        let {product, tallaArray, products, company} = this.state;
        const client = algoliasearch("JMZRBX4JGB", "621de791efbd3929d558edff15c45e58");
        const index = client.initIndex("ctindex");
        let date = + new Date();

        product.stock = parseInt(product.stock);
        product.price = parseInt(product.price);
        product.dateAdded = date;
        
        if(tallaArray.length) {
            product.stock = tallaArray    
        }

        //console.log(gatherer)
        product.id = Uniqid();
        this.setState({product});

        if(product.outStock == false) { 
            const myRef = firebase.database().ref('products/' + user).push(
                product,
                error => {
                if (error) {
                        Swal.fire({
                            position: 'top-end',
                            title: 'Oops...',
                            text: 'Algo ha salido mal, intenta nuevamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            position: 'top-end',
                            title: 'Tu producto ha sido agregado',
                            showConfirmButton: false,
                            timer: 2500
                        })
                    }
                }
            )
            const key = myRef.key;
            console.log(key)
            index.saveObject({
                objectID: key,
                name: product.name,
                category: product.cat,
                descripcion: product.desc,
                descuento: product.descuento,
                image: product.images,
                outStock: product.outStock,
                price: product.price,
                stock: product.stock,
                talla: product.talla,
                vendedorID: user,
                vendedorName: company.company,
                dateAdded: date
            }).then(() => {
                location = location
            })
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href>Why do I have this issue?</a>'
            })
        }
    }

    editProduct() {
        const {product, products} = this.state;
        const userId = firebase.auth().currentUser.uid;

        let productFilter = Object.values(products).map((item, index) => {
            if(item.id == product.id) {
                return item
            } 
        }).filter(item => item !== undefined)
        
        productFilter.map(item => {
            item = product
        })

        for(let i in products) {
            if(products.hasOwnProperty(i)) {
                if(products[i].id == product.id) {
                    products[i] = product;
                    console.log({[i]: products[i].stock})
                    // Firebase.database().ref(`/ventas/${userId}/cliente-tienda/${i}`).push(
                    //     compiler
                    // )
                    firebase.database().ref(`/products/${userId}/${i}`).update({
                        cat: products[i].name,
                        desc: products[i].desc,
                        descuento: products[i].descuento,
                        images: products[i].images,
                        name: products[i].name, 
                        outStock: products[i].outStock, 
                        price: products[i].price, 
                        promocion: products[i].promocion, 
                        stock: products[i].stock, 
                        talla: products[i].talla, 
                    }).then(() => {
                        console.log('Producto Actualizado')
                    })
                } 
            }
        }
    }

    render() {
 
        let {product, offerflg, tallaflg, promocionflg} = this.state;

        return (
            <div className="container">
                <div className="box">
                    <div className="carrousel">
                        <SimpleSlider images={this.state.product.images}  />
                    </div>
                    <br />
                    <div className="columns">
                        <div className="column">
                            <div>
                                <div className="field">
                                    <label className="label">Nombre del Producto</label>
                                    <div className="control">
                                        <input type="text" className="input" name="name" placeholder="Nombre del Producto" value={this.state.product.name} required onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <div>
                                <div className="field">
                                    <label className="label">Categor&iacute;a</label>
                                    <div className="control">
                                        <div className="select">
                                            <select name="cat" required onChange={this.handleChange}>
                                                {this.state.product.cat !== "" && <option hidden={true} selected={true} value={this.state.product.cat}>{this.state.product.cat}</option>}
                                                <option hidden={true}>Categor&iacute;a</option>
                                                <option value="cuidadoSp">Cuidado Personal</option>
                                                <option value="deporte">Deporte</option>
                                                <option value="electrodomesticos">Electrodomésticos</option>
                                                <option value="escolar">Escolar y Oficina</option>
                                                <option value="electronica">Electrónica</option>
                                                <option value="hogar">Hogar</option>
                                                <option value="ropa">Ropa</option>
                                                <option value="accesorios">Accesorios</option>
                                                <option value="mundob">Mundo del Bebé</option>
                                                <option value="calzado">Calzado</option>         
                                            </select>   
                                        </div>
                                    </div>            
                                </div>
                                <div>
                                    <div className="field">
                                        <label className="label">Descripci&oacute;n del Producto</label>
                                        <div className="control">
                                            <textarea required className="textarea" name="desc" value={this.state.product.desc} placeholder="Escriba una descripci&oacute;n..." onChange={ this.handleChange  } />
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
                                        <input type="number" className="input" name="price" value={this.state.product.price} required placeholder="Precio" onChange={ this.handleChange  } />
                                    </div>            
                                </div>
                            </div>
                            <hr />
                            <div className="level">
                                <div>
                                    <div className="field">
                                        <label className="label">Cantidad de Producto Disponible</label>
                                        <div className="control">
                                            <input type="number" className="input" name="stock" value={this.state.product.stock} required placeholder="Producto Disponible" onChange={ this.handleChange  } />
                                        </div>            
                                    </div>
                                </div>
                                {/* <div>
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
                                </div> */}
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
                                                        {this.state.product.descuento.status && <option hidden={true} value={this.state.product.descuento.status}>{this.state.product.descuento.status}</option>}
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
                                                        <input type="text" className="input" value={this.state.product.descuento.porcentaje} required name="porcentaje" placeholder="Porcentaje" onChange={ this.handleChange  } />
                                                    </div>            
                                                </div>
                                            </div>
                                            
                                        :

                                            ""
                                    }
                                    {
                                        tallaflg && product.cat == 'ropa' || product.cat == 'deporte' ? 
                                        <div>
                                            <div>
                                                <label className="label">Tallas</label>
                                            </div>    
                                                <div className="field">
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
                                                        <button className="button is-info" onClick={this.addtalla}>Agregar Talla</button>
                                                    </div>            
                                                </div>
                                            </div>
                                        :
                                        ""
                                    }
                                    {
                                        tallaflg && product.cat == 'calzado' ? 
                                        
                                            <div className="field ">
                                                <label className="label">Tallas</label>
                                                <div className="control">
                                                    <div className="select" >
                                                        <select name="talla" onChange={this.handleChange}>
                                                            <option hidden={true}>Talla</option>
                                                            <option value={6}>6</option>
                                                            <option value={6.5}>6.5</option>
                                                            <option value={7}>7</option>
                                                            <option value={7.5}>7.5</option>
                                                            <option value={8.5}>8.5</option>
                                                            <option value={9}>9</option>
                                                            <option value={9.5}>9.5</option>
                                                            <option value={10}>10</option>
                                                            <option value={10.5}>10.5</option>
                                                            <option value={11}>11</option>
                                                            <option value={11.5}>11.5</option>
                                                            <option value={12}>12</option>
                                                            <option value={12.5}>12.5</option>
                                                            <option value={13}>13</option>
                                                            <option value={13.5}>13.5</option>
                                                            <option value={14}>14</option>
                                                            <option value={14.5}>14.5</option>
                                                            <option value={15}>15</option>
                                                            <option value={15.5}>15.5</option>
                                                            <option value={16}>16</option>
                                                            <option value={16.5}>16.5</option>
                                                            <option value={17}>17</option>
                                                        </select>   
                                                    </div>
                                                    <button className="button is-info" onClick={this.addtalla}>Agregar Talla</button>
                                                </div>         
                                            </div>
                                        :
                                        ""
                                    }
                                </div>
                            </div>
                            <hr />
                            {/* <div className="level">
                                <div className="field">
                                    <label className="label">Promocion</label>
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
                                            <button className="button is-info" onClick={this.addOferta}>Agregar Oferta</button>
                                        </div>          
                                    </div>
                                    
                                    :
                                    ""
                                }
                            </div> */}
                            <hr />
                            <label><b>Resumen de Tallas</b></label>
                            <div>
                                {
                                    this.state.tallaArray.map((item) => (
                                    
                                        <div>
                                            <label>Cantidad: <b>{item.cantidad}</b></label>
                                            <label>Talla: <b>{item.talla}</b></label>
                                            <a className="delete" onClick={ () => this.deleteTalla(item) } />
                                        </div>
                                    ))
                                }
                            </div>
                            <label><b>Resumen de Fotos</b></label>
                            <div>
                                {
                                    this.state.product.images.map((item) => (
                                        <div className="resume-img" >
                                            <img  src={item} />
                                            <a className="delete" onClick={ () => this.deleteImage(item) } />
                                        </div>
                                    ))
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
                                                Añadir Imagen
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="field">
                        <div className="control">
                            {!this.state.editProductFlg && <button className="button is-info" onClick={this.checkProduct}>Agregar Producto</button>}
                            {this.state.editProductFlg && <button className="button is-info" onClick={this.editProduct}>Editar Producto</button>}
                        </div>            
                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(AddProduct);