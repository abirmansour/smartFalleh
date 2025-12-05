import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./AnimatedHeader.css";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";

const slides = [
  { image: img1, text: "Gérez facilement les demandes des agriculteurs." },
  { image: img2, text: "Ajoutez et suivez les produits et aliments du bétail." },
  { image: img3, text: "Collaborez avec les jurys et les responsables." },
  { image: img4, text: "Administrez tout le système agricole en un seul endroit." },
];



export default function AnimatedHeader() {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const textRef = useRef([]);

  // reset refs
  slidesRef.current = [];
  textRef.current = [];

  const tl = useRef();
  
  const pauseOnHover = () => {
    if (tl.current) tl.current.pause();
  };

  const resumeOnLeave = () => {
    if (tl.current) tl.current.play();
  };

  useEffect(() => {
    tl.current = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    slides.forEach((_, i) => {
      const slideEl = slidesRef.current[i];
      const txtEl = textRef.current[i];

      // in: from right with tilt
      tl.current.fromTo(
        slideEl,
        {
          xPercent: 100,
          rotateY: -12,
          scale: 1.05,
          filter: "brightness(0.85)",
        },
        {
          duration: 1.1,
          xPercent: 0,
          rotateY: 0,
          scale: 1,
          filter: "brightness(1)",
          ease: "power3.out",
        }
      );

      // text fade in
      tl.current.fromTo(
        txtEl,
        { y: 30, autoAlpha: 0 },
        { duration: 0.8, y: 0, autoAlpha: 1, ease: "power3.out" },
        "<0.2"
      );

      // stay visible
      tl.current.to({}, { duration: 2.2 }); // pause

      // out: to left with opposite tilt
      tl.current.to(
        [slideEl, txtEl],
        {
          duration: 0.9,
          xPercent: -100,
          rotateY: 12,
          autoAlpha: 0,
          ease: "power3.in",
        },
        "+=0"
      );

      // reset instant for next loop (so next slide starts offscreen right)
      tl.current.set([slideEl, txtEl], { xPercent: 100, rotateY: -12, autoAlpha: 1 });
    });

    // optional: pause on hover
    const container = containerRef.current;
    container.addEventListener("mouseenter", pauseOnHover);
    container.addEventListener("mouseleave", resumeOnLeave);

    return () => {
      if (tl.current) {
        tl.current.kill();
      }
      container.removeEventListener("mouseenter", pauseOnHover);
      container.removeEventListener("mouseleave", resumeOnLeave);
    };
  }, []);

  const addSlideRef = (el) => {
    if (el && !slidesRef.current.includes(el)) slidesRef.current.push(el);
  };
  const addTextRef = (el) => {
    if (el && !textRef.current.includes(el)) textRef.current.push(el);
  };

  return (
    <div className="dash-container">
    <div className="animated-header" ref={containerRef}>
      <div className="slide-stage">
        {slides.map((s, i) => (
          <div
            className="slide"
            key={i}
            ref={addSlideRef}
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="overlay" />
            <div className="slide-text" ref={addTextRef}>
              <h1>{s.text}</h1>
              <button className="btn-start">GET STARTED</button>
            </div>
          </div>
        ))}
      </div>

      {/* little pagination dots (pure CSS) */}
      <div className="dots">
        {slides.map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>
       </div>
       <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Agriculteurs</h3>
          <p>Nombre total: 24</p>
        </div>
        <div className="dashboard-card">
          <h3>Demandes</h3>
          <p>En attente: 5</p>
        </div>
        <div className="dashboard-card">
          <h3>Rapports</h3>
          <p>Derniers rapports: 3</p>
        </div>
      </div>
    </div>
  );
}
