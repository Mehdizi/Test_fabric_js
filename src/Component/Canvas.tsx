import React, { useCallback } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import * as fabric from 'fabric';
import './style.css';

const Canvas: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();

  const addPostIt = useCallback(() => {
    if (editor?.canvas) {
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
      editor.canvas.add(textbox);
      editor.canvas.renderAll();
    }
  }, [editor]);

  return (
    <div>
      <button onClick={addPostIt} style={{ marginBottom: '10px' }}>
        Ajouter un Post-it
      </button>
      <FabricJSCanvas className='canvas' onReady={onReady} />
    </div>
  );
};

export default Canvas;
