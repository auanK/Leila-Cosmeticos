import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300?text=Sem+Imagem';

const Home = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const filteredProducts = useMemo(() => {
    if (categories.length === 0) return products;
    
    const selectedCategory = categories[selectedCategoryIndex];
    if (!selectedCategory) return products;

    return products.filter(p => 
      p.category_ids?.includes(selectedCategory.id) || 
      p.category_names?.some(name => name.toLowerCase() === selectedCategory.name.toLowerCase())
    );
  }, [products, categories, selectedCategoryIndex]);

  const displayProducts = filteredProducts.slice(0, 8).map(p => {
    const priceFrom = Number(p.price_from) || 0;
    const priceTo = Number(p.price_to) || 0;
    const hasDiscount = priceFrom > 0 && priceTo > 0 && priceFrom > priceTo;
    return {
      id: p.id,
      title: p.name,
      brand: p.brand,
      priceFrom,
      priceTo,
      priceNum: priceTo || priceFrom,
      hasDiscount,
      discountPercent: hasDiscount ? Math.round((1 - priceTo / priceFrom) * 100) : 0,
      img: p.main_image || PLACEHOLDER_IMAGE
    };
  });

  const displayCategories = categories.map(c => c.name);

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', flex: 1 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Banner */}
            <div
              style={{
                backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.1) 50%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqkXSaKHlxvCJZrsM7wYLJiSXU6f0zXnLc2YBNF2-DusfZBWw3uglXTdEYYJgHI6h-AuLP3DJoTdijD1zE8vPlEAgAfnAaVSYUU3XHY-NfsOnG1SMQZRJ1jRBcEfWA-RFyPJ6VAZ4P6oLbiDd2tEylMXcBpYj69sNgqz_JputVCul41aHBKeilRhEyQ1_G2m7akeivFjr1jx6BwVLiDAZm-fkyJvEkNOVCRQxxoiY_7tUM_kvBLXcgGCBM_kV29QD3_meg_lqUT5dG")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '280px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                Bem-vinda à Leila Cosméticos
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '500px' }}>
                Descubra os melhores produtos de beleza para realçar sua beleza natural
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {[1, 2, 3, 4, 5].map((d, i) => (
                  <div key={d} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.5)'
                  }} />
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '16px 20px', 
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>
                  Categorias:
                </span>
                {categoriesLoading ? (
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Carregando...</span>
                ) : displayCategories.length === 0 ? (
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Nenhuma categoria disponível</span>
                ) : (
                  displayCategories.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategoryIndex(i)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: i === selectedCategoryIndex ? 'none' : '1px solid #e7cfd7',
                        backgroundColor: i === selectedCategoryIndex ? '#be185d' : 'transparent',
                        color: i === selectedCategoryIndex ? 'white' : '#9a4c66',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Products Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Produtos em Destaque
                </h2>
                <Link to="/produtos" style={{ color: '#be185d', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                  Ver todos →
                </Link>
              </div>

              {productsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#6b7280' }}>Carregando produtos...</p>
                </div>
              ) : displayProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: '#6b7280' }}>Nenhum produto disponível no momento.</p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '20px'
                }}>
                  {displayProducts.map((p) => (
                    <Link 
                      to={`/produto/${p.id}`} 
                      key={p.id} 
                      style={{ 
                        textDecoration: 'none',
                        backgroundColor: '#fdf2f4',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(190, 24, 93, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {p.hasDiscount && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          zIndex: 1
                        }}>
                          -{p.discountPercent}%
                        </div>
                      )}
                      <div
                        style={{ 
                          aspectRatio: '1',
                          backgroundImage: `url("${p.img}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div style={{ padding: '16px' }}>
                        {p.brand && (
                          <p style={{ 
                            color: '#be185d', 
                            fontSize: '12px', 
                            marginBottom: '4px',
                            fontWeight: '500'
                          }}>
                            {p.brand}
                          </p>
                        )}
                        <p style={{ 
                          color: '#1f2937', 
                          fontSize: '14px', 
                          fontWeight: '500',
                          marginBottom: '8px',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {p.title}
                        </p>
                        {p.hasDiscount ? (
                          <div>
                            <p style={{ 
                              textDecoration: 'line-through', 
                              color: '#9ca3af', 
                              fontSize: '12px', 
                              margin: 0 
                            }}>
                              R$ {p.priceFrom.toFixed(2).replace('.', ',')}
                            </p>
                            <p style={{ 
                              margin: 0, 
                              color: '#16a34a',
                              fontSize: '18px',
                              fontWeight: '700'
                            }}>
                              R$ {p.priceTo.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        ) : (
                          <p style={{ 
                            color: '#1f2937',
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: 0
                          }}>
                            R$ {p.priceNum.toFixed(2).replace('.', ',')}
                          </p>
                        )}
                        <p style={{ 
                          color: '#166534', 
                          fontSize: '11px', 
                          marginTop: '4px' 
                        }}>
                          3x R$ {(p.priceNum / 3).toFixed(2).replace('.', ',')} sem juros
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <footer style={{ 
              textAlign: 'center', 
              padding: '32px 16px',
              marginTop: '24px'
            }}>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                @2026 Leila Cosméticos - Todos os direitos reservados
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
