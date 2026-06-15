import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleAction = (action) => {
    if (!user) {
      alert("You have not logged in. Please login first.");
      navigate('/login');
      return;
    }
    action();
  };

  return (
    <div 
      className="glass-card overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {product.discount}% OFF
          </span>
        )}
        {product.isTrending && (
          <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Trending
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={() => handleAction(() => toggleWishlist(product))}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
      </button>

      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => handleAction(() => addToCart(product))}
            className="p-3 bg-gold hover:bg-gold-dark text-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
          <button 
            onClick={() => onViewDetails && onViewDetails(product)}
            className="p-3 bg-white text-slate-800 hover:bg-slate-100 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
            title="Quick View"
          >
            <Eye className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium tracking-wider uppercase">
          {product.category}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-gold dark:group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({product.reviews})</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-sm text-slate-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
