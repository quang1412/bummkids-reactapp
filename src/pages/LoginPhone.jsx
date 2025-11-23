import React, { useState, useEffect } from 'react';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  // getAuth, 
  RecaptchaVerifier, 
  // signInWithPhoneNumber,
  onAuthStateChanged
} from "firebase/auth"; // For authentication

import { auth } from '../configs/firebaseConfig'; // Your Firebase configuration
import { useAuth } from '../authContext'; 

export default function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const { phoneSignIn } = useAuth(); // Lấy data từ context
  
  // Hàm lấy cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Hàm lưu token vào cookie
  const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  // Kiểm tra auth khi component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setCookie('userToken', token, 7);
          // Chuyển về trang chủ
          window.location.href = '/';
        } catch (err) {
          console.error('Lỗi lấy token:', err);
          setChecking(false);
        }
      } else {
        // Kiểm tra cookie
        const token = getCookie('userToken');
        if (token) {
          // Có token trong cookie, chuyển về trang chủ
          window.location.href = '/';
        } else {
          setChecking(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Khởi tạo reCAPTCHA sau khi checking xong
  useEffect(() => {
    if (!checking && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: () => {
            console.log('reCAPTCHA đã được giải quyết');
          },
          'expired-callback': () => {
            setError('reCAPTCHA hết hạn. Vui lòng thử lại.');
          }
        });
        window.recaptchaVerifier.render();
      } catch (err) {
        console.error('Lỗi khởi tạo reCAPTCHA:', err);
      }
    }
  }, [checking]);

  // Hàm gửi OTP
  const handleSendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+84${phoneNumber.replace(/^0/, '')}`;
      
      const appVerifier = window.recaptchaVerifier;
      // const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      const result = await phoneSignIn(formattedPhone, appVerifier);

      
      setConfirmationResult(result);
      setStep('otp');
      setSuccess('Mã OTP đã được gửi đến số điện thoại của bạn!');
    } catch (err) {
      setError('Lỗi khi gửi OTP: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xác thực OTP
  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      const token = await user.getIdToken();
      setCookie('userToken', token, 7);
      
      setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (err) {
      setError('Mã OTP không đúng. Vui lòng thử lại.');
      console.error(err);
      setLoading(false);
    }
  };

  // Xử lý Enter key
  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  // Hiển thị loading khi đang kiểm tra auth
  if (checking) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Đang kiểm tra...</span>
          </div>
          <p className="mt-3 text-muted">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold">Đăng nhập bằng số điện thoại</h3>
          
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

          {step === 'phone' ? (
            <div>
              <div className="mb-3">
                <label htmlFor="phoneInput" className="form-label fw-semibold">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control form-control-lg"
                  id="phoneInput"
                  placeholder="0912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSendOTP)}
                />
                <div className="form-text">Nhập số điện thoại Việt Nam (bắt đầu bằng 0)</div>
              </div>

              <div id="recaptcha-container" className="mb-3 d-flex justify-content-center"></div>

              <button 
                onClick={handleSendOTP}
                className="btn btn-primary btn-lg w-100"
                disabled={loading || !phoneNumber}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang gửi...
                  </>
                ) : 'Gửi mã OTP'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <label htmlFor="otpInput" className="form-label fw-semibold">Mã OTP</label>
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  id="otpInput"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleVerifyOTP)}
                  maxLength={6}
                  style={{ letterSpacing: '0.5em', fontSize: '1.5rem' }}
                />
                <div className="form-text">Nhập mã 6 số đã được gửi đến số điện thoại của bạn</div>
              </div>

              <button 
                onClick={handleVerifyOTP}
                className="btn btn-primary btn-lg w-100 mb-2"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang xác thực...
                  </>
                ) : 'Xác thực'}
              </button>

              <button 
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                  setSuccess('');
                }}
                className="btn btn-outline-secondary btn-lg w-100"
              >
                ← Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}