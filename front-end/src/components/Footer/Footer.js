import angelList from '../../icons/angellist.ico';
import rightArrow from '../../icons/footer-right-arrow.ico';
import './Footer.css';


function Footer() {

    return (
        <footer>
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-top-left">
                        <div>
                            <div className="footer-tech-stack">
                                <div className="footer-tech-stack-text">
                                    TECH STACK
                                </div>
                                <div className="footer-below-tech-stack">
                                    <div>
                                        JavaScript
                                    </div>
                                    <div>
                                        Python
                                    </div>
                                    <div>
                                        React
                                    </div>
                                    <div>
                                        Redux
                                    </div>
                                    <div>
                                        Flask
                                    </div>
                                    <div>
                                        SQLAlchemy
                                    </div>
                                    <div>
                                        HTML5
                                    </div>
                                    <div>
                                        CSS3
                                    </div>
                                </div >
                            </div>
                        </div>
                        <div>
                            <div className="footer-hosting">
                                <div className="footer-hosting-text">
                                    HOSTING/DATABASE
                                </div>
                                <div className="footer-below-hosting">
                                    <div>
                                        PostgreSQL
                                    </div>
                                    <div>
                                        SQLite
                                    </div>
                                    <div>
                                        Render
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="footer-ides">
                                <div className="footer-ides-text">
                                    IDEs/Editors/Misc
                                </div>
                                <div className="footer-below-ides">
                                    <div>
                                        Xcode
                                    </div>
                                    <div>
                                        Visual Studio Code
                                    </div>
                                    <div>
                                        Adobe Photoshop
                                    </div>
                                    <div>
                                        Postman
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="footer-other-sites">

                                <div className="footer-below-other-sites">
                                    <div className="footer-other-site">
                                        <a id="ayrbnb" className="ayrbnb-link" href="https://ayrbnb.herokuapp.com" target="_blank" rel="noreferrer">
                                            ayrbnb.herokuapp.com
                                            <img src={rightArrow} className="footer-right-arrow ayrbnb-arrow" />
                                        </a>
                                    </div>
                                    <div className="footer-other-site">
                                        <a id="codebunny" className="codebunny-link" href="https://codebunny.onrender.com" target="_blank" rel="noreferrer">
                                            codebunny.onrender.com
                                            <img src={rightArrow} className="footer-right-arrow codebunny-arrow" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-terms">
                        <div>Privacy Policy</div>
                        <div>Terms of Use</div>
                        <div>Cookies and Interest-Based Ads</div>
                        <div>Do Not Sell</div>
                        <div>Cookies Settings</div>
                    </div>

                </div>
            </div>
        </footer >
    )
}


export default Footer;
