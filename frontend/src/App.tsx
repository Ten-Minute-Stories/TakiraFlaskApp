import { useEffect, useState } from 'react'
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
// import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';

import './App.css'

function App() {
  const ctxMap = new Map<string | number | undefined, CanvasRenderingContext2D>()
  const [takeId, setTakeId] = useState(-1)
  const [data, setData] = useState({ nodes: [{ id: 0 }], links: [] as { source?: number, target?: number }[] });

  const addNode = () => {
    setData(({ nodes, links }) => {
      const id = nodes.length;
      return {
        nodes: [...nodes, { id }],
        links
      };
    });
  }
  const addLink = (id: number) => {
    if(takeId === -1){
      setTakeId(id)
    } 
    else {
      console.log({takeId, id})
      setData(({ nodes, links }) => {
        return {
          nodes,
          links: [...links, { source: takeId, target: id }]
        };
      });
      setTakeId(-1)
    }
  }

  const download = () => {
    const str = JSON.stringify(data, null, 2);
    const bytes = new TextEncoder().encode(str);  
    const url = window.URL.createObjectURL(new Blob([bytes], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "image.json");
    link.click();
  }
  
  const nodePaint = ({ x, y, id }: NodeObject, color: string, ctx: CanvasRenderingContext2D) => {
    ctxMap.set(id, ctx)

    if(typeof x !== 'number' || typeof y !== 'number') return new Error('data в говне')
    ctx.fillStyle = color;
    const width = 10
    const height = 5
    ctx.fillRect(x - width/2, y - height/2, width, height); // rectangle;
    ctx.fillStyle = 'orange';
    ctx.fillRect(x - width/2, y - height/2, width/2, height/2); // rectangle;
  }
  
  return (
    <div className='graph'>
      <ForceGraph2D
        height={400}
        width={400}
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx) => nodePaint(node, 'red', ctx)}
        // onNodeClick={(node) => addLink(node.id)}
        onNodeHover={(nodeIn, nodeOut) => {
          console.log({nodeIn, nodeOut})
          // node.color = 'orange'
          if(nodeIn){
            // nodeIn = 100
            console.log({nodeIn, nodeOut})
            if(ctxMap.has(nodeIn.id)){
              const ctx = ctxMap.get(nodeIn.id)
              console.log(ctx)
              if(ctx){
                console.log(ctx.getContextAttributes())
              }
            }
          }
          if(nodeOut){
            if(ctxMap.has(nodeOut.id)){
              const ctx = ctxMap.get(nodeOut.id)
              if(ctx) { 
                console.log({ctx})
                ctx.fillStyle = 'green';
                ctx.fillRect(0,0,100,100); // rectangle;
              }
            }
          }
        }}
        onNodeRightClick={(node) => addLink(node.id)}
        onNodeDragEnd={node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}

        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        // linkCurvature={0.25}
      />
      <div>
        <button onClick={addNode}>ADD NODE</button>
        <button onClick={download}>DOWNLOAD</button>
      </div>
    </div>
  )
}

export default App
