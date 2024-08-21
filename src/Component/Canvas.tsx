import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
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

      resizeCanvas();

      window.addEventListener('resize', resizeCanvas);

      canvas.on('mouse:dblclick', (options) => {
        const pointer = canvas.getPointer(options.e);

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
        canvas.renderAll();
      });

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, []);

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
      canvas.renderAll();
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
