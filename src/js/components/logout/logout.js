import React from 'react';
import firebase from 'firebase';

const logOutUser = () => {
 firebase.auth().signOut();
};
const LogOut = () => {
 return (
    <div className="navbar-item">
        <button onClick={logOutUser} className="button is-danger" children="Log Out" />
    </div>
 );
};
export default LogOut;