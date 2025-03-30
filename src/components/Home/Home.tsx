import './Home.css';

export const Home = () => {
    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Learn Languages Naturally</h1>
                    <p>Speak fluently with our immersive, game-based approach</p>
                    <a href="#" className="btn">Begin Your Journey</a>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <div className="section-title">
                        <h2>Powerful Features</h2>
                        <p>Our API provides everything you need to scrape any website without getting blocked</p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">✓</div>
                            <h3>Javascript Rendering</h3>
                            <p>Render your web page as if it were a real browser. We manage thousands of headless instances using the latest Chrome version.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✓</div>
                            <h3>Rotating Proxies</h3>
                            <p>Thanks to our large proxy pool, you can bypass rate limiting websites, lower the chance to get blocked and hide your bots!</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✓</div>
                            <h3>Easy to Use</h3>
                            <p>Focus on extracting the data you need, and not dealing with concurrent headless browsers that will eat up all your RAM and CPU.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
