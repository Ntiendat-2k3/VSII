// src/pages/UserPage.jsx
// Page component: kết nối hook (logic) với components (UI)
// Không chứa logic nghiệp vụ - chỉ "dây nối" giữa các tầng

import useUsers from '../hooks/useUsers'
import SearchBar from '../components/SearchBar'
import UserList from '../components/UserList'
import UserForm from '../components/UserForm'

// Stats cards nhỏ phía trên bảng
const StatsCards = ({ users }) => {
  const stats = [
    { label: 'Tổng Users', value: users.length, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Active', value: users.filter((u) => u.status === 'active').length, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Admin', value: users.filter((u) => u.role === 'Admin').length, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Editor', value: users.filter((u) => u.role === 'Editor').length, color: '#2563eb', bg: '#eff6ff' },
  ]

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card" style={{ background: s.bg }}>
          <p className="stat-label" style={{ color: s.color }}>{s.label}</p>
          <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

const UserPage = () => {
  const {
    users, loading, error, searchTerm,
    isFormOpen, editingUser, deleteConfirm,
    handleSearch, handleSubmit, handleDelete,
    openCreateForm, openEditForm, closeForm, setDeleteConfirm,
  } = useUsers()

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý nhân viên</h1>
          <p className="page-subtitle">
            {loading ? 'Đang tải...' : `${users.length} nhân viên được tìm thấy`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateForm}>
          + Thêm User
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Stats */}
      <StatsCards users={users} />

      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Tìm theo tên, email, vai trò..."
      />

      {/* Table */}
      <UserList
        users={users}
        loading={loading}
        onEdit={openEditForm}
        onDelete={(id) => setDeleteConfirm(id)}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <UserForm
          editingUser={editingUser}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          loading={loading}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="delete-modal-body">
              <div className="delete-icon">🗑️</div>
              <h3>Xác nhận xóa</h3>
              <p>
                Bạn có chắc muốn xóa user này?<br />
                Hành động này không thể hoàn tác.
              </p>
              <div className="delete-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPage
