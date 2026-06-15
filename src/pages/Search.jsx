import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApi, mapProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ products: [], courses: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], courses: [], categories: [] });
      return;
    }

    const runSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchApi.search(query);
        setResults({
          products: (data.products || []).map(mapProduct),
          courses: data.courses || [],
          categories: data.categories || [],
        });
      } catch (err) {
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
        Search results
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Query: <span className="font-semibold text-gold">{query || '(empty)'}</span>
      </p>

      {loading && <p className="text-slate-500">Searching via API Gateway...</p>}
      {error && (
        <p className="text-red-500 bg-red-50 dark:bg-red-500/10 p-4 rounded-lg">{error}</p>
      )}

      {!loading && !error && query && (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Products ({results.products.length})
            </h2>
            {results.products.length === 0 ? (
              <p className="text-slate-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Courses ({results.courses.length})
            </h2>
            <ul className="space-y-3">
              {results.courses.map((course) => (
                <li
                  key={course.id}
                  className="glass-card p-4 text-slate-800 dark:text-slate-200"
                >
                  <span className="font-bold">{course.courseName}</span>
                  <span className="text-sm text-slate-500 ml-2">
                    {course.difficulty} · {course.category}
                  </span>
                </li>
              ))}
              {results.courses.length === 0 && (
                <p className="text-slate-500">No courses found.</p>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Categories ({results.categories.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {results.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-4 py-2 rounded-full bg-gold/10 text-gold-dark font-medium"
                >
                  {cat.categoryName}
                </span>
              ))}
              {results.categories.length === 0 && (
                <p className="text-slate-500">No categories found.</p>
              )}
            </div>
          </section>
        </>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Search;
