import React, { useEffect, useState } from 'react';
import { productApi, mapProduct } from '../services/api';
import { Trash2, Plus, RefreshCw } from 'lucide-react';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  rating: '4.5',
  category: 'Electronics',
  imageUrl: '',
};

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productApi.getAll();
      setProducts(data.map(mapProduct));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating),
      category: form.category,
      imageUrl: form.imageUrl,
    };

    try {
      if (editingId) {
        await productApi.update(editingId, payload);
        setMessage('Product updated successfully');
      } else {
        await productApi.create(payload);
        setMessage('Product created successfully');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      rating: String(product.rating),
      category: product.category,
      imageUrl: product.image || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.remove(id);
      setMessage('Product deleted');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Product CRUD (Admin · JWT via Gateway)
        </h3>
        <button
          onClick={loadProducts}
          className="flex items-center gap-2 text-sm text-gold font-medium"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {message && <p className="text-emerald-600 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Rating"
          type="number"
          step="0.1"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        />
        <input
          className="input-field md:col-span-2"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <textarea
          className="input-field md:col-span-2"
          placeholder="Description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="btn-primary md:col-span-2 flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading products...</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">{p.name}</p>
                <p className="text-xs text-slate-500">${p.price} · {p.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-sm text-gold font-medium"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductManager;
