import { PriceTicker } from './PriceTicker';

export function Footer() {
  return (
    <footer className="app-footer">
      {/* Top band - Light gray background */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-legal">
              <span>Privacy Policy</span>
              <span>|</span>
              <span>Compliance</span>
              <span>|</span>
              <span>Terms + Conditions</span>
              <span>|</span>
              <span>Copyright ©{new Date().getFullYear()} Ryan H Jewelry Co. All rights reserved</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom band - Dark gray background with price ticker */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-price-ticker">
            <div className="price-ticker-date">
              {new Date().toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              })} MARKET PRICES:
            </div>
            <PriceTicker />
          </div>
        </div>
      </div>
    </footer>
  );
}
