// src/components/UserForm.jsx
// Form tạo/sửa user với React Hook Form
// Đã thêm field: phone, company (có từ JSONPlaceholder)

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const rules = {
  name: {
    required: "Họ tên không được để trống",
    minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
    maxLength: { value: 50, message: "Tối đa 50 ký tự" },
  },
  email: {
    required: "Email không được để trống",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email không hợp lệ",
    },
  },
  role: { required: "Vui lòng chọn vai trò" },
  phone: {
    pattern: {
      value: /^[0-9\-\+\(\)\s\.]+$/,
      message: "Số điện thoại không hợp lệ",
    },
  },
};

const UserForm = ({ editingUser, onSubmit, onCancel, loading }) => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      skills: "",
      role: "Viewer",
      status: "active",
    },
  });

  useEffect(() => {
    // reset đóng vai trò đặt cột mốc mới => rỗng -> reset, có data -> cập nhật
    // Nếu vế trái có giá trị (Truthful), nó lấy vế trái. Nếu vế trái là null, undefined (Falsy), nó lấy vế phải.
    // Khi bạn bấm nút "Thêm", biến editingUser đang mang giá trị là null.
    // Khi bạn bấm nút "Sửa", biến editingUser mang dữ liệu
    reset(
      editingUser || {
        name: "",
        email: "",
        phone: "",
        company: "",
        skills: "",
        role: "Viewer",
        status: "active",
      },
    );
    setServerError("");
  }, [editingUser, reset]);

  const onFormSubmit = async (data) => {
    setServerError("");
    const result = await onSubmit(data);
    if (!result?.success && result?.message) setServerError(result.message);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingUser ? "✏️ Chỉnh sửa User" : "➕ Thêm User mới"}</h2>
          <button className="btn-icon" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit(onFormSubmit)}>
          {serverError && (
            <div className="alert alert-error">⚠️ {serverError}</div>
          )}

          {/* Họ tên */}
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder="Nguyễn Văn A"
              {...register("name", rules.name)}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="example@gmail.com"
              {...register("email", rules.email)}
            />
            {errors.email && (
              <span className="error-msg">{errors.email.message}</span>
            )}
          </div>

          {/* Phone + Company */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                className={`form-input ${errors.phone ? "input-error" : ""}`}
                placeholder="0912 345 678"
                {...register("phone", rules.phone)}
              />
              {errors.phone && (
                <span className="error-msg">{errors.phone.message}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Công ty</label>
              <input
                className="form-input"
                placeholder="Tên công ty"
                {...register("company")}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">Kỹ năng (cách nhau bằng dấu phẩy)</label>
            <input
              className="form-input"
              placeholder="VD: React, Node.js, UI/UX"
              {...register("skills")}
            />
          </div>

          {/* Role + Status */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Vai trò *</label>
              <select
                className={`form-input ${errors.role ? "input-error" : ""}`}
                {...register("role", rules.role)}
              >
                <option value="">-- Chọn --</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              {errors.role && (
                <span className="error-msg">{errors.role.message}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-input" {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading
                ? "⏳ Đang lưu..."
                : editingUser
                  ? "Cập nhật"
                  : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

// curl "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCC-DYwOxk-Dd0zP_0-12oigTJBlUbWmiw"
