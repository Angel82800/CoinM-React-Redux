import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";

const carouselData = [
    {
        color: "blue",
        image: "assets/img/lesson-2.svg",
        title: "Decrypting Crypto",
        subtitle: "Looking to understand the wonderful world of crypto?",
        subtitle2: "You're in the right place! This section of the CoinMetro Crypto Academy will teach you the basics, covering a beginner's guide, key terms from around the cryptosphere and will ultimately discuss all-things-Blockchain!",
        lessons: [
            "A Beginner's guide to the crypto market",
            "Useful Terms & Things You Need to Know",
            "What is the Blockchain?",
            "What are the potential applications for Blockchain technology?",
            "What are the issues and limitations of Blockchain technology?",
        ]
    },
    {
        color: "violet",
        image: "assets/img/lesson-4.svg",
        title: "Crypto Assets",
        subtitle: "Crypto assets, cryptocurrencies, digital assets, crypto coins, digital tokens. Phew!",
        subtitle2: "We're exhausted even typing it! But naming them is only the first question. These (often) breathtaking innovations are leading humanity into a new era.",
        lessons: [
            "What is a crypto asset?",
            "What are crypto assets currently used for?",
            "What are the potential uses of crypto assets?",
            "Why is are crypto assets so popular (and potentially profitable)?",
            "Crypto asset vs. Cryptocurrency - What's the difference?",
        ]
    },
    {
        color: "yellow",
        image: "assets/img/academy-coin.svg",
        title: "Initial Coin Offerings (ICOs)",
        subtitle: "ICOs, are a form of crowdfunding used by crypto startups as a means of raising money for their project.",
        subtitle2: "The first ICO took place in mid-2013, since then, ICOs have been an increasingly popular topic in the cryptosphere.",
        lessons: [
            "What are ICOs?",
            "Why have ICOs become so popular?",
            "Why should you be interested in ICOs?",
            "CoinMetro's TGE - How did Coinmetro manage their TGE ?",
            "What is the ICO Express?",
        ]
    }
];

class Academy extends Component {
    render() {
        return (
            <div className="academy-app-container" data-content="academy">
                <div className="row go-content-row">
                    <div className="col-md-12">
                        <div className="go-lessons-slider-container">
                            <div className="go-lesson-prev" onClick={() => this.lessonCarousel.prev()}><i className="fas fa-chevron-left"/></div>
                            <div className="go-lesson-next" onClick={() => this.lessonCarousel.next()}><i className="fas fa-chevron-right"/></div>
                            <OwlCarousel
                                ref={carousel => this.lessonCarousel = carousel}
                                className="go-lessons-slider owl-carousel"
                                loop={true} margin={40} autoplay={true} autoWidth={true} autoplayHoverPause={true} smartSpeed={700}
                                responsive={{ 0: { items: 1 }, 991: { items: 2 }, 1250: { items: 3 } }}
                            >
                                {carouselData.map((item, index) => (
                                    <div key={index} className={`go-lesson-item ${item.color}`}>
                                        <div className="go-lesson-icon">
                                            <img src={item.image} alt=""/>
                                            <a className="go-lesson-play"><i className="fas fa-play"/></a>
                                        </div>

                                        <div className="go-lesson-description">
                                            <p className="go-lesson-title">{item.title}</p>
                                            <p className="go-lesson-subtitle">{item.subtitle}</p>
                                            <p className="go-lesson-subtitle-2">{item.subtitle2}</p>
                                            <div className="go-button-description-container">
                                                <a className="go-button-description">Full Description</a>
                                            </div>
                                        </div>

                                        <div className="go-lesson-content d-flex flex-column">
                                            <ul className="go-lesson-list">
                                                {
                                                    item.lessons.map(lesson => (
                                                        <li key={lesson}>{lesson}</li>
                                                    ))
                                                }
                                            </ul>

                                            <div className="go-lesson-buttons mt-auto pt-5">
                                                <a className="go-button-gray">
                                                    <i className="fas fa-play"/> Play lesson
                                                    <div className="ga-coming-but">
                                                        <img src="assets/img/reflect.png" className="go-coming-reflect"/>
                                                        <div className="go-coming-soon-title">Coming Soon</div>
                                                    </div>
                                                </a>

                                                <a className="go-button-circle">
                                                    <i className="fa fa-reply"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </div>
                    </div>
                </div>

                <div className="go-animation">
                    <img src="assets/img/build-6.svg" className="go-animation-build-1"/>
                    <img src="assets/img/build-7.svg" className="go-animation-build-2"/>
                    <img src="assets/img/tree.svg" className="go-animation-tree"/>
                    <img src="assets/img/build-5.svg" className="go-animation-build-3"/>
                    <div className="go-animation-train-mask">
                        <img src="assets/img/train.svg" className="go-animation-train go-trainmoveh go-anim-dur16"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Academy;
