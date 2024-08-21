import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const Canvas: React.FC = () => {
  // Référence pour le canevas HTML
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Référence pour l'instance de Fabric.js
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          // Ajuster la taille du canevas
          canvas.setWidth(window.innerWidth);
          canvas.setHeight(window.innerHeight);
          canvas.renderAll();
        }
      }
    };

    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: 'red',
        allowTouchScrolling: true,
      });
      fabricCanvasRef.current = canvas;

      // Ajuster la taille du canevas initiale
      resizeCanvas();

      // Ajouter un écouteur pour redimensionner le canevas lors du redimensionnement de la fenêtre
      window.addEventListener('resize', resizeCanvas);

      canvas.on('mouse:dblclick', (options) => {
        const pointer = canvas.getPointer(options.e); // Récupérer les coordonnées du double clic
        console.log(`Double clicked at: X=${pointer.x}, Y=${pointer.y}`);

        // Ajouter un post-it à la position du double clic
        const textbox = new fabric.Textbox('Post-it', {
          left: pointer.x,
          top: pointer.y,
          width: 150,
          height: 150,
          backgroundColor: '#ffeb3b',
          padding: 10,
          editable: true,
          borderColor: 'black',
          cornerColor: 'black',
          cornerStyle: 'circle',
          cornerSize: 10,
        });
        canvas.add(textbox);
        canvas.renderAll(); // Re-render pour appliquer les changements
      });

      // Nettoyage à la destruction du composant
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, []);

  // Fonction pour ajouter un post-it
  const addPostIt = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const textbox = new fabric.Textbox('Post-it', {
        left: 100,
        top: 100,
        width: 150,
        height: 150,
        backgroundColor: '#ffeb3b',
        padding: 10,
        editable: true,
        borderColor: 'black',
        cornerColor: 'black',
        cornerStyle: 'circle',
        cornerSize: 10,
      });
      canvas.add(textbox);
      canvas.renderAll(); // Re-render pour appliquer les changements
    }
  };

  return (
    <div className='canvas-container'>
      <button onClick={addPostIt} style={{ marginBottom: '10px' }}>
        Ajouter un Post-it
      </button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
