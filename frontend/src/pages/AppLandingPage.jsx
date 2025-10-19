import React from "react";

const AppLandingPage = () => (
  <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: '#fff', color: '#2c3e50' }}>
    {/* Navigation */}
    <nav className="navbar" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.1)', position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: 0 }}>
      <div className="nav-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/applandingpage/applogo.png" alt="SkoolNet Logo" style={{ width: 80, height: 80, borderRadius: 24, boxShadow: '0 4px 32px 0 rgba(102,126,234,0.12)', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', objectFit: 'cover' }} />
        </div>
        <ul className="nav-links" style={{ display: 'flex', listStyle: 'none', gap: 40 }}>
          <li>
            <a href="#contact" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: 500, fontSize: 16 }}>Get Started</a>
          </li>
          <li>
            <a href="#features" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: 500, fontSize: 16 }}>Features</a>
          </li>
          <li>
            <a href="#contact" style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: 500, fontSize: 16 }}>Contact</a>
          </li>
        </ul>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center', position: 'relative' }}>
          <a href="#login" className="nav-links" style={{ textDecoration: 'none', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 0, padding: 0 }}
            onClick={e => {
              e.preventDefault();
              document.getElementById('school-login-card').style.display = 'flex';
            }}>
            <img src="/assets/applandingpage/login.png" alt="Login" style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', boxShadow: '0 4px 24px 0 rgba(102,126,234,0.18)', display: 'block', padding: 4 }} />
          </a>
        </div>
      </div>
    </nav>
    {/* School Login Card Popup (appears after navbar) */}
    <div id="school-login-card" style={{ display: 'none', position: 'fixed', top: 90, left: 0, right: 0, margin: '0 auto', zIndex: 2000, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(102,126,234,0.18)', padding: '32px 40px', minWidth: 260, maxWidth: 340, alignItems: 'center', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#2c3e50', marginBottom: 18, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => { window.location.href = 'https://skool-net-jade.vercel.app/school'; }}>
        ZPHS Pendyala
      </div>
      <button style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 }}
        onClick={() => { window.location.href = 'https://skool-net-jade.vercel.app/school'; }}>
        Go to My School Landing Page
      </button>
      <button style={{ background: 'none', color: '#667eea', border: 'none', fontWeight: 500, fontSize: 15, marginTop: 10, cursor: 'pointer' }}
        onClick={() => { document.getElementById('school-login-card').style.display = 'none'; }}>
        Close
      </button>
    </div>
    {/* Hero Section */}
    <section className="hero" style={{ padding: '120px 0 80px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="hero-content slide-in-left">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 24, color: '#2c3e50' }}>
            Revolutionize School Management with <span className="hero-gradient-text" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SkoolNet</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#5a6c7d', marginBottom: 32, lineHeight: 1.6, maxWidth: 480 }}>
            A comprehensive digital platform connecting students, parents, teachers, and administrators. Streamline attendance, grades, communication, meal management, and parent-teacher meetings all in one powerful solution.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#signup" className="btn-primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '16px 32px', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 18, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Start Free Trial</a>
            <a href="#demo" className="btn-secondary" style={{ background: 'transparent', color: '#667eea', padding: '16px 32px', border: '2px solid #667eea', borderRadius: 12, fontWeight: 600, fontSize: 18, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Watch Demo</a>
          </div>
        </div>
        <div className="hero-image slide-in-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/assets/applandingpage/herosectionimg.png" alt="SkoolNet Platform Dashboard" style={{ maxWidth: '100%', height: 'auto', borderRadius: 20, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }} />
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="features" id="features" style={{ padding: '120px 0', background: '#fff', color: '#2c3e50', position: 'relative', minHeight: '100vh' }}>
      <div className="features-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="section-title fade-in" style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: 24, color: '#2c3e50' }}>Experience the Platform</h2>
          <p style={{ fontSize: '1.3rem', color: '#5a6c7d', maxWidth: 700, margin: '0 auto' }}>Discover how SkoolNet transforms school management with our comprehensive suite of features</p>
        </div>
        <div className="features-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, alignItems: 'center', maxWidth: 1100, margin: '0 auto', padding: '0 10px', minHeight: 500 }}>
          {/* Left Side Features */}
          <div className="features-left" style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'flex-end', minWidth: 0 }}>
            <div className="feature-icon-item slide-in-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/attendance.png" alt="Attendance Management" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Attendance</h3>
            </div>
            <div className="feature-icon-item slide-in-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/marks.png" alt="Grade Management" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Grades & Marks</h3>
            </div>
            <div className="feature-icon-item slide-in-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/assignments.png" alt="Assignment Management" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Assignments</h3>
            </div>
          </div>
          {/* Center: Features Image - NO CARD, NO BORDER, NO SHADOW, BLEND IN */}
          <div className="features-center fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, minWidth: 0, background: 'none' }}>
            <img src="/assets/applandingpage/features.png" alt="SkoolNet Platform Features" className="features-image" style={{ width: '100%', maxWidth: 370, height: 'auto', objectFit: 'contain', background: 'none', boxShadow: 'none', border: 'none', borderRadius: 0, margin: 0, padding: 0 }} />
          </div>
          {/* Right Side Features */}
          <div className="features-right" style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'flex-start', minWidth: 0 }}>
            <div className="feature-icon-item slide-in-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/ptm.png" alt="Parent-Teacher Meetings" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Parent Meetings</h3>
            </div>
            <div className="feature-icon-item slide-in-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/meals.png" alt="Meal Management" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Meal Plans</h3>
            </div>
            <div className="feature-icon-item slide-in-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: '#fff', borderRadius: 18, width: 90, height: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f4f8', flexShrink: 0 }}>
              <img src="/assets/icons/scholarships.png" alt="Scholarship Management" style={{ width: 48, height: 48, marginBottom: 8, objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2c3e50', lineHeight: 1.1, margin: 0, textAlign: 'center' }}>Scholarships</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* School List Section */}
    <section className="school-list-section" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: '#f8fafc' }}>
      <img src="/assets/applandingpage/schoollist.png" alt="School List" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
    </section>

    {/* Contact Section */}
    <section className="contact-section" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'linear-gradient(135deg,#0a357a 0%,#133b7c 100%)', color: '#fff', padding: '80px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: 60 }}>
        <div style={{ flex: '1 1 420px', minWidth: 320, maxWidth: 600 }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Drop us a Line.</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: 40, textAlign: 'center' }}>Ask us a question, or just say Hello.</p>
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ gridColumn: 1 }}>
              <label htmlFor="firstName">First name *</label>
              <input id="firstName" name="firstName" type="text" required style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', marginTop: 4 }} />
            </div>
            <div style={{ gridColumn: 2 }}>
              <label htmlFor="lastName">Last name *</label>
              <input id="lastName" name="lastName" type="text" required style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', marginTop: 4 }} />
            </div>
            <div style={{ gridColumn: 1 }}>
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" required style={{ width: '100%', padding: 12, borderRadius: 6, border: 'none', marginTop: 4 }} />
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" required style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 6, border: 'none', marginTop: 4 }} />
            </div>
            <div style={{ gridColumn: '1 / span 2', textAlign: 'center', marginTop: 20 }}>
              <button type="submit" style={{ background: '#2176ff', color: '#fff', fontSize: '1.2rem', padding: '16px 48px', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer' }}>Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ width: '100%', background: '#f5f7fa', borderTop: '1px solid #e0e6ed', padding: '24px 0', marginTop: 0 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, textAlign: 'left', fontWeight: 700, fontSize: 18, color: '#2c3e50' }}>SkoolNet International School</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, color: '#7b8a99' }}>© {new Date().getFullYear()} SkoolNet. All rights reserved.</div>
        <div style={{ flex: 1, textAlign: 'right', fontSize: 15, color: '#7b8a99' }}>123 Main Street, City, Country</div>
      </div>
    </footer>
  </div>
);

export default AppLandingPage;

