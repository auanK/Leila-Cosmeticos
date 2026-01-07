import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { StarIcon } from '../components/Icons';

const relatedProducts = [
  { title: "Sérum Facial", price: "R$ 59,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBgHOuAvdAhTT5DFonTzTOfqcwx3jlFeSqYoHdkpB3tWtTIzeH9sHGJF_T6YjInc1C4nKxwlj4ow72EfveX1rAuhVV_kbaM_VbMEwIs48f9vwRcRbwmgEHK3XKVJHrMqncjLS_qTZvjWgK_qhGRc91NeEwDj4WRK9Wak1zMHV6qlQklshyc7wlXzLB39ddIgQtFi4qIA_nNg8oezxU2DW9YzmUQCbcCiMd3DMI8shL0FQDXLYBLafN4AqgAsxS0I5eePJUR9siQ1W8" },
  { title: "Paleta de Sombras", price: "R$ 79,90", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyxfbpYdhhY3WvMUP-ImXBA3kCl2Bif_WEO1VBjmpImGZTwuxTXsLvUk6v_wPtN0pJFwIJw1XMJid7O-3QjWvBNtAesYuBQareoxkHw2SLHssoua5ZMAG8RXT_1xSGYFPUEMqpK8cCFzB7mRo1ztfngNT2uz4G92LQglkXd1NDvY024te_XRJ87SuYS_rWIW6zPymy9EIOiWetoNG_ozls8KNVHKHspi1z0VMomGr_Dpf_l_w4TUGQS5RGGdfZtE0LmBDzuth2hkj_" },
];

const colorOptions = ["rgb(242, 215, 238)", "rgb(230, 184, 175)", "rgb(218, 188, 191)", "rgb(194, 163, 163)"];

const ProductDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div style={{ padding: '20px 16px', display: 'flex', flex: 1, justifyContent: 'center' }}>
          <div className="main-content">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <Link to="/" className="breadcrumb-link">Maquiagem</Link>
              <span className="breadcrumb-link">/</span>
              <span className="breadcrumb-current">Rosto</span>
            </div>

            <h2 className="section-title" style={{ fontSize: '22px' }}>Base Líquida de Alta Cobertura</h2>
            <p className="product-brand">Marca: Bella</p>

            {/* Rating */}
            <div className="rating-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p className="rating-score">4.5</p>
                <div className="rating-stars">
                  {[1, 2, 3, 4].map(s => (
                    <StarIcon key={s} filled />
                  ))}
                  <StarIcon />
                </div>
                <p className="rating-count">125 avaliações</p>
              </div>
            </div>

            {/* Color Selection */}
            <h3 className="sidebar-title">Selecione a Cor</h3>
            <div className="color-swatches">
              {colorOptions.map((color, i) => (
                <label
                  key={i}
                  className={`color-swatch ${i === 0 ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                >
                  <input type="radio" name="product-color" defaultChecked={i === 0} />
                </label>
              ))}
            </div>

            <h3 className="sidebar-title">Preço</h3>
            <p className="product-brand">R$ 89,90</p>
            <p className="installment-info">Ou 3x de R$ 29,97 sem juros</p>

            <div className="action-buttons">
              <button className="btn btn-secondary btn-block">
                Adicionar à Lista de Desejos
              </button>
              <button
                className="btn btn-primary btn-block"
                onClick={() => navigate('/carrinho')}
              >
                Adicionar ao Carrinho
              </button>
            </div>

            <p className="product-description">
              A Base Líquida de Alta Cobertura da Bella oferece um acabamento impecável e duradouro. 
              Sua fórmula leve e confortável proporciona uma cobertura total, disfarçando imperfeições 
              e uniformizando o tom da pele.
            </p>

            {/* Related Products */}
            <h2 className="section-title">Complete Sua Rotina</h2>
            <div className="related-products">
              {relatedProducts.map((item, i) => (
                <div
                  key={i}
                  className="related-product-card"
                  onClick={() => navigate('/produto')}
                >
                  <div
                    className="product-image"
                    style={{ backgroundImage: `url("${item.img}")` }}
                  />
                  <div className="product-info">
                    <p className="product-title">{item.title}</p>
                    <p className="product-price">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
