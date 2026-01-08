import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const fallbackProducts = [
  { id: 1, title: "Batom Matte Veludo - Rosa", price: "R$29,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiY7j4pzUG8Eu7FipJ-YlDfxcs8Ljra0OUjXru4tzVEqElQSm4qsrSbzj30cmJjyCaNmFzKyJ-YqHTT4iP99IxvEwOpnVxlEZgXsauxNlyzrReBHR4yDqxOymwG4U_exjgvp0wKJ0bpG4BbMnF707AMNMNZCMuWlbj8ZEdbHB0S6ZBgSVhKsb4hYZdfSsnj8swuoSGojQfnGmPAYWgWmnbD1cw23Pobd4m-a5SlFnEx0H7a-7P36-7bo1GMwojF9qCfEA1rT64xsDD" },
  { id: 2, title: "Batom Líquido Longa Duração - Vermelho", price: "R$34,50", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf64BpDhATOPgsuPHqKDpXCoP9k_HQgbWNAQ9F5pwTLYTm8mi640P9TDyRXL8utHJWthPwl2tH7EDCME6wm4gv48arh8dxqKL6UVxk7kEQBsLBngtSA6A-KmOe8QsT_dqUsIlcq7w5v_LwAzNxzUZ-TS6_KOBwDi0RCrRLWySkU-k4101kw6UY7GFHJq134MC1B6jmdElOMFRAbggW1wityken8gCnzbTSoNwyn18OXhuS2-iY6zREQS_YO3vp4BXqepU2LsdvgvPZ" },
  { id: 3, title: "Batom Cremoso Hidratante - Nude", price: "R$25,00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2n6yBuxEQCei0rpmXJ49db9CSxxhpff-gLH8p3q8IRlXXC0c3cagWfeZhs7Xtbc3L05LG0Q_rKWeoLMl7U5m2jEn_-APFsKzCH-Rx2qPWn-WKfCsGtLDUzoodGkIgDy5PVbveNgHwxiDNPohf4VTXCuXC7gO6Whx6aUW-vrtH1lurmHcIEsEYC6_JJlEku9dZNEmrmdFBOtmiKLKvi3jurgIJgG4WhRZ3Nyff-71YCFMzv0KdRQDmdDU5NyT6S1t4wGLomLHD9_Cv" },
  { id: 4, title: "Batom Metálico Brilhante - Bronze", price: "R$39,99", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-bJDbcl2aeC2VkAqNDmvXik6f0GPUkl2GtpJVXBlnHahwmyuIk2IkKB_aJOiEvUmJ45UBIRLGq6gOcdnBWXfIP3LLQM42HBPBtgU2BZxhQpXf8g7YxEyqUwwhC1qz-XYkjfNkaS6NLhhIp2qDU7hYWnyjupOPnHda_Rx0v5sfY9WNms4jEL34wENTJptDG1yN1UU5035heC1W6BJuCqNn0FFC5bVoGkXEN9CzCDstop3Wlhyi-wSCCGR6i16hXKyQSbYQ9ZYuv0EV" },
  { id: 5, title: "Batom Vegano Natural - Coral", price: "R$27,80", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXK9rScJWeVfo68_A8WKzUPn560WHOZ0xzaYzGwWIme0-G_DB0QsW3D9MKddARz7GLfgFglVZkdKkChy6j6QiLgALKCioZ_tsFxEBsvYA27iDOGeNyUBWz7udPtDp7y3rxDM2nn9qbP8GnMGRqPEsSDDuj_zC_IYyfvYUUK634fXneH5A8iwCWctfazgZ2ap0xTyXjp90fAkSYXMKBC_XPfbZyg3hP75iHRbXL3aCDtQ4ywXkKZPecQuBytZDzMOo9niJb5FBunxoU" },
  { id: 6, title: "Batom Duo Lápis e Gloss - Pink", price: "R$32,00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiN6DPRhU709zFrDOSxRoF1rjr3ZhM_JFPevikky2YvbArmaeJ6tPbZHdd9MaKTfDsIGaVebgiuvDe2RNW6hV01qoBM3Gb0noExFytbN8cjgBVA_3_IcTrSwo3Da-2sLgc-MfSNGob5Lfz35mARJm31_67OJze2_-s1Vgu2vq41KntAlo9K4IVKPxPgsSWIwucGHT3hY68cV6X4SnOpxNsxCpSIIbJQZJeWpC7mHUMeosVftBQ04sFkd0UEzbAnhpvyeqDDxRhvsgA" }
];

const brands = ["Cosméticos Aurora", "Beleza Radiante", "Glamour Essencial", "Toque de Luxo", "Pele de Seda"];
const skinTypes = ["Seca", "Oleosa", "Mista"];
const colors = ["rgb(255, 192, 203)", "rgb(255, 105, 180)", "rgb(199, 21, 133)", "rgb(219, 112, 147)", "rgb(255, 182, 193)"];

const formatPrice = (priceFrom?: number | string, priceTo?: number | string) => {
  const pFrom = Number(priceFrom);
  const pTo = Number(priceTo);
  const price = pTo || pFrom || 0;
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

const ProductListing = () => {
  const { products, isLoading, error } = useProducts();
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('busca') || '';
  const categoryFilter = searchParams.get('categoria') || '';

  // Mapear produtos para o formato de exibição
  const mappedProducts: { id: number; title: string; price: string; img: string; categoryId?: number }[] = products.length > 0 
    ? products.map(p => ({
        id: p.id,
        title: p.name,
        price: formatPrice(p.price_from, p.price_to),
        img: p.main_image || fallbackProducts[0].img,
        categoryId: p.category_id
      }))
    : fallbackProducts.map(p => ({ ...p, categoryId: undefined }));

  // Filtrar produtos com base na busca ou categoria
  const displayProducts = (() => {
    let filtered = [...mappedProducts];

    // Filtro por categoria (via URL param)
    if (categoryFilter) {
      const matchingCategory = categories.find(c => 
        c.name.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (matchingCategory) {
        filtered = filtered.filter(p => p.categoryId === matchingCategory.id);
      }
    }

    // Filtro por busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(searchLower);
        
        // Verificar se a busca corresponde a alguma categoria
        const matchingCategory = categories.find(c => 
          c.name.toLowerCase().includes(searchLower)
        );
        const categoryMatch = matchingCategory && p.categoryId === matchingCategory.id;
        
        return titleMatch || categoryMatch;
      });
    }

    return filtered;
  })();

  // Obter nome da categoria para exibição
  const getCategoryName = () => {
    if (categoryFilter) {
      const cat = categories.find(c => c.name.toLowerCase() === categoryFilter.toLowerCase());
      return cat?.name || categoryFilter;
    }
    return null;
  };

  const categoryName = getCategoryName();

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div className="page-content">
          {/* Sidebar Filters */}
          <div className="sidebar-filters">
            <h3 className="sidebar-title">Filtros</h3>
            <h3 className="sidebar-title">Marca</h3>
            <div className="filter-section">
              {brands.map((brand, i) => (
                <label key={i} className="filter-checkbox-label">
                  <input type="checkbox" className="filter-checkbox" />
                  <span className="filter-label-text">{brand}</span>
                </label>
              ))}
            </div>
            
            <h3 className="sidebar-title">Tipo de Pele</h3>
            <div className="filter-section">
              {skinTypes.map((type, i) => (
                <label key={i} className="filter-checkbox-label">
                  <input type="checkbox" className="filter-checkbox" />
                  <span className="filter-label-text">{type}</span>
                </label>
              ))}
            </div>

            <h3 className="sidebar-title">Cor</h3>
            <div className="color-swatches">
              {colors.map((color, i) => (
                <label
                  key={i}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                >
                  <input type="radio" name="color-filter" />
                </label>
              ))}
            </div>

            <h3 className="sidebar-title">Preço</h3>
            <div className="price-range">
              <p className="price-range-label">Faixa de Preço</p>
              <div className="price-range-bar">
                <div className="price-range-fill" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="breadcrumbs">
              <Link to="/" className="breadcrumb-link">Início</Link>
              <span className="breadcrumb-link">/</span>
              <span className="breadcrumb-current">
                {categoryName 
                  ? categoryName 
                  : searchTerm 
                    ? `Busca: "${searchTerm}"` 
                    : 'Todos os Produtos'
                }
              </span>
            </div>

            <h1 className="page-title">
              {categoryName
                ? `${categoryName} (${displayProducts.length})`
                : searchTerm 
                  ? `Resultados para "${searchTerm}" (${displayProducts.length})` 
                : 'Todos os Produtos'
              }
            </h1>

            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <button className="tab active">Relevância</button>
                <button className="tab">Preço</button>
                <button className="tab">Mais Vendidos</button>
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
                    Nenhum produto encontrado para "{searchTerm}"
                  </p>
                  <Link to="/produtos" className="btn btn-primary">
                    Ver Todos os Produtos
                  </Link>
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
