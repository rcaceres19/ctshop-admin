import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class SimpleSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images
        }
    }

    render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    const {images} = this.state;
    
    return (
      <div>
        <Slider {...settings}>
          {
            images.map((item, index) => {
              return(
                <div>
                  <img key={index} src={item} />
                </div>
              )
            })
          }
        </Slider>
      </div>
    );
  }
}