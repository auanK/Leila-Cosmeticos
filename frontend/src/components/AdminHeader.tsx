import '../styles/pages/admin.css';

interface AdminHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  align?: 'space-between' | 'right';
}

const AdminHeader = ({
  showSearch = false,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  align = 'space-between'
}: AdminHeaderProps) => {
  const justifyContent = align === 'right' ? 'flex-end' : 'space-between';

  return (
    <header className="top-header" style={{ justifyContent }}>
      {showSearch && (
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={onSearchChange ? searchValue ?? '' : undefined}
            onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
          />
        </div>
      )}

      <div className="header-actions">
        <button className="btn btn-icon">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="user-profile">
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>Leila Souza</p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '10px' }}>Administradora</p>
          </div>
          <div
            className="avatar"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEqI2geNVfiSWkVsgwXgt9RqnLZmla7AMT_lq1UAamW-TSMCJESlmr-NsilHqBh_Jtcdn3OI6qFms_bU1B9lgt2RTtV1w8FDvUMexNIQOGQ25qZntL706QEodWilON9q63h3G3a-MmVeexk3lVyjufgQJU40wD0oia1Hysp6G0pLodM_sDnwOI1VgKvoyd0CxZlnR48Scsfm1IsTwvqAkrtdmoRYZmx12OYVCniEa_7krsU3euq3JKldsvgkyfC-4fEQiqO1uIm5Y')"
            }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
