import React from 'react';
import { X, ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, cartItems } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleAction = (action) => {
    if (!user) {
      alert("You have not logged in. Please login first.");
      navigate('/login');
      onClose();
      return;
    }
    action();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 border border-white/20"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-5 w-5 text-slate-800 dark:text-white" />
          </button>

          <div className="md:w-1/2 h-64 md:h-auto bg-slate-100 dark:bg-slate-800 relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="text-sm text-gold font-bold uppercase tracking-wider mb-2">
              {product.category}
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center mb-6">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-3">{product.reviews} Reviews</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-lg text-slate-500 line-through ml-3">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto flex flex-col gap-4">
              <button 
                onClick={() => handleAction(() => addToCart(product))}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isInCart ? <Check className="h-5 w-5 mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={() => handleAction(() => toggleWishlist(product))}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all border-2 ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
