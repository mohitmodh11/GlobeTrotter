import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Shield,
  Heart,
  Globe2,
  Mail,
  Send,
  ArrowUp,
  PhoneCall,
  CheckSquare,
  HelpCircle,
  FileText,
  Lock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Coins,
  Activity,
  Layers,
  Plane,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import './Footer.css';

export const Footer = () => {
  const { addToast } = useToast();

  // Newsletter State
  const [email, setEmail] = useState('');
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Active Modal State
  const [activeModal, setActiveModal] = useState(null); // 'currency' | 'checklist' | 'emergency' | 'safety' | 'faq' | 'status' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'about' | 'currencySelect'

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Currency Converter State in Modal
  const [calcAmount, setCalcAmount] = useState('100');
  const [calcFrom, setCalcFrom] = useState('USD');
  const [calcTo, setCalcTo] = useState('EUR');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({
    doc1: true,
    doc2: true,
    doc3: false,
    tech1: true,
    tech2: false,
    cloth1: true,
    health1: true,
    health2: false,
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Feedback',
    message: '',
  });

  // Selected Currency Display
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    lang: 'English (US)',
  });

  // Exchange Rates Mock Base USD
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.25,
    JPY: 154.5,
    CAD: 1.36,
    AUD: 1.52,
    SGD: 1.35,
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmittingNewsletter(true);
    setTimeout(() => {
      setIsSubmittingNewsletter(false);
      setIsSubscribed(true);
      addToast('Welcome aboard! You are now subscribed to GlobeTrotter Travel Guides.', 'success');
      setEmail('');
    }, 600);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    addToast('Thank you! Your message has been sent to our travel support team.', 'success');
    setContactForm({ name: '', email: '', subject: 'Feedback', message: '' });
    setActiveModal(null);
  };

  const toggleChecklist = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const calculateConversion = () => {
    const amount = parseFloat(calcAmount) || 0;
    const fromRate = exchangeRates[calcFrom] || 1;
    const toRate = exchangeRates[calcTo] || 1;
    const inUSD = amount / fromRate;
    const converted = inUSD * toRate;
    return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const faqs = [
    {
      q: 'How does multi-city itinerary planning work in GlobeTrotter?',
      a: 'You can create a trip with multiple stops across cities worldwide. For each stop, define arrival and departure dates, sequence transit modes (flights, trains, driving), and add scheduled morning, afternoon, or evening activities.',
    },
    {
      q: 'Can I track and split expenses in multiple currencies?',
      a: 'Yes! GlobeTrotter features a built-in multi-currency expense tracker that auto-converts your expenses to your preferred primary currency (e.g., USD, EUR, INR) and provides categorical breakdown charts.',
    },
    {
      q: 'How do public shareable links work?',
      a: 'Each trip can generate a secure, read-only share link. Anyone with the link can view your itinerary, map pins, day-by-day timetable, and estimated budget without needing to register.',
    },
    {
      q: 'Is GlobeTrotter free to use for personal trips?',
      a: 'Yes, GlobeTrotter is 100% free for individual travelers to plan, budget, and share trips of any length.',
    },
  ];

  return (
    <footer className="footer-wrapper no-print">
      <div className="footer-container">
        {/* 1. Value Highlights Ribbon */}
        <div className="footer-highlights-ribbon">
          <div className="footer-highlight-card">
            <div className="footer-highlight-icon-box">
              <Compass size={20} />
            </div>
            <div>
              <h4 className="footer-highlight-title">Multi-City Routes</h4>
              <p className="footer-highlight-desc">
                Organize stops, transport times & daily milestones seamlessly.
              </p>
            </div>
          </div>

          <div className="footer-highlight-card">
            <div className="footer-highlight-icon-box">
              <DollarSign size={20} />
            </div>
            <div>
              <h4 className="footer-highlight-title">Smart Budgeting</h4>
              <p className="footer-highlight-desc">
                Categorize expenses & auto-convert currencies in real-time.
              </p>
            </div>
          </div>

          <div className="footer-highlight-card">
            <div className="footer-highlight-icon-box">
              <Share2 size={20} />
            </div>
            <div>
              <h4 className="footer-highlight-title">Instant Trip Sharing</h4>
              <p className="footer-highlight-desc">
                Generate clean, interactive itineraries for travel buddies.
              </p>
            </div>
          </div>

          <div className="footer-highlight-card">
            <div className="footer-highlight-icon-box">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="footer-highlight-title">Safe & Protected</h4>
              <p className="footer-highlight-desc">
                Your travel documents & private plans are safe and encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main 5-Column Grid */}
        <div className="footer-main-grid">
          {/* Brand & Newsletter Column */}
          <div className="footer-brand-col">
            <Link to="/dashboard" className="footer-logo-link">
              <div className="footer-logo-icon">
                <Compass size={22} />
              </div>
              <div>
                <span className="footer-logo-text">GlobeTrotter</span>
              </div>
            </Link>

            <p className="footer-tagline">
              Simple, smart, multi-city travel planning, day-by-day scheduling, and itinerary budgeting for modern explorers.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="footer-newsletter-box">
              <span className="footer-newsletter-title">
                <Mail size={15} color="#15803d" /> Travel Inspiration
              </span>
              <p className="footer-newsletter-desc">
                Join 25,000+ travelers receiving weekly destination guides & budgeting tips.
              </p>

              {isSubscribed ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                    fontWeight: 600,
                    backgroundColor: '#f0fdf4',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <CheckCircle2 size={16} /> Subscribed to weekly travel dispatch!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer-newsletter-input"
                    required
                  />
                  <button
                    type="submit"
                    className="footer-newsletter-btn"
                    disabled={isSubmittingNewsletter}
                  >
                    <Send size={13} /> {isSubmittingNewsletter ? '...' : 'Join'}
                  </button>
                </form>
              )}
            </div>

            {/* Social Channels */}
            <div className="footer-social-row">
              <button
                type="button"
                onClick={() => addToast('Opening GlobeTrotter X/Twitter community feed', 'info')}
                className="footer-social-btn"
                title="Twitter / X"
                aria-label="Twitter"
              >
                <Globe2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => addToast('Opening GlobeTrotter GitHub repository', 'info')}
                className="footer-social-btn"
                title="GitHub"
                aria-label="GitHub"
              >
                <Sparkles size={16} />
              </button>
              <button
                type="button"
                onClick={() => addToast('Opening GlobeTrotter Instagram photo gallery', 'info')}
                className="footer-social-btn"
                title="Instagram"
                aria-label="Instagram"
              >
                <MapPin size={16} />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('about')}
                className="footer-social-btn"
                title="About Us"
                aria-label="About Us"
              >
                <Heart size={16} color="#dc2626" />
              </button>
            </div>
          </div>

          {/* Column 1: Trip Planning */}
          <div>
            <h4 className="footer-col-title">
              <Plane size={15} color="#15803d" /> Trip Planning
            </h4>
            <ul className="footer-link-list">
              <li className="footer-link-item">
                <Link to="/trips/new">
                  Plan New Trip <span className="footer-badge-pill new">New</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/trips">My Saved Itineraries</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/cities">City Destination Search</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/activities">Activity & Tour Finder</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/trips">Multi-City Route Builder</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/trips">Budget & Expense Log</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore & Tools */}
          <div>
            <h4 className="footer-col-title">
              <Sparkles size={15} color="#15803d" /> Explore & Tools
            </h4>
            <ul className="footer-link-list">
              <li className="footer-link-item">
                <Link to="/cities">
                  Popular Global Cities <span className="footer-badge-pill hot">Hot</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/activities">Curated Experiences</Link>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('currency')}>
                  <Coins size={14} /> Currency Converter
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('checklist')}>
                  <CheckSquare size={14} /> Packing Checklist
                </button>
              </li>
              <li className="footer-link-item">
                <Link to="/profile">Traveler Preferences</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/dashboard">Personal Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Safety */}
          <div>
            <h4 className="footer-col-title">
              <Shield size={15} color="#15803d" /> Safety & Help
            </h4>
            <ul className="footer-link-list">
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('emergency')}>
                  <PhoneCall size={14} /> Emergency Numbers
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('safety')}>
                  <Shield size={14} /> Travel Safety Tips
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('faq')}>
                  <HelpCircle size={14} /> FAQs & Guidance
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('contact')}>
                  <Mail size={14} /> Traveler Support
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('status')}>
                  <Activity size={14} /> Live System Status
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Legal */}
          <div>
            <h4 className="footer-col-title">
              <Layers size={15} color="#15803d" /> Platform
            </h4>
            <ul className="footer-link-list">
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('about')}>
                  About GlobeTrotter
                </button>
              </li>
              <li className="footer-link-item">
                <Link to="/admin/dashboard">
                  Admin Console <span className="footer-badge-pill pro">Admin</span>
                </Link>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('privacy')}>
                  Privacy & Data
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('terms')}>
                  Terms of Service
                </button>
              </li>
              <li className="footer-link-item">
                <button type="button" onClick={() => setActiveModal('cookies')}>
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p>© {new Date().getFullYear()} GlobeTrotter. Crafted for travelers worldwide.</p>
            <button
              type="button"
              onClick={() => setActiveModal('status')}
              className="footer-status-indicator"
              title="Click to view live infrastructure status"
            >
              <span className="footer-status-dot" />
              All Systems Operational
            </button>
          </div>

          <div className="footer-bottom-center">
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="footer-legal-btn"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="footer-legal-btn"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveModal('cookies')}
              className="footer-legal-btn"
            >
              Cookie Preferences
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveModal('about')}
              className="footer-legal-btn"
            >
              About Us
            </button>
          </div>

          <div className="footer-bottom-right">
            {/* Language & Currency Pill */}
            <button
              type="button"
              onClick={() => setActiveModal('currencySelect')}
              className="footer-select-pill"
              title="Change language and primary currency"
            >
              <Globe2 size={13} color="#15803d" />
              {selectedCurrency.lang.split(' ')[0]} · {selectedCurrency.label}
            </button>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-back-to-top"
              title="Scroll to top of page"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE FOOTER MODALS
          ========================================================================= */}

      {/* 1. Currency Converter Modal */}
      <Modal
        isOpen={activeModal === 'currency'}
        onClose={() => setActiveModal(null)}
        title="Travel Currency Converter"
        size="md"
      >
        <div className="footer-modal-content">
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Instant conversion based on live benchmark exchange rates for accurate trip budgeting.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Amount
              </label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                From
              </label>
              <select
                value={calcFrom}
                onChange={(e) => setCalcFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                }}
              >
                {Object.keys(exchangeRates).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                To
              </label>
              <select
                value={calcTo}
                onChange={(e) => setCalcTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                }}
              >
                {Object.keys(exchangeRates).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
              Estimated Converted Amount
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
              {calculateConversion()} {calcTo}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              1 {calcFrom} = {(exchangeRates[calcTo] / exchangeRates[calcFrom]).toFixed(4)} {calcTo}
            </span>
          </div>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Done
          </Button>
        </div>
      </Modal>

      {/* 2. Interactive Packing Checklist Modal */}
      <Modal
        isOpen={activeModal === 'checklist'}
        onClose={() => setActiveModal(null)}
        title="Interactive Travel Packing Essentials"
        size="md"
      >
        <div className="footer-modal-content">
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Check off must-haves before leaving for your trip. Your progress is saved as you plan.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '340px', overflowY: 'auto' }}>
            <div>
              <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '6px' }}>
                📄 Essential Documents
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'doc1', label: 'Passport & Visa (Valid 6+ months)' },
                  { id: 'doc2', label: 'Flight & Hotel Booking Confirmations' },
                  { id: 'doc3', label: 'Travel Medical Insurance Card' },
                ].map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: checkedItems[item.id] ? '#f0fdf4' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleChecklist(item.id)}
                    />
                    <span style={{ textDecoration: checkedItems[item.id] ? 'line-through' : 'none', color: checkedItems[item.id] ? '#166534' : '#334155' }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '6px' }}>
                🔌 Electronics & Gear
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'tech1', label: 'Universal Travel Power Adapter' },
                  { id: 'tech2', label: 'Portable Power Bank (10,000mAh+)' },
                ].map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: checkedItems[item.id] ? '#f0fdf4' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleChecklist(item.id)}
                    />
                    <span style={{ textDecoration: checkedItems[item.id] ? 'line-through' : 'none', color: checkedItems[item.id] ? '#166534' : '#334155' }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '6px' }}>
                💊 Health & Medication
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'health1', label: 'Prescription medicines in original bottles' },
                  { id: 'health2', label: 'Basic first-aid kit, pain relievers & band-aids' },
                ].map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: checkedItems[item.id] ? '#f0fdf4' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleChecklist(item.id)}
                    />
                    <span style={{ textDecoration: checkedItems[item.id] ? 'line-through' : 'none', color: checkedItems[item.id] ? '#166534' : '#334155' }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              addToast('Packing checklist saved!', 'success');
              setActiveModal(null);
            }}
            style={{ width: '100%' }}
          >
            Save & Close
          </Button>
        </div>
      </Modal>

      {/* 3. Global Emergency Numbers Modal */}
      <Modal
        isOpen={activeModal === 'emergency'}
        onClose={() => setActiveModal(null)}
        title="Worldwide Emergency Assistance Numbers"
        size="md"
      >
        <div className="footer-modal-content">
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8125rem', color: '#92400e' }}>
              Save local numbers on your phone before departure. You can dial these without roaming or SIM locks in most territories.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🇺🇸 USA & 🇨🇦 Canada</strong>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>911</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>All Emergencies (Police, Fire, Ambulance)</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🇪🇺 European Union & 🇬🇧 UK</strong>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>112 / 999</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard Pan-European SOS hotline</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🇮🇳 India</strong>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>112</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>National Emergency Response System</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🇦🇺 Australia</strong>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>000</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Triple Zero Emergency Services</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🇯🇵 Japan</strong>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>110 / 119</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>110 for Police, 119 for Ambulance</p>
            </div>

            <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>🌐 International SOS</strong>
              <span style={{ color: '#15803d', fontWeight: 800, fontSize: '1.125rem' }}>+1 215 942 8226</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Global Medical & Security Assistance</p>
            </div>
          </div>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Understood
          </Button>
        </div>
      </Modal>

      {/* 4. Safety & Health Tips Modal */}
      <Modal
        isOpen={activeModal === 'safety'}
        onClose={() => setActiveModal(null)}
        title="Smart Travel Safety Guidelines"
        size="md"
      >
        <div className="footer-modal-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Shield size={18} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Digital Backups & Cloud Storage</strong>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Keep digital copies of your passport, visa, and insurance cards encrypted in the cloud and on your phone.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Lock size={18} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Card Security & Travel Alerts</strong>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Notify your bank about travel dates to prevent fraud holds, and carry at least two different card providers.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <MapPin size={18} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Local Laws & Transportation Scams</strong>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Always use official metered taxis, ride-hailing apps, or pre-booked transfers rather than unofficial street solicitations.
                </p>
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Got It
          </Button>
        </div>
      </Modal>

      {/* 5. FAQs Modal */}
      <Modal
        isOpen={activeModal === 'faq'}
        onClose={() => setActiveModal(null)}
        title="Frequently Asked Questions"
        size="md"
      >
        <div className="footer-modal-content">
          <div>
            {faqs.map((faq, idx) => (
              <div key={idx} className="footer-faq-item">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="footer-faq-question"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFaq === idx && <div className="footer-faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>
              Have another question? Our traveler support is ready to help.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveModal('contact');
              }}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </Modal>

      {/* 6. Traveler Support / Contact Modal */}
      <Modal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal(null)}
        title="Traveler Support & Feedback"
        size="md"
      >
        <form onSubmit={handleContactSubmit} className="footer-modal-content">
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Send us your travel questions, feature requests, or bug reports. Our team typically responds within 24 hours.
          </p>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Your Name
            </label>
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="e.g. Alex Traveler"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Your Email Address
            </label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="alex@example.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Topic
            </label>
            <select
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="Feedback">Itinerary & Feature Feedback</option>
              <option value="Bug">Report a Bug / Issue</option>
              <option value="Partnership">Travel Guide & Destination Partner</option>
              <option value="Account">Account & Privacy Question</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Message
            </label>
            <textarea
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="How can we help make your travel planning smoother?"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                resize: 'vertical',
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Live System Status Modal */}
      <Modal
        isOpen={activeModal === 'status'}
        onClose={() => setActiveModal(null)}
        title="GlobeTrotter Service Health & Status"
        size="md"
      >
        <div className="footer-modal-content">
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="footer-status-dot" style={{ width: '10px', height: '10px' }} />
              <div>
                <strong style={{ fontSize: '0.9375rem', color: '#15803d' }}>All Systems Operational</strong>
                <p style={{ fontSize: '0.75rem', color: '#166534' }}>99.98% Uptime over the past 90 days</p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>2026 Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Itinerary Storage & Cloud Sync', status: 'Operational', latency: '24ms' },
              { name: 'Multi-Currency Exchange API', status: 'Operational', latency: '42ms' },
              { name: 'City & Activity Geolocation Engine', status: 'Operational', latency: '35ms' },
              { name: 'Public Share Link Generator', status: 'Operational', latency: '18ms' },
              { name: 'Authentication & Session Shield', status: 'Operational', latency: '15ms' },
            ].map((service, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                }}
              >
                <span style={{ fontWeight: 500, color: '#334155' }}>{service.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{service.latency}</span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#15803d',
                      backgroundColor: '#f0fdf4',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Close Status
          </Button>
        </div>
      </Modal>

      {/* 8. Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy & Data Ethics"
        size="md"
      >
        <div className="footer-modal-content" style={{ maxHeight: '380px', overflowY: 'auto' }}>
          <p>
            At <strong>GlobeTrotter</strong>, your travel plans, personal notes, expenses, and itinerary destinations belong strictly to you.
          </p>

          <h5 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>1. Information We Collect</h5>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            We only collect your name, email, and created trips/expenses to provide trip planning and synchronization services. We do not sell your personal travel profiles to third-party ad brokers.
          </p>

          <h5 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>2. Itinerary Security</h5>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Trips are strictly private by default. They are only shared when you explicitly create a public share code via the Share button.
          </p>

          <h5 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>3. Data Deletion</h5>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            You can delete individual trips or your entire profile anytime directly from your preferences dashboard.
          </p>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%', marginTop: '8px' }}>
            Understood
          </Button>
        </div>
      </Modal>

      {/* 9. Terms of Service Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
        size="md"
      >
        <div className="footer-modal-content" style={{ maxHeight: '380px', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            By using GlobeTrotter, you agree to these simple terms designed to keep the travel community safe and respectful.
          </p>

          <h5 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>1. Acceptable Use</h5>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            GlobeTrotter is provided for legitimate travel planning, itinerary management, and vacation budgeting. Do not publish illegal, fraudulent, or harmful content in shared trip itineraries.
          </p>

          <h5 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>2. Travel Accuracy & Liability</h5>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Currency rates, attraction prices, and destination data are provided for budgeting reference. Always verify opening hours and official visa prerequisites with local consulates.
          </p>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%', marginTop: '8px' }}>
            Accept & Close
          </Button>
        </div>
      </Modal>

      {/* 10. Cookie Settings Modal */}
      <Modal
        isOpen={activeModal === 'cookies'}
        onClose={() => setActiveModal(null)}
        title="Cookie & Privacy Preferences"
        size="md"
      >
        <div className="footer-modal-content">
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            We use minimal cookies to keep you securely signed in and remember your currency and theme preferences.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Essential Cookies</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Required for authentication & trip saving</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                Always On
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Functional Preferences</strong>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Remembers chosen currency & metric units</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                Active
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              addToast('Preferences saved successfully', 'success');
              setActiveModal(null);
            }}
            style={{ width: '100%' }}
          >
            Save Cookie Preferences
          </Button>
        </div>
      </Modal>

      {/* 11. About Us Modal */}
      <Modal
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
        title="About GlobeTrotter"
        size="md"
      >
        <div className="footer-modal-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#15803d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803d', margin: 0 }}>GlobeTrotter</h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>The Modern Multi-City Itinerary Platform</span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
            GlobeTrotter was engineered to eliminate the stress of chaotic multi-destination trips. By uniting <strong>day-by-day scheduling</strong>, <strong>interactive maps</strong>, <strong>cross-currency expense tracking</strong>, and <strong>seamless collaboration</strong> in one fast interface, we empower travelers to focus on discovering the world.
          </p>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              fontSize: '0.8125rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Heart size={16} color="#dc2626" />
            <span>Crafted with passion for world explorers, solo travelers & families.</span>
          </div>

          <Button variant="primary" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Explore GlobeTrotter
          </Button>
        </div>
      </Modal>

      {/* 12. Quick Currency & Locale Switcher Modal */}
      <Modal
        isOpen={activeModal === 'currencySelect'}
        onClose={() => setActiveModal(null)}
        title="Select Primary Currency & Regional Settings"
        size="md"
      >
        <div className="footer-modal-content">
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Choose your default display currency. All trip budgets and costs will calculate in this denomination.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { code: 'USD', symbol: '$', label: 'USD ($)', lang: 'English (US)' },
              { code: 'EUR', symbol: '€', label: 'EUR (€)', lang: 'English (EU)' },
              { code: 'GBP', symbol: '£', label: 'GBP (£)', lang: 'English (UK)' },
              { code: 'INR', symbol: '₹', label: 'INR (₹)', lang: 'English (IN)' },
              { code: 'JPY', symbol: '¥', label: 'JPY (¥)', lang: 'Japanese (JP)' },
              { code: 'CAD', symbol: 'CA$', label: 'CAD ($)', lang: 'English (CA)' },
              { code: 'AUD', symbol: 'AU$', label: 'AUD ($)', lang: 'English (AU)' },
              { code: 'SGD', symbol: 'S$', label: 'SGD ($)', lang: 'English (SG)' },
            ].map((item) => {
              const isSelected = selectedCurrency.code === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(item);
                    addToast(`Primary currency switched to ${item.label}`, 'success');
                    setActiveModal(null);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #15803d' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.875rem' }}>
                      {item.symbol} {item.code}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.lang}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={18} color="#15803d" />}
                </button>
              );
            })}
          </div>

          <Button variant="outline" onClick={() => setActiveModal(null)} style={{ width: '100%' }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </footer>
  );
};
