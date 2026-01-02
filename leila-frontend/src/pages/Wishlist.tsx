import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const wishlistProducts = [
  { title: "Batom Matte de Longa Duração", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb7m6h-DV66U4Lfapw195KiqAwBI4o_ofM9WBDIB91tE1dciePsr-MkB4xle-hst414gxLdFPMRK6ZIMw0ZgOXHTanKfVW4Dq3nIWtBzlTFKQgW99fZom8XbDy32WMSMhMeGpq7TAxDMRmdq5U6Ahw0_UOS_NU9eH2AgiWCYfrN5CfU-prht2tQ4woCCWaT3DG3lUGy3zs1-3Zr00gR199_qSQ6hpxjSufnxtuDbuFY8aOEMSqb5l5nQ4kpeZbyN_Lj8k65XoIiu_C" },
  { title: "Paleta de Sombras Neutras", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIyfJFdt2B8TBgqU0Q6Gf_6lTg2AHQBVYBbQ-whRzDPso_dedkNqVriYrcEBgiBCTXm9Conx6AO8lPQ2fs3ruIMBHBL6CRuD0oKR-kAuc9oT7K0OhDG8FWd0jzK_pbVmXdzpCu-rPrHp3EAsSanhkPmA8WlhCZtQgDUmaYLOQsPNlrPh-Qnv2Vzk2Pwpox9-bw2MS3XbijlOHPp4iUbtqa0M6RkLcupTKkkNYonR1Jy7bkAThFs5qsv8e1NqPo4rQA4-NyoIK5jfLt" },
  { title: "Máscara de Cílios Volume Extremo", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqwPeJsqI8QnfJ3ChDV6svE1IWuHE9x_3qPa5kP1q7otju7KGASaMX8R3XCNBrAS2btc2nadCwEZHhIfDKPYH6B1gbxRnesNavM-r85FA3j5KQfXnmkkz5OggEquofQ-SkDwwISOlbBhZZb9avD1ObCrxOluHg3ErS7j25upGh3XK5Xz9lhccCdfQhtIVco-nD08Q1KXeK54G2xdhyIRqwUft17ZmVT4hR8g_H9u0vVDQvrN67p3hVYBImGZ7IiB0Kb2ks6QCqs6Km" },
  { title: "Base Líquida de Alta Cobertura", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6I76ZClV0-Op18OCSDVtVnn394afN6e4-VsvsOjuoDiQc5uhJm1EKmmXHYreIY5a7GS1xCx16o_xtPkXEdUbGqFnjS-K4KDiD2CLV0INBR03MDLTCQWerPZAprGtSmS3ftXFLUSf9SqgMQ4iJqYrJjUZBDHKcGTcrNDq_uraKPbVyLfaS2HdNN7OQimkpikfykyevSkXiVPDfaOoLV9-XNRGu3wRUPveAsA1VcDjiFukpaAJhjrPj-gzl6NWqVrQfA4oD3ktmlJ9" },
  { title: "Pincel de Maquiagem para Contorno", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1xmEmwEc8n7qEDQScocPsSiMAkwlC0oM9jZbHTamF7p0ROgQWNZ1bd5TeqGX_iZqQqwdmVgkDICdmz5wgaFccIGH0Cb31xFOrS6dBwr7jEYJ7hI0C__D5bblHl2tR4f1w2n28RiwnpDORUqnHu1IXlSX3pHGEs1JIehKWrafXmc19_7YVURe9onM0wWdKlrq3pBM6qT6XYM29-1PBB19hw31E1afi6WCcnOt8zg_8r9zNBFYeyePVZXqiUZm-RbWPnoToTqAIzbzg" },
  { title: "Delineador em Gel À Prova d'Água", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlsv2PhXN-IrTB2hkhxNWAhz7jPFfXPml_mzvczU6DcYKB8JMH7LVGDAmSmrSg6ery5zqwunMwLPRJfv97xtpiK5efBetI3RX2b8ok6oODDjdVKyDV83SUvq5_FzXB4oiZhNBxRXqZHJEv_ID4FeCLkm4BuZmgw4wd7J4-hyifdiQcFLSIaDoMjT0a8uBjbhtkYH4BTLtzr8NURVrd8VPgbaHZtTKNTW96PUAPCHkJ_Rm4GXFfdxbR8xHi3KNgO5fkpB1KPn_WWvo2" }
];

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <h1 className="page-title">Lista de Desejos</h1>

            {/* Empty State */}
            <div className="wishlist-empty">
              <div
                className="wishlist-empty-image"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpjUuuPsJTq2PQfLe2wP-2ZvctEfdgYQ7jlSL5hTC349tZxKCqzQhF6ZfNQ2kAWEuueOrlW_gyMlyuTWusDqh5IyUFX2xJlbGGIgccBKPA4pWiEjKJINGtyPU3nf28c1kU-aKD8CySxs8BTQofFq0rnVY1IQFPAClmgDPS4s-bm0M4P62PrPHeRDvoMZ8U-71_JoDGX7rEvKdRXLF_Zg9FTckY1rxj3Rm_JUvDgNY2Le_5Z3AGxILjR7fJokvDXrZy6Sm5rDuEBcOR")'
                }}
              />
              <div>
                <p className="wishlist-empty-title">Sua lista de desejos está vazia</p>
                <p className="wishlist-empty-text">
                  Adicione produtos para acompanhar seus favoritos e comprá-los mais tarde.
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/produtos')}
              >
                Continuar comprando
              </button>
            </div>

            {/* Grid of Items */}
            <div className="product-grid">
              {wishlistProducts.map((prod, i) => (
                <div key={i} className="product-card" onClick={() => navigate('/produto')}>
                  <div
                    className="product-image"
                    style={{ backgroundImage: `url("${prod.img}")` }}
                  />
                  <p className="product-title">{prod.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
