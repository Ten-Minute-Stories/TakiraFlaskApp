import { useEffect, useState } from 'react'
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
// import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';

import './App.css'

function App() {
  const [data, setData] = useState({ nodes: [{ id: 0 }], links: [] as { source?: number, target?: number }[] });

  useEffect(() => {
    setInterval(() => {
      // Add a new connected node every second
      setData(({ nodes, links }) => {
        const id = nodes.length;
        return {
          nodes: [...nodes, { id }],
          links: [...links, { source: id, target: Math.round(Math.random() * (id-1)) }]
        };
      });
    }, 3000);
  }, []);

  const download = () => {
    const str = JSON.stringify(data, null, 2);
    const bytes = new TextEncoder().encode(str);  
    const url = window.URL.createObjectURL(new Blob([bytes], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "image.json");
    link.click();
  }
  
  const nodePaint = ({ x, y }: NodeObject, color: string, ctx: CanvasRenderingContext2D) => {
    if(typeof x !== 'number' || typeof y !== 'number') return new Error('data в говне')

    ctx.fillStyle = color;
    const width = 10
    const height = 5
    ctx.fillRect(x - width/2, y - height/2, width, height); // rectangle;
  }
  
  return (
    <>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx) => nodePaint(node, 'red', ctx)}
      />
      <button onClick={download}>DOWNLOAD</button>
    </>
  )
}

export default App
