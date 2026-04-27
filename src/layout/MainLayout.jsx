import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import LandingPage from "../pages/LandingPage";
import Footer from "../components/Footer"

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> 
      <Footer/>
      {/* <LandingPage/> */}
      {/* child pages render here */}
    </>
  );
}