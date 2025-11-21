import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Container className="mt-3">{children}</Container>
      <Footer />
    </>
  );
}
