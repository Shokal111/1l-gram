import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      
      const target = e.target;
      const isButton = target.tagName === 'BUTTON' || target.closest('button') || target.closest('.clickable');
      const isText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      if (isButton) {
        setCursorVariant('button');
      } else if (isText) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    }

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    }
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      backgroundColor: "transparent",
      border: "2px solid #00f3ff",
      rotate: 45,
    },
    button: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: "rgba(255, 0, 255, 0.1)",
      border: "2px solid #ff00ff",
      rotate: 0,
    },
    text: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 10,
      height: 20,
      width: 4,
      backgroundColor: "#00ff9d",
      border: "none",
      rotate: 0,
    }
  }

  return (
    <>
      <motion.div
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 28,
          mass: 0.2
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 10000,
          boxShadow: cursorVariant === 'button' ? "0 0 15px #ff00ff" : "0 0 10px #00f3ff",
        }}
      />
      {/* Trail effect could go here */}
    </>
  );
}

export default CustomCursor;
