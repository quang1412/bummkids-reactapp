import React, { useState, useEffect } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { useAuth } from '../authContext';


// Cấu hình Firebase của bạn - THAY ĐỔI NHỮNG GIÁ TRỊ NÀY
const firebaseConfig = {
  apiKey: "AIzaSyBzbEc4qvRzHXLNmvYmyMZaUNDM2SU26KU",
  authDomain: "my-project-1514260708230.firebaseapp.com",
  databaseURL: "https://my-project-1514260708230.firebaseio.com",
  projectId: "my-project-1514260708230",
  storageBucket: "my-project-1514260708230.firebasestorage.app",
  messagingSenderId: "392370505854",
  appId: "1:392370505854:web:4d21effaadecb67688b02f"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Logout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { logout, currentUser } = useAuth(); // Lấy data từ context
  

  // Hàm xóa cookie
  const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Hàm lấy cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Nếu không có user và không có cookie, chuyển về login
      if (!currentUser && !getCookie('userToken')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  // Hàm đăng xuất
  const handleLogout = async () => {
    setLoggingOut(true);
    setError('');
    setSuccess('');

    try {
      // Đăng xuất khỏi Firebase
      await signOut(auth);
      logout()
      
      // Xóa cookie
      deleteCookie('userToken');
      
      setSuccess('Đăng xuất thành công! Đang chuyển hướng...');
      
      // Chuyển về trang login sau 1.5 giây
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
    } catch (err) {
      setError('Lỗi khi đăng xuất: ' + err.message);
      console.error(err);
      setLoggingOut(false);
    }
  };

  // Hủy đăng xuất
  const handleCancel = () => {
    window.location.href = '/';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  // Nếu không có user
  if (!user && !getCookie('userToken')) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body text-center p-4">
            <div className="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <h5 className="mb-3">Bạn chưa đăng nhập</h5>
            <p className="text-muted">Đang chuyển hướng đến trang đăng nhập...</p>
            <div className="spinner-border spinner-border-sm text-primary mt-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="text-danger" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </div>

          <h3 className="text-center mb-3 fw-bold">Đăng xuất</h3>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          <div className="mb-4">
            {user ? (
              <div className="bg-light p-3 rounded">
                <p className="mb-2 text-muted small">Bạn đang đăng nhập với:</p>
                <p className="mb-1 fw-semibold">{user.phoneNumber || 'Người dùng'}</p>
                <p className="mb-0 text-muted small">UID: {user.uid}</p>
              </div>
            ) : (
              <div className="bg-light p-3 rounded text-center">
                <p className="mb-0 text-muted">Phiên đăng nhập đang được lưu trong cookie</p>
              </div>
            )}
          </div>

          <p className="text-center text-muted mb-4">
            Bạn có chắc chắn muốn đăng xuất không?
          </p>

          <button 
            onClick={handleLogout}
            className="btn btn-danger btn-lg w-100 mb-2"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang đăng xuất...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                Đăng xuất
              </>
            )}
          </button>

          <button 
            onClick={handleCancel}
            className="btn btn-outline-secondary btn-lg w-100"
            disabled={loggingOut}
          >
            ← Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}