import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Services from './pages/Services';
import Trainers from './pages/Trainers';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import AdminAuth from './pages/Admin/AdminAuth';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AppointmentsManagement from './pages/Admin/AppointmentsManagement';
import PricingManagement from './pages/Admin/PricingManagement';
import AdminManagement from './pages/Admin/AdminManagement';
import { AuthProvider } from './context/AuthContext';
import { TrainerProvider } from './context/TrainerContext';
import ProtectedRoute from './components/ProtectedRoute';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true, 
      mirror: false, 
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <TrainerProvider>
          <ScrollToTop /> 
          <Routes>
            {/* Main application routes with Navbar and Footer */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col bg-[#181818] font-montserrat text-white">
                <Navbar />
                <main className="flex-grow w-full">
                  {/* Each section is a direct child, allowing it to control its own full-width content */}
                  <section id="home" className="w-full scroll-mt-[70px]">
                    <Home />
                  </section>
                  <section id="pricing" className="w-full scroll-mt-[70px]">
                    <Pricing />
                  </section>
                  <section id="services" className="w-full scroll-mt-[70px]">
                    <Services />
                  </section>
                  <section id="trainers" className="w-full scroll-mt-[70px]">
                    <Trainers />
                  </section>
                  <section id="about-us" className="w-full scroll-mt-[70px]">
                    <AboutUs />
                  </section>
                  <section id="faqs" className="w-full scroll-mt-[70px]">
                    <FAQs />
                  </section>
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes - No main Navbar/Footer, specific layout handled by Admin components */}
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute><AppointmentsManagement /></ProtectedRoute>} />
            <Route path="/admin/pricing" element={<ProtectedRoute><PricingManagement /></ProtectedRoute>} />
            <Route path="/admin/management" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
          </Routes>
        </TrainerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;