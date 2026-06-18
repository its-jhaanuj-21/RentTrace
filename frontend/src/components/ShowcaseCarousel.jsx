import React, { useState, useEffect } from 'react';
import loginLap from '../assets/login-lap.png';
import loginMob from '../assets/login-mob.png';
import dashboardLap from '../assets/dashboard-lap.png';
import dashboardMob from '../assets/dashboard-mob.png';
import histLap from '../assets/hist-lap.png';
import histMob from '../assets/hist-mob.png';

export default function ShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const wrapperRef = React.useRef(null);

  const laptopSlides = [dashboardLap, histLap, loginLap];
  const mobileSlides = [dashboardMob, histMob, loginMob];

  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle 3D parallax effect
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % laptopSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [laptopSlides.length]);

  return (
    <div
      className="showcase-devices-wrapper"
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--rot-x': `${rotation.x}deg`,
        '--rot-y': `${rotation.y}deg`,
        '--trans-speed': rotation.x === 0 && rotation.y === 0 ? '0.5s' : '0.1s'
      }}
    >
      <style>{`
        .showcase-devices-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem 0;
          position: relative;
          perspective: 1200px;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Laptop 3D CSS Device */
        .laptop-3d-frame {
          position: relative;
          width: 750px;
          height: 390px;
          z-index: 1;
          margin-right: 120px;
          transform-style: preserve-3d;
          /* Base rotation: tilt back a bit so we look down at the keyboard */
          transform: rotateX(calc(15deg + var(--rot-x, 0deg))) rotateY(var(--rot-y, 0deg));
          transition: transform var(--trans-speed, 0.5s) ease-out;
        }

        .laptop-lid {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #0f172a;
          border-radius: 20px 20px 0 0;
          border: 14px solid #0f172a;
          border-bottom-width: 32px;
          box-shadow: inset 0 0 0 1px #334155, 0 -2px 10px rgba(0,0,0,0.5);
          transform-origin: bottom center;
          /* Open the lid back */
          transform: rotateX(-10deg);
          transform-style: preserve-3d;
          z-index: 2;
        }

        .laptop-screen-content {
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
          position: relative;
          border-radius: 4px;
        }

        .laptop-logo-text {
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          color: #334155;
          font-size: 0.7rem;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .laptop-base-3d {
          position: absolute;
          top: 100%;
          left: -10px;
          width: calc(100% + 20px);
          height: 320px;
          background: linear-gradient(to bottom, #1e293b, #0f172a);
          transform-origin: top center;
          /* Rotate the base forward so it lays flat towards the user */
          transform: rotateX(75deg);
          border-radius: 5px 5px 24px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 15px;
          transform-style: preserve-3d;
          box-shadow: 0 40px 60px rgba(0,0,0,0.8);
          z-index: 1;
          border: 1px solid #334155;
          border-top: none;
        }

        .laptop-keyboard {
          width: 85%;
          height: 160px;
          background: #0b1120;
          border-radius: 8px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1);
          display: grid;
          grid-template-rows: repeat(6, 1fr);
          gap: 4px;
          padding: 6px;
          transform: translateZ(1px);
        }

        .key-row {
          display: flex;
          gap: 3px;
        }
        
        .key {
          flex: 1;
          background: linear-gradient(to bottom, #334155, #1e293b);
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.9);
          border-bottom: 2px solid #0f172a;
        }
        
        .key-space {
          flex: 5.5;
        }

        .laptop-trackpad {
          width: 140px;
          height: 90px;
          background: #1e293b;
          border-radius: 6px;
          margin-top: 20px;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.05);
          transform: translateZ(0.5px);
        }

        .laptop-edge {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 14px;
          background: #090e17;
          border-radius: 0 0 24px 24px;
          transform-origin: top center;
          transform: rotateX(-90deg);
          display: flex;
          justify-content: center;
          border: 1px solid #1e293b;
          border-top: none;
        }

        .laptop-lip-indent {
          width: 100px;
          height: 4px;
          background: #000;
          margin-top: 2px;
          border-radius: 0 0 4px 4px;
        }

        /* Mobile CSS Device */
        .mobile-frame {
          position: absolute;
          right: -80px;
          bottom: 20px;
          width: 260px;
          height: 484px;
          background: #000;
          border-radius: 44px;
          border: 4px solid #cbd5e1;
          padding: 8px;
          box-sizing: border-box;
          box-shadow: 
            inset 0 0 0 2px #1e293b, 
            -15px 20px 40px rgba(0,0,0,0.8), 
            -3px 4px 0 2px #64748b;
          z-index: 10;
          transform-style: preserve-3d;
          transform: rotateX(calc(15deg + var(--rot-x, 0deg) * 1.5)) rotateY(calc(var(--rot-y, 0deg) * 1.5)) rotate(-2deg);
          transition: transform var(--trans-speed, 0.5s) ease-out;
        }

        .mobile-btn-mute {
          position: absolute;
          top: 80px;
          left: -7px;
          width: 3px;
          height: 24px;
          background: #cbd5e1;
          border-radius: 3px 0 0 3px;
          box-shadow: inset 1px 0 1px #f1f5f9;
        }

        .mobile-btn-vol-up {
          position: absolute;
          top: 125px;
          left: -7px;
          width: 3px;
          height: 46px;
          background: #cbd5e1;
          border-radius: 3px 0 0 3px;
          box-shadow: inset 1px 0 1px #f1f5f9;
        }

        .mobile-btn-vol-down {
          position: absolute;
          top: 185px;
          left: -7px;
          width: 3px;
          height: 46px;
          background: #cbd5e1;
          border-radius: 3px 0 0 3px;
          box-shadow: inset 1px 0 1px #f1f5f9;
        }

        .mobile-btn-power {
          position: absolute;
          top: 145px;
          right: -7px;
          width: 3px;
          height: 70px;
          background: #cbd5e1;
          border-radius: 0 3px 3px 0;
          box-shadow: inset -1px 0 1px #f1f5f9;
        }

        .mobile-screen-content {
          width: 100%;
          height: 100%;
          background: #0f172a;
          overflow: hidden;
          position: relative;
          border-radius: 34px;
        }

        /* Carousel Inner */
        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .carousel-slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        /* Responsive Layout Overrides */
        @media (max-width: 1200px) {
          .laptop-3d-frame {
            width: 600px;
            height: 320px;
          }
          .laptop-base-3d {
            height: 250px;
          }
          .laptop-keyboard {
            height: 130px;
          }
          .laptop-trackpad {
            height: 60px;
          }
          .mobile-frame {
            right: -20px;
            bottom: 20px;
            width: 240px;
            height: 445px;
          }
        }

        @media (max-width: 968px) {
          .laptop-3d-frame {
            width: 480px;
            height: 262px;
          }
          .laptop-base-3d {
            height: 200px;
          }
          .laptop-keyboard {
            height: 100px;
          }
          .laptop-trackpad {
            height: 45px;
          }
          .mobile-frame {
            right: -10px;
            bottom: 20px;
            width: 200px;
            height: 371px;
            border-radius: 36px;
            padding: 6px;
          }
          .mobile-screen-content {
            border-radius: 28px;
          }
        }

        @media (max-width: 768px) {
          .showcase-devices-wrapper {
            flex-direction: column;
            gap: 4rem;
            align-items: center;
            padding: 1rem 0;
          }
          .laptop-3d-frame {
            display: none !important;
          }
          .laptop-base-3d {
            height: 38vw;
            border-radius: 4px 4px 16px 16px;
          }
          .laptop-lid {
            border-width: 10px;
            border-bottom-width: 20px;
            border-radius: 12px 12px 0 0;
          }
          .laptop-keyboard {
            height: 19vw;
          }
          .laptop-trackpad {
            width: 20vw;
            height: 12vw;
            margin-top: 3vw;
          }
          .laptop-edge {
            height: 2vw;
          }
          .laptop-lip-indent {
            width: 15vw;
          }
          .mobile-frame {
            position: relative;
            right: 0;
            bottom: 0;
            margin: 0 auto;
            margin-top: 1rem;
            width: 260px;
            height: 484px;
            border-width: 4px;
            padding: 8px;
            border-radius: 44px;
            transform: none !important;
          }
          .mobile-screen-content {
            border-radius: 30px;
          }
        }
      `}</style>

      {/* Laptop Device Mockup */}
      <div className="laptop-3d-frame">
        <div className="laptop-lid">
          <div className="laptop-screen-content">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {laptopSlides.map((slide, i) => (
                <div key={i} className="carousel-slide">
                  <img src={slide} alt={`Laptop App UI Slide ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="laptop-logo-text">RentTrace</div>
        </div>

        <div className="laptop-base-3d">
          <div className="laptop-keyboard">
            {[1, 2, 3, 4, 5, 6].map(row => (
              <div key={row} className="key-row">
                {Array.from({ length: row === 6 ? 7 : 14 }).map((_, col) => (
                  <div key={`${row}-${col}`} className={`key ${row === 6 && col === 3 ? 'key-space' : ''}`}></div>
                ))}
              </div>
            ))}
          </div>
          <div className="laptop-trackpad"></div>
          <div className="laptop-edge">
            <div className="laptop-lip-indent"></div>
          </div>
        </div>
      </div>

      {/* Mobile Device Mockup */}
      <div className="mobile-frame">
        <div className="mobile-btn-mute"></div>
        <div className="mobile-btn-vol-up"></div>
        <div className="mobile-btn-vol-down"></div>
        <div className="mobile-btn-power"></div>
        <div className="mobile-screen-content">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mobileSlides.map((slide, i) => (
              <div key={i} className="carousel-slide">
                {/* Mobile view uses dedicated mobile screenshots */}
                <img src={slide} alt={`Mobile App UI Slide ${i + 1}`} style={{ objectFit: 'cover', objectPosition: 'center top' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
