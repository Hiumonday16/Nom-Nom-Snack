import React, { useState, useRef } from 'react';
import styles from './ProductList.module.css';

function ProductList() {
  const [products, setProducts] = useState(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          setError('Failed to load products');
          return [];
        }
      } catch (err) {
        setError('Network error occurred');
        return [];
      }
    };
    return fetchProducts();
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  if (!hasFetched.current) {
    hasFetched.current = true;
    products.then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }

  return (
    <div className={styles.productList}>
      <h2>Nom Nom Snacks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.productsContainer}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;