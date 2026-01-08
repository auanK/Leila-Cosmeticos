import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const fallbackProducts = [
  { id: 1, title: "Batom Matte Veludo - Rosa", price: "R$29,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiY7j4pzUG8Eu7FipJ-YlDfxcs8Ljra0OUjXru4tzVEqElQSm4qsrSbzj30cmJjyCaNmFzKyJ-YqHTT4iP99IxvEwOpnVxlEZgXsauxNlyzrReBHR4yDqxOymwG4U_exjgvp0wKJ0bpG4BbMnF707AMNMNZCMuWlbj8ZEdbHB0S6ZBgSVhKsb4hYZdfSsnj8swuoSGojQfnGmPAYWgWmnbD1cw23Pobd4m-a5SlFnEx0H7a-7P36-7bo1GMwojF9qCfEA1rT64xsDD", priceNum: 29.90 },
  { id: 2, title: "Batom Líquido Longa Duração - Vermelho", price: "R$34,50", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf64BpDhATOPgsuPHqKDpXCoP9k_HQgbWNAQ9F5pwTLYTm8mi640P9TDyRXL8utHJWthPwl2tH7EDCME6wm4gv48arh8dxqKL6UVxk7kEQBsLBngtSA6A-KmOe8QsT_dqUsIlcq7w5v_LwAzNxzUZ-TS6_KOBwDi0RCrRLWySkU-k4101kw6UY7GFHJq134MC1B6jmdElOMFRAbggW1wityken8gCnzbTSoNwyn18OXhuS2-iY6zREQS_YO3vp4BXqepU2LsdvgvPZ", priceNum: 34.50 },
  { id: 3, title: "Batom Cremoso Hidratante - Nude", price: "R$25,00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2n6yBuxEQCei0rpmXJ49db9CSxxhpff-gLH8p3q8IRlXXC0c3cagWfeZhs7Xtbc3L05LG0Q_rKWeoLMl7U5m2jEn_-APFsKzCH-Rx2qPWn-WKfCsGtLDUzoodGkIgDy5PVbveNgHwxiDNPohf4VTXCuXC7gO6Whx6aUW-vrtH1lurmHcIEsEYC6_JJlEku9dZNEmrmdFBOtmiKLKvi3jurgIJgG4WhRZ3Nyff-71YCFMzv0KdRQDmdDU5NyT6S1t4wGLomLHD9_Cv", priceNum: 25.00 },
  { id: 4, title: "Batom Metálico Brilhante - Bronze", price: "R$39,99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-bJDbcl2aeC2VkAqNDmvXik6f0GPUkl2GtpJVXBlnHahwmyuIk2IkKB_aJOiEvUmJ45UBIRLGq6gOcdnBWXfIP3LLQM42HBPBtgU2BZxhQpXf8g7YxEyqUwwhC1qz-XYkjfNkaS6NLhhIp2qDU7hYWnyjupOPnHda_Rx0v5sfY9WNms4jEL34wENTJptDG1yN1UU5035heC1W6BJuCqNn0FFC5bVoGkXEN9CzCDstop3Wlhyi-wSCCGR6i16hXKyQSbYQ9ZYuv0EV", priceNum: 39.99 },
  { id: 5, title: "Batom Vegano Natural - Coral", price: "R$27,80", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXK9rScJWeVfo68_A8WKzUPn560WHOZ0xzaYzGwWIme0-G_DB0QsW3D9MKddARz7GLfgFglVZkdKkChy6j6QiLgALKCioZ_tsFxEBsvYA27iDOGeNyUBWz7udPtDp7y3rxDM2nn9qbP8GnMGRqPEsSDDuj_zC_IYyfvYUUK634fXneH5A8iwCWctfazgZ2ap0xTyXjp90fAkSYXMKBC_XPfbZyg3hP75iHRbXL3aCDtQ4ywXkKZPecQuBytZDzMOo9niJb5FBunxoU", priceNum: 27.80 },
  { id: 6, title: "Batom Duo Lápis e Gloss - Pink", price: "R$32,00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiN6DPRhU709zFrDOSxRoF1rjr3ZhM_JFPevikky2YvbArmaeJ6tPbZHdd9MaKTfDsIGaVebgiuvDe2RNW6hV01qoBM3Gb0noExFytbN8cjgBVA_3_IcTrSwo3Da-2sLgc-MfSNGob5Lfz35mARJm31_67OJze2_-s1Vgu2vq41KntAlo9K4IVKPxPgsSWIwucGHT3hY68cV6X4SnOpxNsxCpSIIbJQZJeWpC7mHUMeosVftBQ04sFkd0UEzbAnhpvyeqDDxRhvsgA", priceNum: 32.00 }
];

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const ProductListing = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchTerm = searchParams.get('busca') || '';
  const selectedCategories = searchParams.get('categorias')?.split(',').filter(Boolean) || [];
  const selectedSkinTypes = searchParams.get('pele')?.split(',').filter(Boolean) || [];
  const selectedBrands = searchParams.get('marcas')?.split(',').filter(Boolean) || [];
  const sortOrder = searchParams.get('ordenar') || 'relevancia';
  const minPrice = searchParams.get('precoMin') ? Number(searchParams.get('precoMin')) : undefined;
  const maxPrice = searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : undefined;


  const mappedProducts = useMemo(() => {
    if (products.length > 0) {
      return products.map(p => ({
        id: p.id,
        title: p.name,
        price: formatPrice(p.price_from, p.price_to),
        priceNum: Number(p.price_to) || Number(p.price_from) || 0,
        img: p.main_image || fallbackProducts[0].img,
        categoryIds: p.category_ids || [],
        categoryNames: p.category_names || [],
        skinType: p.skin_type,
        brand: p.brand
      }));
    }
    return fallbackProducts.map(p => ({ 
      ...p, 
      categoryIds: [] as number[], 
      categoryNames: [] as string[],
      skinType: undefined, 
      brand: undefined 
    }));
  }, [products]);

  const availableSkinTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(p => {
      if (p.skin_type) types.add(p.skin_type);
    });
    return Array.from(types);
  }, [products]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands);
  }, [products]);

  const priceRange = useMemo(() => {
    if (mappedProducts.length === 0) return { min: 0, max: 1000 };
    const prices = mappedProducts.map(p => p.priceNum).filter(p => p > 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [mappedProducts]);

  const updateFilter = (key: string, value: string | string[] | number | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, String(value));
    }
    
    setSearchParams(newParams);
  };

  const toggleArrayFilter = (key: string, currentValues: string[], value: string) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const displayProducts = useMemo(() => {
    let filtered = [...mappedProducts];

    if (selectedCategories.length > 0) {
      const categoryIds = selectedCategories
        .map(catName => categories.find(c => c.name.toLowerCase() === catName.toLowerCase())?.id)
        .filter((id): id is number => id !== undefined);
      if (categoryIds.length > 0) {
        filtered = filtered.filter(p => 
          p.categoryIds.some(catId => categoryIds.includes(catId))
        );
      }
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(searchLower);
        const matchingCategory = categories.find(c => 
          c.name.toLowerCase().includes(searchLower)
        );
        const categoryMatch = matchingCategory && p.categoryIds.includes(matchingCategory.id);
        return titleMatch || categoryMatch;
      });
    }

    if (selectedSkinTypes.length > 0) {
      filtered = filtered.filter(p => 
        p.skinType && selectedSkinTypes.some(t => 
          p.skinType?.toLowerCase() === t.toLowerCase()
        )
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => 
        p.brand && selectedBrands.some(b => 
          p.brand?.toLowerCase() === b.toLowerCase()
        )
      );
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.priceNum >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.priceNum <= maxPrice);
    }

    if (sortOrder === 'menor') {
      filtered.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortOrder === 'maior') {
      filtered.sort((a, b) => b.priceNum - a.priceNum);
    }

    return filtered;
  }, [mappedProducts, selectedCategories, categories, searchTerm, selectedSkinTypes, selectedBrands, minPrice, maxPrice, sortOrder]);

  const getPageTitle = () => {
    if (selectedCategories.length === 1) {
      const cat = categories.find(c => c.name.toLowerCase() === selectedCategories[0].toLowerCase());
      return cat?.name || selectedCategories[0];
    }
    if (selectedCategories.length > 1) {
      return `${selectedCategories.length} categorias`;
    }
    if (searchTerm) {
      return `Busca: "${searchTerm}"`;
    }
    return 'Todos os Produtos';
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSkinTypes.length > 0 || 
    selectedBrands.length > 0 || minPrice !== undefined || maxPrice !== undefined || searchTerm;

  // Estado para controlar seções de filtro colapsáveis
  const [expandedFilters, setExpandedFilters] = useState<{
    categorias: boolean;
    marcas: boolean;
    pele: boolean;
    preco: boolean;
  }>({
    categorias: true,
    marcas: false,
    pele: false,
    preco: false
  });

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div className="page-content">
          {/* Sidebar Filters */}
          <div className="sidebar-filters">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="sidebar-title" style={{ margin: 0 }}>Filtros</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#be185d', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline'
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Categorias */}
            <div className="filter-collapsible">
              <button 
                className="filter-header" 
                onClick={() => toggleFilterSection('categorias')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #e7cfd7',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}
              >
                <span>Categoria {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
                <span style={{ fontSize: '12px', color: '#9a4c66' }}>{expandedFilters.categorias ? '▼' : '▶'}</span>
              </button>
              {expandedFilters.categorias && (
                <div className="filter-section" style={{ paddingTop: '12px' }}>
                  {categories.map((cat) => (
                    <label key={cat.id} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        className="filter-checkbox"
                        checked={selectedCategories.includes(cat.name.toLowerCase())}
                        onChange={() => toggleArrayFilter('categorias', selectedCategories, cat.name.toLowerCase())}
                      />
                      <span className="filter-label-text">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Marcas (dinâmico) */}
            {availableBrands.length > 0 && (
              <div className="filter-collapsible">
                <button 
                  className="filter-header" 
                  onClick={() => toggleFilterSection('marcas')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #e7cfd7',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}
                >
                  <span>Marca {selectedBrands.length > 0 && `(${selectedBrands.length})`}</span>
                  <span style={{ fontSize: '12px', color: '#9a4c66' }}>{expandedFilters.marcas ? '▼' : '▶'}</span>
                </button>
                {expandedFilters.marcas && (
                  <div className="filter-section" style={{ paddingTop: '12px' }}>
                    {availableBrands.map((brand) => (
                      <label key={brand} className="filter-checkbox-label">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedBrands.includes(brand.toLowerCase())}
                          onChange={() => toggleArrayFilter('marcas', selectedBrands, brand.toLowerCase())}
                        />
                        <span className="filter-label-text">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Tipo de Pele */}
            {availableSkinTypes.length > 0 && (
              <div className="filter-collapsible">
                <button 
                  className="filter-header" 
                  onClick={() => toggleFilterSection('pele')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #e7cfd7',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}
                >
                  <span>Tipo de Pele {selectedSkinTypes.length > 0 && `(${selectedSkinTypes.length})`}</span>
                  <span style={{ fontSize: '12px', color: '#9a4c66' }}>{expandedFilters.pele ? '▼' : '▶'}</span>
                </button>
                {expandedFilters.pele && (
                  <div className="filter-section" style={{ paddingTop: '12px' }}>
                    {availableSkinTypes.map((type) => (
                      <label key={type} className="filter-checkbox-label">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox"
                          checked={selectedSkinTypes.includes(type.toLowerCase())}
                          onChange={() => toggleArrayFilter('pele', selectedSkinTypes, type.toLowerCase())}
                        />
                        <span className="filter-label-text">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Faixa de Preço */}
            <div className="filter-collapsible">
              <button 
                className="filter-header" 
                onClick={() => toggleFilterSection('preco')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #e7cfd7',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}
              >
                <span>Faixa de Preço {(minPrice || maxPrice) && '(ativo)'}</span>
                <span style={{ fontSize: '12px', color: '#9a4c66' }}>{expandedFilters.preco ? '▼' : '▶'}</span>
              </button>
              {expandedFilters.preco && (
                <div className="filter-section" style={{ paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#6b7280' }}>Mínimo</label>
                      <input
                        type="number"
                        placeholder={`R$ ${priceRange.min}`}
                        value={minPrice || ''}
                        onChange={(e) => updateFilter('precoMin', e.target.value ? Number(e.target.value) : undefined)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #e7cfd7',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <span style={{ marginTop: '16px' }}>-</span>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#6b7280' }}>Máximo</label>
                      <input
                        type="number"
                        placeholder={`R$ ${priceRange.max}`}
                        value={maxPrice || ''}
                        onChange={(e) => updateFilter('precoMax', e.target.value ? Number(e.target.value) : undefined)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #e7cfd7',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9a4c66' }}>
                    Produtos de R$ {priceRange.min},00 até R$ {priceRange.max},00
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="breadcrumbs">
              <Link to="/" className="breadcrumb-link">Início</Link>
              <span className="breadcrumb-link">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </div>

            <h1 className="page-title">
              {getPageTitle()} ({displayProducts.length})
            </h1>

            {/* Ordenação */}
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${sortOrder === 'relevancia' ? 'active' : ''}`}
                  onClick={() => updateFilter('ordenar', 'relevancia')}
                >
                  Relevância
                </button>
                <button 
                  className={`tab ${sortOrder === 'menor' ? 'active' : ''}`}
                  onClick={() => updateFilter('ordenar', 'menor')}
                >
                  Menor Preço
                </button>
                <button 
                  className={`tab ${sortOrder === 'maior' ? 'active' : ''}`}
                  onClick={() => updateFilter('ordenar', 'maior')}
                >
                  Maior Preço
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
              {isLoading ? (
                <p>Carregando produtos...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : displayProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    Nenhum produto encontrado com os filtros selecionados
                  </p>
                  <button onClick={clearAllFilters} className="btn btn-primary">
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                displayProducts.map((item, i) => (
                  <Link to={`/produto/${item.id || i + 1}`} key={i} className="product-card">
                    <div
                      className="product-image"
                      style={{ backgroundImage: `url("${item.img}")` }}
                    />
                    <div className="product-info">
                      <p className="product-title">{item.title}</p>
                      <p className="product-price">{item.price}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
