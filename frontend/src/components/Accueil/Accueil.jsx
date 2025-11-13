import { useEffect, useState } from 'react';
import "./AccueilPage.css";

export default function Accueil() {
  const phrases = [
   "Nous collaborons avec les autorités pour vous assister dans la fourniture d’aliments ",
   "et de médicaments, et vous permettre de soumettre facilement vos demandes"
  ];

  function Typewriter({ phrases, delay = 100 }) {
    const [displayText, setDisplayText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const currentPhrase = phrases[currentPhraseIndex];
      let timeout;

      if (!isDeleting && currentIndex <= currentPhrase.length) {
        // Typing
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, currentIndex));
          setCurrentIndex(prev => prev + 1);
        }, delay);
      } else if (!isDeleting) {
        // Pause at the end of typing
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 4000);
      } else if (currentIndex >= 0) {
        // Deleting
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, currentIndex));
          setCurrentIndex(prev => prev - 1);
        }, delay / 2);
      } else {
        // Move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        setCurrentIndex(0);
      }

      return () => clearTimeout(timeout);
    }, [currentIndex, isDeleting, currentPhraseIndex, delay, phrases]);

    return (
      <span className="typewriter">
        {displayText}
        <span className="cursor">|</span>
      </span>
    );
  }

  return (
    <><div id="home" className="accueil-section">
          <div className="accueil-image-container">
              <img
                  src="src/assets/accueil img.jpg"
                  alt="Accueil"
                  className="accueil-image" />
          </div>

          <div className="accueil-text">
              <h1 className="accueil-title">
                  <Typewriter phrases={phrases} delay={70} />
              </h1>
          </div>
      
          </div></>
  );
}
