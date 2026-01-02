import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { StarIcon } from '../components/Icons';

const Reviews = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/pedidos');
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#fbf8f9' }}>
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <div className="review-container">
              {/* Rating Header */}
              <div className="review-header">
                <div className="review-score-container">
                  <p className="rating-score">0</p>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="rating-count">0 avaliações</p>
                </div>

                {/* Bars Mockup */}
                <div className="review-bars">
                  {[5, 4, 3, 2, 1].map(num => (
                    <React.Fragment key={num}>
                      <p className="review-bar-label">{num}</p>
                      <div className="review-bar-container">
                        <div className="review-bar-fill" style={{ width: '0%' }} />
                      </div>
                      <p className="review-bar-percent">0%</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: '100%' }}>
                <textarea
                  placeholder="Conte sua experiência..."
                  className="review-textarea"
                />
              </div>

              <div className="upload-area">
                <div>
                  <p className="upload-title">Adicionar fotos</p>
                  <p className="upload-subtitle">Arraste e solte ou clique para adicionar fotos</p>
                </div>
                <button className="btn btn-secondary">
                  Adicionar fotos
                </button>
              </div>

              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkbox-text">Recomendo este produto</span>
              </label>

              <div className="review-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
