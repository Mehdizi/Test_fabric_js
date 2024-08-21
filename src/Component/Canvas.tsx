import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: 'red',
        allowTouchScrolling: true,
      });
      fabricCanvasRef.current = canvas;

      const resizeCanvas = () => {
        if (canvasRef.current) {
          canvas.setWidth(window.innerWidth);
          canvas.setHeight(window.innerHeight);
          canvas.renderAll();
        }
      };

      resizeCanvas();

      window.addEventListener('resize', resizeCanvas);

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          const zoomFactor = 0.1;
          const pointer = canvas.getPointer(e);

          const currentZoom = canvas.getZoom();
          const newZoom =
            currentZoom * (1 + (e.deltaY > 0 ? -zoomFactor : zoomFactor));
          const clampedZoom = Math.max(newZoom, 0.1);

          const newPointer = canvas.getPointer(e);
          const deltaX = newPointer.x / clampedZoom - pointer.x / currentZoom;
          const deltaY = newPointer.y / clampedZoom - pointer.y / currentZoom;

          canvas.relativePan(new fabric.Point(deltaX, deltaY));
          canvas.setZoom(clampedZoom);
          canvas.renderAll();
        }
      };

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

      window.addEventListener('wheel', handleWheel);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('wheel', handleWheel);
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
