import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";

export class Carousel extends Component {
    componentDidMount() {
        this.owlCarousel.componentDidUpdate = function () {
            this.owlCarousel.owlCarousel(this.options);
        };

        if (this.props.items.indexOf(this.props.selectedItem) < 0)
            throw ("Selected item not present in list");

        this.isUpdating = true;
        while ($(this.changerDiv).find(".owl-item.active.center div").html() != this.props.selectedItem)
            this.owlCarousel.to(Math.max(this.props.items.findIndex(item => item === this.props.selectedItem), 0), 0);
        this.isUpdating = false;
    }

    componentDidUpdate() {
        if (this.props.items.indexOf(this.props.selectedItem) < 0)
            throw ("Selected item not present in list");

        this.isUpdating = true;
        while ($(this.changerDiv).find(".owl-item.active.center div").html() != this.props.selectedItem)
            this.owlCarousel.to(Math.max(this.props.items.findIndex(item => item === this.props.selectedItem), 0), 0);
        this.isUpdating = false;
    }

    onChanged = e => {
        if (!this.isUpdating && e.property.name == "position")
            setTimeout(() => {
                if (!this.props.onChanged($(e.target).find(".owl-item.active.center div").html()))
                    this.owlCarousel.next();
            }, 100);
    };

    render() {
        return (
            <div className="changer" ref={div => this.changerDiv = div}>
                <i className="fa fa-caret-down" aria-hidden="true"/>
                <div className="mask-1"/>
                <div className="mask-2"/>

                <div className="changer-list">
                    <OwlCarousel ref={carousel => this.owlCarousel = carousel}
                                 className={"deal-carousel owl-carousel owl-theme " + (this.props.className || "")}
                                 onDrag={this.props.onDrag} onChanged={this.onChanged}
                                 loop={true} center={true} autoplay={false} smartSpeed={700} margin={2} items={2}>
                        {this.props.items.map((item, i) => (<div key={i}>{item}</div>))}
                    </OwlCarousel>
                </div>
            </div>
        )
    }
}
