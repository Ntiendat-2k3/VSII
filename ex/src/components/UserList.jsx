// src/components/UserList.jsx
// Hiển thị danh sách users - đã thêm cột Phone và Company từ JSONPlaceholder

const ROLE_BADGE = {
  Admin:  'badge-red',
  Editor: 'badge-blue',
  Viewer: 'badge-gray',
}

const avatarStyle = (user) => ({
  background: `hsl(${user.id * 47}, 55%, 82%)`,
  color:      `hsl(${user.id * 47}, 45%, 32%)`,
})

const UserList = ({ users, loading, onEdit, onDelete }) => {
  if (loading && users.length === 0) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p>Đang tải dữ liệu từ JSONPlaceholder...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <p>Không tìm thấy user nào</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Công ty</th>
            <th>Kỹ năng</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="text-muted">{index + 1}</td>
              <td>
                <div className="user-name">
                  <div className="avatar" style={avatarStyle(user)}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div>{user.name}</div>
                    {user.phone && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        📞 {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-muted">{user.email}</td>
              <td className="text-muted" style={{ fontSize: '13px' }}>
                {user.company || '—'}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {user.skills ? (
                    user.skills.split(',').map((skill, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted" style={{ fontSize: '13px' }}>—</span>
                  )}
                </div>
              </td>
              <td>
                <span className={`badge ${ROLE_BADGE[user.role] || 'badge-gray'}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`status-dot ${user.status}`}>
                  {user.status === 'active' ? '● Active' : '○ Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => onEdit(user)}>
                    ✏️ Sửa
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(user.id)}>
                    🗑️ Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
