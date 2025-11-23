import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../authContext';


export default function MainLayout({ children }) {
  const { userProfile } = useAuth(); // Lấy data từ context

  return (
    <div className="">
      <Navbar user={userProfile} onLogout={(e) => {
        window.location.href = '/logout';
        // navigate('/logout')
      }}/>

      <main className="container">
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
}
