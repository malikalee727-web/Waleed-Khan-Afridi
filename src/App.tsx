import React, { useState, useEffect, useRef } from 'react';
import { 
  Clipboard, 
  Check, 
  Code, 
  Folder, 
  BookOpen, 
  Mail, 
  Compass, 
  ArrowUpRight, 
  Layers, 
  Smartphone, 
  Cpu, 
  Layout, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // normalized between 0 and 1
  const [isMobile, setIsMobile] = useState(false);
  const [showExporter, setShowExporter] = useState(false);
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Live Pakistan Time
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        
        // Format live PKT time
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        // Format live PKT date
        const dateStr = now.toLocaleDateString('en-US', {
          timeZone: 'Asia/Karachi',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        setCurrentTime(timeStr);
        setCurrentDate(dateStr);
      } catch (e) {
        // Fallback if Intl or timezone isn't fully supported
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString());
        setCurrentDate(now.toDateString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle cursor and responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0.5, y: 0.5 });
  };

  // Compute interactive blend values
  // Under hover: far left (x=0) yields designerWeight=1, coderWeight=0
  // Far right (x=1) yields designerWeight=0, coderWeight=1
  // Center (x=0.5) yields designerWeight=0.5, coderWeight=0.5
  const dWeight = Math.max(0, Math.min(1, (1 - mousePos.x) * 1.6 - 0.3 + 0.5));
  const cWeight = Math.max(0, Math.min(1, mousePos.x * 1.6 - 0.3));

  // Subtle 3D tilting for the portrait
  const portraitRotateY = (mousePos.x - 0.5) * 16;
  const portraitRotateX = (0.5 - mousePos.y) * 16;
  const portraitTranslateX = (mousePos.x - 0.5) * 8;
  const portraitTranslateY = (mousePos.y - 0.5) * 8;

  // Parallax shifts for background elements
  const leftShapeX = (0.5 - mousePos.x) * 25;
  const leftShapeY = (0.5 - mousePos.y) * 25;
  const rightCodeX = (mousePos.x - 0.5) * 20;
  const rightCodeY = (mousePos.y - 0.5) * 20;

  // Single file WordPress raw custom HTML block content
  const wordpressHTMLBlock = `<!-- START ADHAM DANNAWAY INSPIRED PORTFOLIO BLOCK -->
<div id="ap-portfolio-wrapper" class="ap-portfolio-root">
  
  <!-- Font Awesome Icons & Google Fonts included natively -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@800&family=Poppins:wght@300;400;500;650;750;900&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

  <style>
    /* Scope all styles perfectly to avoid polluting WordPress default styles */
    #ap-portfolio-wrapper {
      --pkt-primary: #111111;
      --pkt-text-muted: #666666;
      --pkt-border: #e2e8f0;
      --pkt-font-sans: 'Inter', system-ui, -apple-system, sans-serif;
      --pkt-font-poppins: 'Poppins', sans-serif;
      --pkt-font-mono: 'Fira Code', 'Courier New', monospace;
      
      font-family: var(--pkt-font-sans);
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      width: 100%;
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    #ap-portfolio-wrapper * {
      box-sizing: border-box;
      transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    }

    /* Fixed Top Navbar */
    .ap-nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 75px;
      background: rgba(17, 17, 17, 0.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
    }

    .ap-nav-left {
      display: flex;
      align-items: center;
    }

    .ap-header-name {
      display: block;
    }

    .ap-logo {
      padding: 0 16px;
      height: 44px;
      border-radius: 22px;
      background: #ffffff;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-family: var(--pkt-font-poppins);
      font-size: 0.82rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .ap-logo:hover {
      transform: scale(1.08) rotate(-5deg);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .ap-nav-center {
      display: flex;
      gap: 28px;
    }

    .ap-nav-link {
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 6px 0;
      position: relative;
      transition: color 0.2s ease;
    }

    .ap-nav-link:hover {
      color: #ffffff;
    }

    .ap-nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #ffffff;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ap-nav-link:hover::after {
      width: 100%;
    }

    .ap-nav-link.active {
      color: #ffffff;
    }
    
    .ap-nav-link.active::after {
      width: 100%;
    }

    .ap-nav-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: #ffffff;
      font-family: var(--pkt-font-mono);
      font-size: 0.78rem;
      line-height: 1.4;
      border-left: 2px solid rgba(255, 255, 255, 0.15);
      padding-left: 15px;
    }

    .ap-pkt-time {
      font-weight: 605;
      letter-spacing: 0.04em;
      color: #38bdf8; /* Soft blue focus */
    }

    .ap-pkt-date {
      color: rgba(255, 255, 255, 0.5);
    }

    /* Hero Area with Split Track */
    .ap-hero-section {
      width: 100%;
      min-height: 100vh;
      display: flex;
      position: relative;
      background: #ffffff;
      overflow: hidden;
      padding-top: 75px;
    }

    /* Splits */
    .ap-split-panel {
      width: 50%;
      min-height: calc(100vh - 75px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 2;
      padding: 60px 8% 60px 8%;
      box-sizing: border-box;
    }

    .ap-designer-panel {
      align-items: flex-start;
      text-align: left;
      background-color: #fafaf9; /* Extremely warm premium white */
    }

    .ap-coder-panel {
      align-items: flex-end;
      text-align: right;
      background-color: #ffffff; /* Clean white */
      border-left: 1px solid rgba(0, 0, 0, 0.04);
    }

    /* Subtle decorative paint/shapes on Left side */
    .ap-designer-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
      opacity: var(--designer-shapes-opacity, 0.95);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
    }

    .ap-art-blob-1 {
      position: absolute;
      top: 20%;
      left: 10%;
      width: 280px;
      height: 280px;
      border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
      background: radial-gradient(circle, rgba(254,215,170,0.48) 0%, rgba(253,186,116,0.1) 70%);
      filter: blur(30px);
    }

    .ap-art-blob-2 {
      position: absolute;
      bottom: 15%;
      left: 20%;
      width: 240px;
      height: 240px;
      border-radius: 60% 40% 30% 70% / 50% 40% 60% 50%;
      background: radial-gradient(circle, rgba(252,165,185,0.44) 0%, rgba(244,63,94,0.08) 60%);
      filter: blur(35px);
    }

    .ap-canvas-brush {
      position: absolute;
      width: 320px;
      opacity: 0.12;
      transform: rotate(-15deg);
      pointer-events: none;
      top: 25%;
      left: 5%;
    }

    /* Subtle code snippets in background of Right side */
    .ap-coder-codebg {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
      font-family: var(--pkt-font-mono);
      font-size: 0.78rem;
      line-height: 1.6;
      color: rgba(9, 9, 11, 0.05); /* Clean white background code overlay */
      padding: 40px;
      opacity: var(--coder-code-opacity, 0.95);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
    }

    /* Core Hero typography styles */
    .ap-hero-title-designer {
      font-family: var(--pkt-font-poppins);
      font-size: clamp(3.2rem, 7.5vw, 6.8rem);
      font-weight: 900;
      line-height: 0.95;
      color: #111111;
      margin: 0 0 20px 0;
      letter-spacing: -0.04em;
      text-transform: lowercase;
      transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
    }

    .ap-hero-title-coder {
      font-family: var(--pkt-font-poppins);
      font-size: clamp(3.2rem, 7.5vw, 6.8rem);
      font-weight: 900;
      line-height: 0.95;
      color: #111111;
      margin: 0 0 20px 0;
      letter-spacing: -0.03em;
      transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
    }

    .ap-hero-subtext {
      font-size: clamp(1rem, 1.3vw, 1.25rem);
      font-weight: 300;
      line-height: 1.6;
      color: var(--pkt-text-muted);
      max-width: 440px;
      margin: 0;
    }

    .ap-designer-panel .ap-hero-subtext {
      font-family: var(--pkt-font-sans);
    }

    .ap-coder-panel .ap-hero-subtext {
      font-family: var(--pkt-font-mono);
      letter-spacing: -0.02em;
    }

    /* Large Centered Interactive Portrait */
    .ap-portrait-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: clamp(280px, 32vw, 420px);
      height: clamp(280px, 32vw, 420px);
      z-index: 10;
      pointer-events: none; /* Let pointer events roll down to panels on hover */
    }

    .ap-portrait-frame {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 50%;
      background: #ffffff;
      padding: 8px;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.02),
        inset 0 0 0 1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      animation: ap-float 6s ease-in-out infinite;
      transition: transform 0.1s ease-out, box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ap-portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      referrerpolicy: no-referrer;
    }

    /* Floating Social Icons directly above/right of visual portrait */
    .ap-social-anchorage {
      position: absolute;
      top: -30px;
      right: -25px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 40;
      pointer-events: auto; /* Re-enable pointer events for social links */
    }

    .ap-social-icon {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.08);
      color: #111111;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 1.1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ap-social-icon:hover {
      background: #111111;
      color: #ffffff;
      transform: scale(1.15) translateY(-3px) rotate(5deg);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    /* Subtle parallax scroll background lines */
    .ap-mid-splitting-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      background: radial-gradient(circle, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.01) 100%);
      z-index: 3;
      transform: translate(-50%);
    }

    /* Hover interactivity weights via general container class additions */
    .ap-portfolio-root.hovering-left .ap-designer-panel {
      background-color: #f7f6f3;
    }
    
    .ap-portfolio-root.hovering-left .ap-hero-title-designer {
      transform: translateX(10px) scale(1.02);
      color: #ea580c; /* High contrast energetic orange */
    }

    .ap-portfolio-root.hovering-left .ap-hero-title-coder {
      opacity: 0.28;
    }

    .ap-portfolio-root.hovering-left .ap-portrait-frame {
      box-shadow: 
        0 20px 45px rgba(234, 88, 12, 0.14),
        0 1px 3px rgba(0,0,0,0.02);
    }

    .ap-portfolio-root.hovering-right .ap-coder-panel {
      background-color: #f8fafc; /* Cool slate */
    }

    .ap-portfolio-root.hovering-right .ap-hero-title-coder {
      transform: translateX(-10px) scale(1.02);
      color: #0284c7; /* Technical bright blue */
    }

    .ap-portfolio-root.hovering-right .ap-hero-title-designer {
      opacity: 0.28;
    }

    .ap-portfolio-root.hovering-right .ap-portrait-frame {
      box-shadow: 
        0 20px 45px rgba(2, 132, 199, 0.14),
        0 1px 3px rgba(0,0,0,0.02);
    }

    /* Page-load anim elements */
    .ap-fade-in {
      animation: ap-fade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* About Section */
    .ap-section {
      width: 100%;
      padding: 120px 40px;
      border-top: 1px solid var(--pkt-border);
      background-color: #ffffff;
      position: relative;
    }

    .ap-section-alt {
      background-color: #fafafa;
    }

    .ap-section-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .ap-section-header {
      margin-bottom: 60px;
      text-align: center;
    }

    .ap-section-tag {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #0284c7;
      margin-bottom: 12px;
      display: inline-block;
    }

    .ap-section-title {
      font-family: var(--pkt-font-poppins);
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #111111;
      letter-spacing: -0.03em;
      margin: 0;
    }

    .ap-about-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-top: 40px;
    }

    .ap-about-col {
      padding: 30px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 4px 20px rgba(0,0,0,0.01);
      position: relative;
    }

    .ap-about-col-designer {
      border-left: 4px solid #ea580c;
    }

    .ap-about-col-coder {
      border-left: 4px solid #0284c7;
    }

    .ap-about-col-title {
      font-family: var(--pkt-font-poppins);
      font-size: 1.5rem;
      font-weight: 750;
      margin-bottom: 20px;
    }

    .ap-about-desc {
      font-size: 0.98rem;
      line-height: 1.7;
      color: #4a5568;
      margin-bottom: 25px;
    }

    .ap-skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ap-skill-badge {
      font-size: 0.78rem;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 20px;
      background: #f1f5f9;
      color: #334155;
    }

    /* Portfolio Highlights Grid */
    .ap-portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 30px;
    }

    .ap-portfolio-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--pkt-border);
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }

    .ap-portfolio-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 36px rgba(0,0,0,0.08);
      border-color: rgba(2, 132, 199, 0.2);
    }

    .ap-card-img-wrapper {
      position: relative;
      width: 100%;
      height: 220px;
      background: #f8fafc;
      overflow: hidden;
    }

    .ap-card-fallback-vector {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      background: radial-gradient(circle at top right, rgba(2,132,199,0.03), transparent);
    }

    .ap-card-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      background: #111111;
      color: #ffffff;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .ap-card-body {
      padding: 24px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .ap-card-info h3 {
      font-family: var(--pkt-font-poppins);
      font-size: 1.25rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 10px 0;
    }

    .ap-card-info p {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #64748b;
      margin: 0 0 20px 0;
    }

    .ap-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(0,0,0,0.05);
      padding-top: 15px;
    }

    .ap-card-tags {
      display: flex;
      gap: 6px;
    }

    .ap-card-tag {
      font-family: var(--pkt-font-mono);
      font-size: 0.72rem;
      color: #0284c7;
    }

    .ap-card-btn {
      font-size: 0.85rem;
      font-weight: 600;
      color: #111111;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s ease;
    }

    .ap-card-btn:hover {
      color: #ea580c;
    }

    /* Blog List Container */
    .ap-blog-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .ap-blog-item {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      align-items: center;
    }

    .ap-blog-item:last-child {
      border-bottom: none;
    }

    .ap-blog-meta {
      font-family: var(--pkt-font-mono);
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .ap-blog-content h3 {
      font-family: var(--pkt-font-poppins);
      font-size: 1.35rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 8px 0;
      transition: color 0.2s ease;
    }

    .ap-blog-item:hover h3 {
      color: #0284c7;
    }

    .ap-blog-content p {
      font-size: 0.95rem;
      line-height: 1.6;
      color: #475569;
      margin: 0;
    }

    /* Elegant minimal contact form */
    .ap-contact-wrapper {
      max-width: 650px;
      margin: 0 auto;
    }

    .ap-form-group {
      margin-bottom: 20px;
    }

    .ap-form-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #111111;
      margin-bottom: 8px;
    }

    .ap-textbox {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-family: var(--pkt-font-sans);
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
    }

    .ap-textbox:focus {
      border-color: #111111;
      box-shadow: 0 0 0 3px rgba(17,17,17,0.04);
    }

    .ap-submit-btn {
      width: 100%;
      background: #111111;
      color: #ffffff;
      border: none;
      padding: 14px;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(17, 17, 17, 0.1);
      transition: all 0.2s ease;
    }

    .ap-submit-btn:hover {
      background: #000000;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(17, 17, 17, 0.18);
    }

    /* Centered Footer */
    .ap-footer {
      background: #111111;
      color: #ffffff;
      padding: 40px;
      text-align: center;
    }

    .ap-footer-text {
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 12px;
    }

    .ap-footer-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      font-size: 0.85rem;
    }

    .ap-footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .ap-footer-link:hover {
      color: #ffffff;
    }

    /* Floating static decorative shapes behind coder panel background */
    .ap-code-char-1 {
      position: absolute;
      font-size: 16rem;
      font-family: var(--pkt-font-mono);
      font-weight: 800;
      color: rgba(2, 132, 199, 0.025);
      top: 15%;
      right: 8%;
    }

    .ap-code-char-2 {
      position: absolute;
      font-size: 14rem;
      font-family: var(--pkt-font-mono);
      font-weight: 800;
      color: rgba(17, 17, 17, 0.02);
      bottom: 20%;
      right: 25%;
    }

    /* Float and Fade Keyframe Animations */
    @keyframes ap-float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-12px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    @keyframes ap-fade {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Queries */
    @media (max-width: 1023px) {
      .ap-nav {
        padding: 0 20px;
        height: 70px;
      }

      .ap-nav-center {
        display: none; /* Hide menus on simpler view unless custom popup */
      }

      .ap-hero-section {
        flex-direction: column;
        padding-top: 70px;
        min-height: auto;
      }

      .ap-split-panel {
        width: 100%;
        min-height: auto;
        padding: 50px 30px;
        align-items: center;
        text-align: center;
      }

      .ap-designer-panel {
        background-color: #fafaf9;
        order: 2;
      }

      .ap-coder-panel {
        background-color: #ffffff;
        border-left: none;
        order: 3;
      }

      .ap-portrait-container {
        position: relative;
        top: 0;
        left: 0;
        transform: none;
        margin: 50px auto 10px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        order: 1;
        width: 250px;
        height: 250px;
        z-index: 10;
      }

      .ap-portrait-frame {
        width: 250px;
        height: 250px;
      }

      .ap-social-anchorage {
        position: relative;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 15px;
        margin: 15px auto 0 auto;
        order: 4;
      }

      .ap-hero-title-designer, .ap-hero-title-coder {
        font-size: 3rem;
        text-align: center;
        margin-bottom: 12px;
      }

      .ap-hero-subtext {
        text-align: center;
        margin: 0 auto;
      }

      .ap-about-columns {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .ap-blog-item {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .ap-header-name {
        display: none !important;
      }
    }
  </style>

  <!-- Navigation header -->
  <header class="ap-nav">
    <div class="ap-nav-left" style="display: flex; align-items: center; gap: 12px;">
      <a href="#home" class="ap-logo">Aleex STUDIO</a>
      <span style="color: #ffffff; font-weight: 700; font-size: 0.95rem; font-family: var(--pkt-font-poppins); white-space: nowrap;" class="ap-header-name">Waleed Khan</span>
    </div>
    
    <nav class="ap-nav-center">
      <a href="#home" class="ap-nav-link active">Home</a>
      <a href="#about" class="ap-nav-link">About</a>
      <a href="#featured" class="ap-nav-link">Featured</a>
      <a href="#portfolio" class="ap-nav-link">Portfolio</a>
      <a href="#blog" class="ap-nav-link">Blog</a>
      <a href="#contact" class="ap-nav-link">Contact</a>
    </nav>

    <div class="ap-nav-right">
      <span class="ap-pkt-time" id="ap-pkt-live-time">PKT 3:00:11 AM</span>
      <span class="ap-pkt-date" id="ap-pkt-live-date">Mon, May 25, 2026</span>
    </div>
  </header>

  <!-- Hero block -->
  <section id="home" class="ap-hero-section">
    
    <!-- Mid split division visual -->
    <div class="ap-mid-splitting-line"></div>

    <!-- Designer Side -->
    <div class="ap-split-panel ap-designer-panel" id="panel-designer">
      <div class="ap-designer-shapes">
        <div class="ap-art-blob-1"></div>
        <div class="ap-art-blob-2"></div>
      </div>
      
      <div class="ap-fade-in" style="position: relative; z-index: 2;">
        <h1 class="ap-hero-title-designer">designer</h1>
        <p class="ap-hero-subtext">“WordPress & WooCommerce designer specializing in custom templates & mobile-perfect layouts.”</p>
      </div>
    </div>

    <!-- Central Face Canvas Block -->
    <div class="ap-portrait-container">
      <div class="ap-portrait-frame" id="interactive-portrait-frame">
        <img class="ap-portrait-img" src="https://i.pinimg.com/736x/4f/aa/87/4faa871b0960ce4fdf2a1228318a6625.jpg" alt="Waleed Khan Portfolio" style="object-position: 50% 28%;" />
      </div>

      <!-- Social Floating Anchor links -->
      <div class="ap-social-anchorage">
        <a href="https://www.fiverr.com/sellers/aleekhan77" target="_blank" rel="noopener" class="ap-social-icon" title="Fiverr Profile">
          <i class="fa-brands fa-fiverr"></i>
        </a>
        <a href="https://wa.me/923141137917" target="_blank" rel="noopener" class="ap-social-icon" title="Message on WhatsApp">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://www.instagram.com/malikdeenkhail/" target="_blank" rel="noopener" class="ap-social-icon" title="Instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
      </div>
    </div>

    <!-- Coder Side -->
    <div class="ap-split-panel ap-coder-panel" id="panel-coder">
      <div class="ap-coder-codebg">
        <div style="font-size: 0.65rem; font-family: monospace; white-space: pre-wrap; text-align: left; opacity: 0.7;">
          import &#123; createTheme &#125; from '@styles/theme';
          const portfolio = &#123;
            owner: "Waleed Khan",
            skills: ["WordPress", "eCommerce", "PHP", "SEO"],
            buildSuite: () => &#123; return "Clean WordPress Integration" &#125;
          &#125;;
        </div>
      </div>

      <div class="ap-code-char-1">&#123;&#125;</div>
      <div class="ap-code-char-2">&lt;/&gt;</div>

      <div class="ap-fade-in" style="position: relative; z-index: 2;">
        <h1 class="ap-hero-title-coder">&lt;coder&gt;</h1>
        <p class="ap-hero-subtext">“Front end developer who writes clean, elegant and efficient code.”</p>
      </div>
    </div>

  </section>

  <!-- About section -->
  <section id="about" class="ap-section ap-section-alt">
    <div class="ap-section-container">
      <div class="ap-section-header">
        <span class="ap-section-tag">The Dual Identity</span>
        <h2 class="ap-section-title">About Me</h2>
      </div>

      <div class="ap-about-columns">
        <div class="ap-about-col ap-about-col-designer">
          <h3 class="ap-about-col-title" style="color: #ea580c;">As a Designer</h3>
          <p class="ap-about-desc">
            I craft seamless interactive wireframes and premium UI design libraries. My goal is to synthesize clarity, gorgeous whitespace, and intentional typography to tell compelling stories that captivate audiences.
          </p>
          <div class="ap-skills-list">
            <span class="ap-skill-badge">UX/UI Design</span>
            <span class="ap-skill-badge">Figma</span>
            <span class="ap-skill-badge">Design Systems</span>
            <span class="ap-skill-badge">Interaction Architecture</span>
            <span class="ap-skill-badge">Color Theory</span>
          </div>
        </div>

        <div class="ap-about-col ap-about-col-coder">
          <h3 class="ap-about-col-title" style="color: #0284c7;">As a Developer</h3>
          <p class="ap-about-desc">
            I build performant interactive layouts using pure HTML/CSS, React, TypeScript, and modern bundlers. I focus on clean markup, excellent accessibility, smooth keyframe animations, and solid pixel-precision.
          </p>
          <div class="ap-skills-list">
            <span class="ap-skill-badge">React & Next.js</span>
            <span class="ap-skill-badge">TypeScript</span>
            <span class="ap-skill-badge">CSS Grid/Flexbox</span>
            <span class="ap-skill-badge">Web Animations API</span>
            <span class="ap-skill-badge">WordPress Integration</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured / Highlights section -->
  <section id="featured" class="ap-section">
    <div class="ap-section-container">
      <div class="ap-section-header">
        <span class="ap-section-tag">My Pride & Joy</span>
        <h2 class="ap-section-title">Featured Creations</h2>
      </div>

      <div class="ap-portfolio-grid">
        <!-- Project Card 1 (Designer focus) -->
        <div class="ap-portfolio-card">
          <div class="ap-card-img-wrapper">
            <div class="ap-card-fallback-vector">
              <i class="fa-solid fa-bezier-curve" style="font-size: 3rem; margin-bottom: 12px; color: #ea580c; opacity: 0.8;"></i>
              <span style="font-size: 0.85rem; font-weight: 500;">Premium Design Framework</span>
            </div>
            <span class="ap-card-badge">DESIGN</span>
          </div>
          <div class="ap-card-body">
            <div class="ap-card-info">
              <h3>Vanguard UI System</h3>
              <p>A comprehensive visual framework of responsive interface atoms and molecule components optimized for rapid corporate discovery flows.</p>
            </div>
            <div class="ap-card-footer">
              <div class="ap-card-tags">
                <span class="ap-card-tag">#Figma</span>
                <span class="ap-card-tag">#UX</span>
              </div>
              <a href="#" class="ap-card-btn">View Deck <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>

        <!-- Project Card 2 (Coder focus) -->
        <div class="ap-portfolio-card">
          <div class="ap-card-img-wrapper">
            <div class="ap-card-fallback-vector">
              <i class="fa-solid fa-terminal" style="font-size: 3rem; margin-bottom: 12px; color: #0284c7; opacity: 0.8;"></i>
              <span style="font-size: 0.85rem; font-weight: 500;">Custom Web Engine</span>
            </div>
            <span class="ap-card-badge">CODE</span>
          </div>
          <div class="ap-card-body">
            <div class="ap-card-info">
              <h3>Aurora State Manager</h3>
              <p>A high-performance sub-millisecond reactive state library compiled in pure TypeScript for asynchronous node applications.</p>
            </div>
            <div class="ap-card-footer">
              <div class="ap-card-tags">
                <span class="ap-card-tag">#TypeScript</span>
                <span class="ap-card-tag">#NPM</span>
              </div>
              <a href="#" class="ap-card-btn">Explore Engine <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Complete Portfolio visual grid -->
  <section id="portfolio" class="ap-section ap-section-alt">
    <div class="ap-section-container">
      <div class="ap-section-header">
        <span class="ap-section-tag">Case Studies</span>
        <h2 class="ap-section-title">Selected Works</h2>
      </div>

      <div class="ap-portfolio-grid">
        <!-- Project Card 3: Mobile Experience -->
        <div class="ap-portfolio-card">
          <div class="ap-card-img-wrapper">
            <div class="ap-card-fallback-vector">
              <i class="fa-solid fa-mobile-screen-button" style="font-size: 3rem; margin-bottom: 12px; color: #64748b; opacity: 0.8;"></i>
              <span style="font-size: 0.85rem; font-weight: 500;">iOS Productivity App</span>
            </div>
            <span class="ap-card-badge">Full-Stack</span>
          </div>
          <div class="ap-card-body">
            <div class="ap-card-info">
              <h3>Zenith Focus Tracker</h3>
              <p>An intricate mobile companion application promoting focus loops. Designed with gorgeous minimal elements and coded using React Native.</p>
            </div>
            <div class="ap-card-footer">
              <div class="ap-card-tags">
                <span class="ap-card-tag">#UX</span>
                <span class="ap-card-tag">#Native</span>
              </div>
              <a href="#" class="ap-card-btn">Study Case <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>

        <!-- Project Card 4: Web Application -->
        <div class="ap-portfolio-card">
          <div class="ap-card-img-wrapper">
            <div class="ap-card-fallback-vector">
              <i class="fa-solid fa-globe" style="font-size: 3rem; margin-bottom: 12px; color: #64748b; opacity: 0.8;"></i>
              <span style="font-size: 0.85rem; font-weight: 500;">Collaborative Whiteboard</span>
            </div>
            <span class="ap-card-badge">Web tool</span>
          </div>
          <div class="ap-card-body">
            <div class="ap-card-info">
              <h3>PixelSync Canvas</h3>
              <p>An infinitely scaleable multiplayer design board facilitating rich workspace synchronization over highly optimized WebSocket channels.</p>
            </div>
            <div class="ap-card-footer">
              <div class="ap-card-tags">
                <span class="ap-card-tag">#Sockets</span>
                <span class="ap-card-tag">#HTML5</span>
              </div>
              <a href="#" class="ap-card-btn">Launch Live <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial Blog list -->
  <section id="blog" class="ap-section">
    <div class="ap-section-container">
      <div class="ap-section-header">
        <span class="ap-section-tag">Philosophical Musings</span>
        <h2 class="ap-section-title">From The Blog</h2>
      </div>

      <div class="ap-blog-list">
        <article class="ap-blog-item">
          <div class="ap-blog-meta">May 24, 2026</div>
          <div class="ap-blog-content">
            <a href="#" style="text-decoration: none;"><h3 class="ap-blog-title">The Symbiotic Symphony of Design and Development</h3></a>
            <p>How crossing the physical boundaries of sketching and typing helps engineers deploy robust, beautiful widgets that delight consumers.</p>
          </div>
        </article>

        <article class="ap-blog-item">
          <div class="ap-blog-meta">April 12, 2026</div>
          <div class="ap-blog-content">
            <a href="#" style="text-decoration: none;"><h3 class="ap-blog-title">Designing For The Terminal: A Monospaced Journey</h3></a>
            <p>Exploring pixel ergonomics, optimal contrast requirements, and functional aesthetic spacing in minimal layouts for tech engineers.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Centered contact form -->
  <section id="contact" class="ap-section ap-section-alt">
    <div class="ap-section-container">
      <div class="ap-section-header">
        <span class="ap-section-tag">Initiate Communication</span>
        <h2 class="ap-section-title">Get In Touch</h2>
      </div>

      <div class="ap-contact-wrapper">
        <form id="ap-custom-contact-form" onsubmit="event.preventDefault(); alert('Message dispatched! Thank you for choosing to connect with Waleed Khan.');">
          <div class="ap-form-group">
            <label for="ap-name">Your Full Name</label>
            <input type="text" id="ap-name" class="ap-textbox" required placeholder="Waleed Khan" />
          </div>
          
          <div class="ap-form-group">
            <label for="ap-email">Your Email Address</label>
            <input type="email" id="ap-email" class="ap-textbox" required placeholder="yourname@example.com" />
          </div>

          <div class="ap-form-group">
            <label for="ap-msg">Your Creative Project Concept</label>
            <textarea id="ap-msg" class="ap-textbox" style="min-height: 140px; resize: vertical;" required placeholder="Let's build a spectacular portfolio homepage split between code and visual layouts..."></textarea>
          </div>

          <button type="submit" class="ap-submit-btn">
            Send Message <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Complete centered footer -->
  <footer class="ap-footer">
    <p class="ap-footer-text">© 2026 AP. All rights reserved.</p>
    <div class="ap-footer-links">
      <a href="#" class="ap-footer-link">Privacy policy</a>
      <span style="color: rgba(255,255,255,0.25);">|</span>
      <a href="#" class="ap-footer-link">Privacy policy</a>
    </div>
  </footer>

  <script>
    // Live Pakistan time tick updates (Asia/Karachi UTC+5)
    (function() {
      function refreshPktTime() {
        const timeEl = document.getElementById('ap-pkt-live-time');
        const dateEl = document.getElementById('ap-pkt-live-date');
        if (!timeEl || !dateEl) return;

        try {
          const now = new Date();
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Karachi',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          const dateStr = now.toLocaleDateString('en-US', {
            timeZone: 'Asia/Karachi',
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          timeEl.textContent = 'PKT ' + timeStr;
          dateEl.textContent = dateStr;
        } catch (e) {
          const now = new Date();
          timeEl.textContent = 'PKT ' + now.toLocaleTimeString();
          dateEl.textContent = now.toDateString();
        }
      }
      
      refreshPktTime();
      setInterval(refreshPktTime, 1000);
    })();

    // Splitting Panel Mouse Move Parallax Effects on Desktop
    (function() {
      const rootEl = document.getElementById('ap-portfolio-wrapper');
      const portraitFrame = document.getElementById('interactive-portrait-frame');
      const designerPanel = document.getElementById('panel-designer');
      const coderPanel = document.getElementById('panel-coder');

      if (!rootEl || !portraitFrame) return;

      function checkInteractive() {
        return window.innerWidth >= 1024;
      }

      window.addEventListener('mousemove', function(e) {
        if (!checkInteractive()) {
          // Remove hovering indicators and reset rotations on resizing down
          rootEl.classList.remove('hovering-left');
          rootEl.classList.remove('hovering-right');
          portraitFrame.style.transform = 'none';
          return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Track coordinate factors (-1 to 1)
        const mouseXFactor = (e.clientX - width / 2) / (width / 2);
        const mouseYFactor = (e.clientY - height / 2) / (height / 2);

        // Class toggles for beautiful design theme highlights
        if (mouseXFactor < -0.1) {
          rootEl.classList.add('hovering-left');
          rootEl.classList.remove('hovering-right');
        } else if (mouseXFactor > 0.1) {
          rootEl.classList.add('hovering-right');
          rootEl.classList.remove('hovering-left');
        } else {
          rootEl.classList.remove('hovering-left');
          rootEl.classList.remove('hovering-right');
        }

        // Apply smooth 3D tilted dynamic properties to central portrait
        const rotateY = mouseXFactor * 16;
        const rotateX = -mouseYFactor * 16;
        portraitFrame.style.transform = 'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) translateZ(10px)';

        // Subtle interactive shift code snippets or shapes opacities
        const dOpacity = Math.max(0.4, 1 - (mouseXFactor + 1) / 2);
        const cOpacity = Math.max(0.4, (mouseXFactor + 1) / 2);
        rootEl.style.setProperty('--designer-shapes-opacity', dOpacity);
        rootEl.style.setProperty('--coder-code-opacity', cOpacity);
      });

      window.addEventListener('mouseleave', function() {
        rootEl.classList.remove('hovering-left');
        rootEl.classList.remove('hovering-right');
        portraitFrame.style.transform = 'none';
        rootEl.style.setProperty('--designer-shapes-opacity', '0.95');
        rootEl.style.setProperty('--coder-code-opacity', '0.95');
      });

      // Interactive simple navigation indicators active highlights
      const links = document.querySelectorAll('.ap-nav-link');
      links.forEach(function(lnk) {
        lnk.addEventListener('click', function(e) {
          links.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        });
      });
    })();
  </script>
</div>
<!-- END ADHAM DANNAWAY INSPIRED PORTFOLIO BLOCK -->`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wordpressHTMLBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`min-h-screen bg-white text-zinc-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden relative font-sans ${
        mousePos.x < 0.45 ? 'hovering-left' : mousePos.x > 0.55 ? 'hovering-right' : ''
      }`}
      style={{
        // Define clean custom CSS variables for custom blended behaviors
        ['--designer-shapes-opacity' as any]: dWeight,
        ['--coder-code-opacity' as any]: cWeight
      }}
    >
      
      {/* 1. FIXED GLASSMORPHIC TOP NAVBAR */}
      <nav id="nav-header" className="fixed top-0 left-0 w-full h-[75px] bg-zinc-950/85 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-6 lg:px-12 z-50">
        <div className="flex items-center gap-3">
          <a href="#home" className="px-4.5 h-[44px] rounded-full bg-white text-black flex items-center justify-center font-black font-poppins text-xs tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] select-none uppercase">
            Aleex STUDIO
          </a>
          <span className="hidden sm:inline-block text-white font-poppins text-sm font-extrabold tracking-tight select-none">
            Waleed Khan
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'About', 'Featured', 'Portfolio', 'Blog', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider relative py-1 group transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:transition-all hover:after:w-full"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Live Pakistan standard time widget */}
        <div className="flex flex-col items-end pr-1 sm:pr-0 border-l border-white/10 pl-4 font-mono text-[11px] leading-tight select-none">
          <span className="text-sky-400 font-semibold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
            {currentTime ? `PKT ${currentTime}` : 'PKT Loading...'}
          </span>
          <span className="text-zinc-500 font-medium text-[10px] mt-0.5">
            {currentDate || 'May 25, 2026'}
          </span>
        </div>
      </nav>

      {/* 2. HERO SPLIT SECTION */}
      <section 
        id="home" 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-screen flex flex-col lg:flex-row pt-[75px] overflow-hidden bg-white select-none"
      >
        {/* Subtle decorative split line */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-zinc-200/50 via-zinc-100 to-transparent -translate-x-1/2 z-20 pointer-events-none" />

        {/* LEFT SIDE: DESIGNER */}
        <div 
          className={`w-full lg:w-1/2 min-h-[40vh] lg:min-h-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-8 lg:px-[10%] py-12 relative z-10 transition-colors duration-500 ${
            mousePos.x < 0.45 ? 'bg-amber-50/20' : 'bg-neutral-50/80'
          }`}
        >
          {/* Artistic glowing blobs */}
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300"
            style={{
              opacity: dWeight,
              transform: `translate(${leftShapeX}px, ${leftShapeY}px)`
            }}
          >
            <div className="absolute top-[20%] left-[10%] w-[260px] h-[260px] rounded-full bg-orange-200/20 blur-[40px]" />
            <div className="absolute bottom-[20%] left-[20%] w-[220px] h-[220px] rounded-full bg-rose-200/25 blur-[45px]" />
          </div>

          <div className="relative z-10 space-y-4 animate-fade-in">
            <h1 
              style={{
                color: mousePos.x < 0.45 ? '#ea580c' : '#18181b',
                transform: mousePos.x < 0.45 ? 'translateX(10px) scale(1.01)' : 'none'
              }}
              className="font-poppins text-7xl sm:text-8xl lg:text-[7.5rem] font-extrabold leading-[0.9] tracking-tighter lowercase select-none transition-all duration-300"
            >
              designer
            </h1>
            <p className="font-sans text-lg sm:text-xl font-light text-zinc-500 max-w-[440px] leading-relaxed select-none">
              “WordPress & WooCommerce designer specializing in custom templates & mobile-perfect layouts.”
            </p>
          </div>
        </div>

        {/* CENTER SPLIT FACE PORTRAIT & SOCIAL ANCHORAGE */}
        <div 
          className="absolute top-[42%] lg:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none ap-portrait-entry-anim"
          style={{
            perspective: '1000px'
          }}
        >
          <div 
            className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] relative transition-transform duration-100 ease-out"
            style={{
              transform: isMobile ? 'none' : `rotateY(${portraitRotateY}deg) rotateX(${portraitRotateX}deg) translate3d(${portraitTranslateX}px, ${portraitTranslateY}px, 20px)`
            }}
          >
            {/* The Outer Rotating Frame */}
            <div 
              className={`w-full h-full rounded-full bg-white p-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.06),_0_1px_3px_rgba(0,0,0,0.01),_inset_0_0_0_1px_rgba(0,0,0,0.04)] hover:scale-105 active:scale-100 animate-bounce-subtle pointer-events-auto transition-all ${
                mousePos.x < 0.45 ? 'shadow-orange-500/10' : mousePos.x > 0.55 ? 'shadow-sky-500/10' : ''
              }`}
            >
              <img 
                src="https://i.pinimg.com/736x/4f/aa/87/4faa871b0960ce4fdf2a1228318a6625.jpg" 
                alt="Waleed Khan Portfolio" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full select-none"
                style={{ objectPosition: '50% 28%' }}
              />
            </div>

            {/* Social icons nested positioned absolutely above/right of visual portrait */}
            <div className="absolute top-[-40px] right-[-25px] flex flex-col gap-3 pointer-events-auto">
              {[
                { breed: 'fa-brands', icon: 'fa-fiverr', url: 'https://www.fiverr.com/sellers/aleekhan77', title: 'Fiverr Profile' },
                { breed: 'fa-brands', icon: 'fa-whatsapp', url: 'https://wa.me/923141137917', title: 'Message on WhatsApp' },
                { breed: 'fa-brands', icon: 'fa-instagram', url: 'https://www.instagram.com/malikdeenkhail/', title: 'Instagram' }
              ].map((item, idx) => (
                <a 
                  key={idx}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title={item.title}
                  className="w-[44px] h-[44px] rounded-full bg-white border border-zinc-100 text-zinc-900 hover:text-white hover:bg-zinc-900 flex items-center justify-center shadow-md text-sm hover:scale-115 hover:-translate-y-1 transition-all"
                >
                  <i className={`${item.breed} ${item.icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CODER */}
        <div 
          className={`w-full lg:w-1/2 min-h-[40vh] lg:min-h-0 flex flex-col justify-center items-center lg:items-end text-center lg:text-right px-8 lg:px-[10%] py-12 relative z-10 transition-colors duration-500 ${
            mousePos.x > 0.55 ? 'bg-sky-50/15' : 'bg-white'
          }`}
        >
          {/* Faded Code background overlay */}
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-[11px] leading-relaxed text-zinc-400/5 p-12 transition-all duration-300"
            style={{
              opacity: cWeight,
              transform: `translate(${rightCodeX}px, ${rightCodeY}px)`
            }}
          >
            <div className="text-left w-full h-full max-w-sm ml-auto select-none space-y-1">
              <p className="text-teal-500/20">{`import { initializeApp } from "firebase/app";`}</p>
              <p className="text-zinc-500/10">{`const config = { apiKey: process.env.KEY };`}</p>
              <p className="text-zinc-500/10">{`export class PortfolioEngine extends Component {`}</p>
              <p className="text-zinc-500/10">{`  constructor(props) { super(props); }`}</p>
              <p className="text-orange-500/10">{`  renderCodeSnippet() {`}</p>
              <p className="text-sky-500/20">{`    return <CodeBlock language="typescript" />;`}</p>
              <p className="text-zinc-500/10">{`  }`}</p>
              <p className="text-zinc-500/10">{`}`}</p>
            </div>
          </div>

          {/* Symmetrical brackets */}
          <div className="absolute right-12 bottom-12 font-mono text-zinc-950/2 font-bold text-[14rem] pointer-events-none select-none">
            {`</>`}
          </div>

          <div className="relative z-10 space-y-4 animate-fade-in-delayed">
            <h1 
              style={{
                color: mousePos.x > 0.55 ? '#0284c7' : '#18181b',
                transform: mousePos.x > 0.55 ? 'translateX(-10px) scale(1.01)' : 'none'
              }}
              className="font-poppins text-7xl sm:text-8xl lg:text-[7.5rem] font-extrabold leading-[0.9] tracking-tighter select-none transition-all duration-300"
            >
              &lt;coder&gt;
            </h1>
            <p className="font-mono text-base sm:text-lg font-light text-zinc-500 max-w-[440px] leading-relaxed select-none">
              “WordPress expert building speed-optimized online stores & custom plugin solutions.”
            </p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-24 px-6 lg:px-12 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[12px] font-bold text-sky-600 uppercase tracking-widest block">The Dual Paradigm</span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
              About Me
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-100 border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5">
              <h3 className="font-poppins text-xl font-bold text-orange-600">Web Designer</h3>
              <p className="text-zinc-600 font-sans leading-relaxed text-[15px]">
                Eight years building high-converting WordPress & WooCommerce layouts. I specialize in elegant custom design, mobile-perfect rendering, and fast loading layouts that turn visitors into active clients.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Web Designer', 'UI/UX Design', 'Figma', 'WooCommerce Styling', 'Elementor Work', 'Typography'].map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-1 bg-zinc-50 border border-zinc-100 text-zinc-650 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-100 border-l-4 border-l-sky-500 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-5">
              <h3 className="font-poppins text-xl font-bold text-sky-600">Web Developer</h3>
              <p className="text-zinc-650 font-mono leading-relaxed text-[14px]">
                Hundreds of projects delivered with 5★ reviews on Fiverr. I write clean custom plugins, bespoke child themes, custom integrations, speed boosts (Core Web Vitals), and secure migrations.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Web Developer', 'WordPress Customization', 'WooCommerce Stores', 'Custom Plugins', 'Core Web Vitals', 'On-page SEO'].map((tag) => (
                  <span key={tag} className="text-[11px] font-mono px-2.5 py-1 bg-zinc-50 border border-zinc-100 text-zinc-600 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED WORK */}
      <section id="featured" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[12px] font-bold text-orange-600 uppercase tracking-widest block">Core Masterpieces</span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
              Featured Creations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white border border-zinc-150 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-350 hover:-translate-y-1">
              <div className="h-[230px] bg-zinc-50 flex flex-col items-center justify-center p-6 border-b border-zinc-100 relative">
                <Compass className="w-16 h-16 text-orange-600 mb-3 animate-spin-slow-subtlest" />
                <span className="text-[13px] font-semibold text-zinc-400">Custom Styled Storefront Design</span>
                <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-950 text-white rounded">
                  WooCommerce
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-poppins text-lg font-bold text-zinc-950">Luxury Brands WooCommerce Setup</h3>
                <p className="text-zinc-550 text-sm leading-relaxed">
                  A high-performance online store complete with elegant product sliders, simplified checkout flows, automatic sales tax, and shipping calculations.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-mono text-zinc-450">#WordPress #WooCommerce #Sales_UX</span>
                  <a href="#portfolio" className="text-xs font-semibold flex items-center gap-1 group-hover:text-orange-500 transition-colors">
                    Review specs <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-zinc-150 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-350 hover:-translate-y-1">
              <div className="h-[230px] bg-zinc-50 flex flex-col items-center justify-center p-6 border-b border-zinc-100 relative">
                <Cpu className="w-16 h-16 text-sky-600 mb-3 animate-pulse" />
                <span className="text-[13px] font-semibold text-zinc-400">Bespoke Functions & Integrations</span>
                <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-950 text-white rounded">
                  Development
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-poppins text-lg font-bold text-zinc-950">Custom Filter Engine WordPress Plugin</h3>
                <p className="text-zinc-550 text-sm leading-relaxed">
                  A custom WordPress plugin delivering complex AJAX search parameters and category filtering with sub-millisecond query caching.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-mono text-zinc-450">#PHP #CustomPlugins #MySQL</span>
                  <a href="#portfolio" className="text-xs font-semibold flex items-center gap-1 group-hover:text-sky-500 transition-colors">
                    Explore specs <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SELECT WORKS / PORTFOLIO GRAPHICS */}
      <section id="portfolio" className="py-24 px-6 lg:px-12 bg-zinc-50 border-t border-zinc-150">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest block">Selected Works</span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
              Dynamic Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-[180px] bg-zinc-50 flex flex-col items-center justify-center border-b border-zinc-100">
                <Smartphone className="w-12 h-12 text-zinc-450 mb-2" />
                <span className="text-xs font-semibold text-zinc-400">Core Web Vitals Optimization</span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-poppins text-md font-bold text-zinc-950">Aurora PageSpeed Accelerant</h3>
                <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
                  Optimized server performance, modern script deferrals, and image minification systems to elevate performance scores to 95+ on Google PageSpeed.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] font-mono text-sky-500">#PageSpeed #CoreWebVitals</span>
                  <span className="text-xs font-semibold hover:text-orange-500 cursor-pointer flex items-center gap-1">
                    Study metrics <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-[180px] bg-zinc-50 flex flex-col items-center justify-center border-b border-zinc-100">
                <Layers className="w-12 h-12 text-zinc-450 mb-2" />
                <span className="text-xs font-semibold text-zinc-400">Theme & Host Migration Systems</span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-poppins text-md font-bold text-zinc-950">Zero-Downtime Host Transfer</h3>
                <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed">
                  Seamlessly migrated heavy databases, media archives, and configuration environments to new high-performance hosts with active firewall setup.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] font-mono text-orange-500">#Migration #CareMaintenance</span>
                  <span className="text-xs font-semibold hover:text-sky-500 cursor-pointer flex items-center gap-1">
                    Check details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TYPOGRAPHIC BLOG COLUMN */}
      <section id="blog" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest block">Philosophical Writing</span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
              Selected Writings
            </h2>
          </div>

          <div className="divide-y divide-zinc-100">
            {[
              { date: 'May 24, 2026', title: 'The Symbiotic Symphony of Design and Development', excerpt: 'How crossing the physical boundaries of sketching and typing helps engineers deploy robust, beautiful widgets that delight consumers.' },
              { date: 'Apr 12, 2026', title: 'Designing For The Terminal: A Monospaced Journey', excerpt: 'Exploring pixel ergonomics, optimal contrast requirements, and functional aesthetic spacing in minimal layouts for tech engineers.' }
            ].map((post, idx) => (
              <article key={idx} className="py-8 group cursor-pointer block grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline">
                <span className="font-mono text-xs text-zinc-400">{post.date}</span>
                <div className="md:col-span-3 space-y-2">
                  <h3 className="font-poppins text-lg font-bold text-zinc-950 group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-550 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MINIMAL CONTACT FORM */}
      <section id="contact" className="py-24 px-6 lg:px-12 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest block">Initiate Conversation</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Get In Touch
            </h2>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message dispatched! Thank you for choosing to connect with Waleed Khan.');
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Full Name</label>
              <input id="name-input" type="text" required placeholder="Waleed Khan" className="w-full p-3 border border-zinc-350 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 text-sm font-sans" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Email Address</label>
              <input id="email-input" type="email" required placeholder="yourname@example.com" className="w-full p-3 border border-zinc-350 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 text-sm font-sans" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="msg-input" className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Message / Idea Description</label>
              <textarea id="msg-input" rows={4} required placeholder="Let's build a custom WordPress eCommerce store or high-converting landing page..." className="w-full p-3 border border-zinc-350 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 text-sm font-sans resize-y" />
            </div>

            <button type="submit" className="w-full py-3.5 bg-zinc-950 text-white font-bold rounded-lg text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]">
              Send message <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 8. CENTERED FOOTER */}
      <footer className="bg-zinc-950 text-white py-12 px-6 text-center space-y-4 select-none">
        <p className="text-xs text-zinc-500 font-medium">© 2026 Waleed Khan. All rights reserved.</p>
        <div className="flex justify-center items-center gap-4 text-xs font-semibold text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
          <span className="text-zinc-805">|</span>
          <a href="#" className="hover:text-white transition-colors">Terms of service</a>
        </div>
      </footer>

    </div>
  );
}
