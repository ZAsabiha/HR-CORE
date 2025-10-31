import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, User, Folder, Settings, Mail } from 'lucide-react';

const LandingPage = () => {
  const styles = {
    container: {
      minHeight: '100vh',
    width: '100vw',

      backgroundColor: '#0C3D4A',
      color: 'white',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'space-between',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
    },
    navLeft: {
      fontSize: '1.7rem',
      fontWeight: '700',
    },
    navRight: {
      display: 'flex',
      gap: '2rem',
      fontSize: '1rem',
      fontWeight: '500',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
    main: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: '4rem',
      padding: '2rem',
    },
    headingText: {
      fontSize: '3.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
    },
    footer: {
      textAlign: 'center',
      fontSize: '0.9rem',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      fontWeight: '400',
    },
    diagramContainer: {
      width: '350px',
      height: '350px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centralPerson: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#4a90e2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 10,
      border: '3px solid #ffffff',
    },
    personIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#ffb6c1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '5px',
    },
    personBody: {
      width: '60px',
      height: '40px',
      backgroundColor: '#2c5f5f',
      borderRadius: '8px 8px 15px 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    personTie: {
      width: '12px',
      height: '25px',
      backgroundColor: 'white',
      position: 'absolute',
      top: '3px',
    },
    iconCircle: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid #2c5f5f',
      position: 'absolute',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    connectionLine: {
      position: 'absolute',
      width: '2px',
      backgroundColor: '#2c5f5f',
      transformOrigin: 'center',
    }
  };

  const getIconPosition = (index, total, radius = 125) => {
    const angle = (index * 360 / total) - 90;
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    return {
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    };
  };

  const getConnectionLineStyle = (index, total) => {
    const angle = (index * 360 / total) - 90;
    return {
      ...styles.connectionLine,
      height: '80px',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    };
  };

  const icons = [
    { component: PieChart, color: '#87ceeb', bgColor: '#4a90e2' },
    { component: User, color: '#ffb6c1', bgColor: '#e74c3c', route: '/login' },
    { component: Folder, color: '#ffd700', bgColor: '#f39c12' },
    { component: Settings, color: '#ffd700', bgColor: '#f39c12' },
    { component: Mail, color: '#87ceeb', bgColor: '#4a90e2' }
  ];

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? '#ffd700' : 'white';
    e.target.style.textDecoration = isHover ? 'underline' : 'none';
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>HR CORE</div>
        <div style={styles.navRight}>
          <Link to="/" style={styles.link} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Home</Link>
          <Link to="/about" style={styles.link} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>About</Link>
          <Link to="/job-openings" style={styles.link} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Job Openings</Link>
          <Link to="/contact" style={styles.link} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Contact</Link>
          <Link to="/login" style={styles.link} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Login</Link>
        </div>
      </nav>

      {/* Main Section */}
      <main style={styles.main}>
        <div style={styles.headingText}>
          <div>Welcome</div>
          <div>to HR Core</div>
        </div>

        {/* HR Core Diagram */}
        <div style={styles.diagramContainer}>
          {icons.map((_, index) => (
            <div key={`line-${index}`} style={getConnectionLineStyle(index, icons.length)} />
          ))}

          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }} />

          <div style={styles.centralPerson}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={styles.personIcon}></div>
              <div style={styles.personBody}>
                <div style={styles.personTie} />
              </div>
            </div>
          </div>

          {icons.map((iconData, index) => {
            const IconComponent = iconData.component;
            const iconPosition = getIconPosition(index, icons.length);
            const iconContent = (
              <div
                key={index}
                style={{
                  ...styles.iconCircle,
                  ...iconPosition,
                  backgroundColor: iconData.bgColor
                }}
              >
                <IconComponent size={28} color="white" />
              </div>
            );

            return iconData.route ? (
              <Link key={index} to={iconData.route} style={{ textDecoration: 'none' }}>
                {iconContent}
              </Link>
            ) : (
              iconContent
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>Privacy Policy | Terms of Service | Contact Us</div>
        <div>© 2025 YourCompanyName. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LandingPage;