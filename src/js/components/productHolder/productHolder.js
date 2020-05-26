import React from "react";

const ProductHolder = (props) => {

    return(
        
            <div className="item-holder">
                <div className="item">
                    <div className="item-pic">
                        <img src={props.images} />
                    </div>
                    <div className="item-info holder">
                        <div className="item-basic-info">
                            <p><b>Nombre de producto:</b> {props.name}</p>
                            <p><b>Precio: </b>{props.price} L.</p>
                            <p><b>Descripcion: </b>{props.description}</p>
                            <p><b>Cantidad disponible: </b>{props.stock}</p>
                            <p><b>Promocion: </b>{props.featured}</p>
                        </div>
                    </div>
                    <div className="item-actions">
                        <button className="item-button button is-info">
                            <span className="icon is-small">
                                <i className="fa fa-edit" />
                            </span>
                        </button>
                        <button className="item-button button is-danger">
                            <span className="icon is-small">
                                <i className="fa fa-trash" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        
    )
}

export default ProductHolder