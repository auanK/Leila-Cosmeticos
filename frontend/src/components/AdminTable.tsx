import '../styles/pages/admin.css';

interface AdminTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  title: string;
  data: any[];
  filteredData: any[];
  columns: AdminTableColumn[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyFilteredMessage?: string;
  countLabel?: string;
  onAdd?: () => void;
  addButtonLabel?: string;
  addButtonIcon?: string;
  showSortButton?: boolean;
  actions?: (row: any) => React.ReactNode;
  className?: string;
}

const AdminTable = ({
  title,
  data,
  filteredData,
  columns,
  isLoading,
  emptyMessage = 'Nenhum registro cadastrado',
  emptyFilteredMessage = 'Nenhum registro encontrado',
  countLabel = 'Registros',
  onAdd,
  addButtonLabel = 'Adicionar',
  addButtonIcon = 'add_circle',
  showSortButton = true,
  actions,
  className = ''
}: AdminTableProps) => {
  return (
    <div className={`table-container ${className}`}>
      <div className="table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
          <span className="tag" style={{ background: 'var(--bg-body)', color: 'var(--text-muted)' }}>
            {filteredData.length} {countLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              <span className="material-symbols-outlined">{addButtonIcon}</span>
              {addButtonLabel}
            </button>
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                {col.label}
              </th>
            ))}
            {actions && <th style={{ textAlign: 'right' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '40px' }}>
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {emptyFilteredMessage}
              </td>
            </tr>
          ) : (
            filteredData.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td style={{ textAlign: 'right' }}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div
        className="nav-footer"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}
      >
        <p>
          Exibindo {filteredData.length} de {data.length} {countLabel.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

export default AdminTable;
