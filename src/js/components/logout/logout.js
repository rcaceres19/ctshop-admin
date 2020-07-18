import React from 'react';
import firebase from 'firebase';

const logOutUser = () => {
 firebase.auth().signOut();

};
const LogOut = () => {
 return (
    <div className="navbar-item">

        <a href="/"><button onClick={logOutUser} className="button is-danger" children="Cerrar Sesi&oacute;n" /></a>
    </div>
 );
};
export default LogOut;