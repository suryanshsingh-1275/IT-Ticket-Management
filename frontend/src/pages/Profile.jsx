import { useState } from 'react';
import api, { errorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, setUser } = useAuth();

  // Profile form state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [department, setDepartment] = useState(user.department || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileBusy(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('department', department);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await api.put('/users/profile', formData);
      setUser(res.data.user);
      setAvatarFile(null);
      setProfileSuccess('Profile saved');
    } catch (err) {
      setProfileError(errorMessage(err));
    } finally {
      setProfileBusy(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordBusy(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSuccess('Password updated');
    } catch (err) {
      setPasswordError(errorMessage(err));
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="center-mx" style={{ maxWidth: 640 }}>
      <h3 className="mb-3">Edit profile</h3>

      <form className="panel mb-4" style={{ padding: 24 }} onSubmit={handleProfileSubmit}>
        {profileError && <div className="alert alert-danger">{profileError}</div>}
        {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

        <div className="avatar-picker">
          {avatarPreview ? (
            <img src={avatarPreview} alt="" className="avatar" style={{ width: 72, height: 72 }} />
          ) : (
            <Avatar user={user} size={72} />
          )}
          <div>
            <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Profile picture
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="field-hint">JPG, PNG, WEBP or GIF, up to 2 MB.</div>
          </div>
        </div>

        <div className="field">
          <label>Full name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label>Email</label>
          <input className="input" value={user.email} disabled />
        </div>

        <div className="form-row">
          <div className="field">
            <label>Department</label>
            <input className="input" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" disabled={profileBusy}>
          {profileBusy ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <form className="panel" style={{ padding: 24 }} onSubmit={handlePasswordSubmit}>
        <h5 className="mb-3">Change password</h5>
        {passwordError && <div className="alert alert-danger">{passwordError}</div>}
        {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

        <div className="form-row">
          <div className="field">
            <label>Current password</label>
            <input
              type="password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>New password</label>
            <input
              type="password"
              className="input"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button className="btn btn-outline-brand" disabled={passwordBusy}>
          {passwordBusy ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
