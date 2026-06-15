import React from 'react';
import { Package, Globe, MessageCircle, Camera, Video, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-gold" />
              <span className="ml-2 text-2xl font-black text-white tracking-tight">
                AuraBuy
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium eCommerce platform inspired by modern aesthetics. We deliver the highest quality products with an exceptional user experience.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-gold transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Camera className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-gold transition-colors"><Video className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-sm hover:text-gold transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-sm hover:text-gold transition-colors">Categories</Link></li>
              <li><Link to="/wishlist" className="text-sm hover:text-gold transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-gold transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-gold transition-colors">My Account</a></li>
              <li><a href="#" className="text-sm hover:text-gold transition-colors">Track Order</a></li>
              <li><a href="#" className="text-sm hover:text-gold transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="text-sm hover:text-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-gold transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">123 Premium Street, Suite 400<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gold mr-3 flex-shrink-0" />
                <span className="text-sm text-slate-400">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gold mr-3 flex-shrink-0" />
                <span className="text-sm text-slate-400">support@aurabuy.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AuraBuy. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
