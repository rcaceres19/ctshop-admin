import React, {Component} from 'react'
import firebase from '../firebase';
import Bar from './header/bar/bar';
//import 'bulma/bulma.sass';
import '../css/mystyles.scss';
import Footer from './footer/footer';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated: false,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((authenticated) => {
          authenticated
            ? this.setState(() => ({
                authenticated: true,
              }))
            : this.setState(() => ({
                authenticated: false,
              }));
        });
    }

    render() {
        return(
            <div>
              <Bar authenticated={this.state.authenticated} />
              <Footer />
            </div>
        )
    }
}

export default App;