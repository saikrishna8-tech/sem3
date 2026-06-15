import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full glass-card p-12"
        >
          <div className="h-24 w-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gold" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Your Cart is Empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Looks like you haven't added anything to your cart yet. Let's find something premium for you.
          </p>
          <Link to="/" className="btn-primary w-full inline-flex justify-center text-lg">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/" className="text-slate-500 hover:text-gold transition-colors p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>
        <span className="bg-gold text-white text-sm font-bold px-3 py-1 rounded-full">
          {cartItems.length} Items
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Cart Items</h2>
            <button 
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="glass-card p-6 md:p-8 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Tax</span>
                <span className="font-medium text-slate-900 dark:text-white">${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-gold block leading-none">
                    ${(total * 1.08).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Includes taxes</span>
                </div>
              </div>
            </div>

            <button className="w-full btn-primary py-4 text-lg mb-6 flex items-center justify-center">
              <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
            </button>

            <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 mr-1 text-green-500" /> Secure Payment Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
