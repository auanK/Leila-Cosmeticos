import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { PencilIcon } from '../components/Icons';

const addresses = [
  { 
    title: 'Casa', 
    addr: 'Rua das Flores, 123, Apto 456, Bairro Jardim, São Paulo - SP, 01234-567', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApw__fthgKGxZrT_ed35Ssn-GiPAxDo3sO_pBYUkZ_upE_jqG2n1y8voETiCI1ID13XHjwBKICAGAFLNFccK1xCgb6subMm6tAGUpMOPKGN5NC-WOAk3C93eUwjOJafvlifCxdgaBksn1UuFfabUjNWEFupcA7rapCwbavQFDfNlQGjAcUn4tlUZMXm1TDa0PD47vf-SzYKgs8nukO4pjYdtDYCv8XMnsUaTkKMXwNSUPqEy1KBEKglsRKyRQ7VaQwGGQj1ydLAiTQ' 
  },
  { 
    title: 'Trabalho', 
    addr: 'Avenida Paulista, 789, Andar 10, Bairro Centro, São Paulo - SP, 01310-100', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA03lfiol0XMnGSdn94cKQmYXLksobVDHTIruPhbwpf-qJ_rHClq9aYw4HPYc_AhETXKq2RIVLl0suLu7xQfdexUrklwh_lMy8HK1laIEmt1jfktSRNuBS1mmnepKAPVsE0Xx8DvZrq-4Bm8Qs-F03xViatAOE4-x1Z6-lW0le0lhca2hwi7QVAehoEkjuxSW6iOVYDr7YNwXp0oCwep2-hLAayyNZ52V5xYnvTog6L2QXJwuktQSt48RFisfGli4VYmJXEf_WjviQL' 
  },
  { 
    title: 'Casa de Praia', 
    addr: 'Rua da Praia, 101, Casa 2, Bairro Beira Mar, Santos - SP, 11010-000', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHKTa8TGumT_bkF7ywPBIwdQwDfZ_goVKPQcYNt8Ox_jHvhlhGVkElGt08zOQLWl6tk9NZQsVmEH1USuw4E0YxHZQeyxYYjRFOgNTmnx6t3XKiA4AQ1ae5dg2C3_BaLZPWGf6T8PVq-LMZR7rBKPnOd9vnWPlRgxcq7DJWaA4W-3jOR-Qhe7Csifw6ErEIs_vWsOvQ_J6a2TMME5p0vWnzw_-50djmvqQ264BpQhdcTmGx34twwJkqHUqxKHLbLayGxDvZa9_h-AGL' 
  }
];

const Addresses = () => {
  return (
    <div className="page-container">
      <div className="layout-container">
        <Header />
        <div className="page-content">
          <Sidebar />
          <div className="main-content">
            <div className="address-header">
              <h1 className="page-title" style={{ padding: 0 }}>Meus Endereços</h1>
              <button className="btn btn-secondary order-btn">
                Adicionar Endereço
              </button>
            </div>

            {addresses.map((item, i) => (
              <div key={i} className="address-card">
                <div className="address-content">
                  <div className="address-info">
                    <div>
                      <p className="address-title">{item.title}</p>
                      <p className="address-text">{item.addr}</p>
                    </div>
                    <button className="btn btn-secondary address-edit-btn">
                      <span>Editar</span>
                      <PencilIcon />
                    </button>
                  </div>
                  <div
                    className="address-map"
                    style={{ backgroundImage: `url("${item.img}")` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
