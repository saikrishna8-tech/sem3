import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { categories as dummyCategories } from '../data/dummyData';
import { productApi, mapProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(data.map(mapProduct));
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = dummyCategories;
  const trendingProducts = products.filter((p) => p.isTrending);
  const newArrivals = products.filter((p) => !p.isTrending);

  const features = [
    { icon: <Truck className="h-6 w-6" />, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <RefreshCw className="h-6 w-6" />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <Zap className="h-6 w-6" />, title: 'Fast Delivery', desc: 'Same day dispatch' },
  ];

  return (
    <div className="w-full">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-90"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-dark/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-gold dark:text-white tracking-tight mb-8"
            >
              Discover the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
                Extraordinary
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed"
            >
              Products loaded from PostgreSQL via FastAPI Gateway and Spring Boot API.
            </motion.p>
            {apiError && (
              <p className="text-red-500 text-sm mb-4">
                API unavailable: {apiError}. Start Gateway (8000) and Backend (8080).
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="h-12 w-12 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="glass-card p-6 flex flex-col items-center justify-center cursor-pointer card-hover group"
              >
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <span className="text-2xl font-bold text-gold">{category.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Trending Now
            </h2>
            {loading && <p className="text-slate-500">Loading from API...</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Home;
