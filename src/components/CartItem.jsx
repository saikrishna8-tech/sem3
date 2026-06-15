import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 glass-card border border-slate-200 dark:border-slate-700 hover:border-gold dark:hover:border-gold transition-colors">
      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs text-gold font-bold uppercase tracking-wider mb-1">{item.category}</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-2">{item.name}</h3>
          </div>
          <button 
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-black text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-gold dark:hover:text-gold transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold text-slate-800 dark:text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-gold dark:hover:text-gold transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Subtotal</span>
            <span className="text-lg font-bold text-slate-800 dark:text-gold">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
