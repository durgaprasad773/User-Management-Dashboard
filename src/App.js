import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "./services/api";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";

const App = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      alert("Failed to fetch users.");
    }
  };

  const handleAddUser = async (user) => {
    try {
      const response = await addUser(user);
      setUsers([...users, { ...user, id: response.data.id }]);
    } catch (error) {
      alert("Failed to add user.");
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  const startEditing = (user) => {
    setIsEditing(true);
    setUserToEdit(user);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setUserToEdit(null);
  };

  return (
    <div>
      <h1>User Management</h1>
      {isEditing ? (
        <UserForm onSubmit={handleEditUser} userToEdit={userToEdit} onCancel={cancelEditing} />
      ) : (
        <UserForm onSubmit={handleAddUser} />
      )}
      <UserTable users={users} onEdit={startEditing} onDelete={handleDeleteUser} />
    </div>
  );
};

export default App;
