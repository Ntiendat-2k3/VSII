// src/hooks/useUsers.js
// Custom hook - toàn bộ logic nghiệp vụ
//
// Thay đổi so với phiên bản mock:
// - Search giờ dùng Redux setSearchTerm (filter client-side từ cache allUsers)
// - Không cần debounce API call vì search là instant client-side
// - Bỏ useEffect debounce → thay bằng dispatch setSearchTerm trực tiếp

import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setSearchTerm,
  clearError,
  selectUsers,
  selectLoading,
  selectError,
  selectSearchTerm,
} from '../store/userSlice'

const useUsers = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const searchTerm = useSelector(selectSearchTerm)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Load toàn bộ users từ API lần đầu
  useEffect(() => {
    dispatch(fetchUsers(''))
  }, [dispatch])

  // Search: filter client-side tức thì (không cần gọi API lại)
  const handleSearch = useCallback(
    (value) => dispatch(setSearchTerm(value)),
    [dispatch]
  )

  // CREATE / UPDATE
  const handleSubmit = async (formData) => {
    let result
    if (editingUser) {
      result = await dispatch(updateUser({ id: editingUser.id, userData: formData }))
    } else {
      result = await dispatch(createUser(formData))
    }
    if (!result.error) {
      closeForm()
      return { success: true }
    }
    return { success: false, message: result.payload }
  }

  // DELETE
  const handleDelete = async () => {
    if (!deleteConfirm) return
    await dispatch(deleteUser(deleteConfirm))
    setDeleteConfirm(null)
  }

  const openCreateForm = () => {
    setEditingUser(null)
    setIsFormOpen(true)
    dispatch(clearError())
  }

  const openEditForm = (user) => {
    setEditingUser(user)
    setIsFormOpen(true)
    dispatch(clearError())
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingUser(null)
    dispatch(clearError())
  }

  return {
    users, loading, error, searchTerm,
    isFormOpen, editingUser, deleteConfirm,
    handleSearch, handleSubmit, handleDelete,
    openCreateForm, openEditForm, closeForm, setDeleteConfirm,
  }
}

export default useUsers
