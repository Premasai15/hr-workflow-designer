import React, { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";

// Nodes
import TaskNode from "./nodes/TaskNode";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import AutomationNode from "./nodes/AutomationNode";

// API
import { getAutomations } from "./api/mockApi";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);

  // Node types
  const nodeTypes = {
    task: TaskNode,
    start: StartNode,
    end: EndNode,
    automation: AutomationNode
  };

  // ✅ Add Node (with Start restriction)
  const addNode = (type) => {
    if (type === "start" && nodes.some(n => n.type === "start")) {
      alert("❌ Only one Start node allowed!");
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      type: type,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400
      },
      data: {
        title: type.toUpperCase(),
        description: "",
        assignee: "",
        message: "",
        action: ""
      }
    };

    setNodes((prev) => [...prev, newNode]);
  };

  // Connect Nodes
  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  };

  // Update Node
  const updateNode = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      )
    );
  };

  // ✅ Improved Workflow Simulation
  const runWorkflow = () => {
    const hasStart = nodes.some((n) => n.type === "start");
    const hasEnd = nodes.some((n) => n.type === "end");

    if (!hasStart) {
      alert("❌ Start node required!");
      return;
    }

    if (!hasEnd) {
      alert("❌ End node required!");
      return;
    }

    if (edges.length === 0) {
      alert("⚠️ Connect nodes first!");
      return;
    }

    const execution = edges.map((edge) => {
      const from = nodes.find((n) => n.id === edge.source);
      const to = nodes.find((n) => n.id === edge.target);

      return `➡️ ${from?.data.title} → ${to?.data.title}`;
    });

    setLogs([
      "🚀 Starting Workflow...",
      ...execution,
      "✅ Workflow Completed"
    ]);
  };

  // Styles
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "4px",
    display: "block"
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{
        width: "180px",
        padding: "15px",
        background: "#f0f0f0",
        borderRight: "1px solid #ddd"
      }}>
        <h3>Nodes</h3>

        <button onClick={() => addNode("start")}>Start</button><br /><br />
        <button onClick={() => addNode("task")}>Task</button><br /><br />
        <button onClick={() => addNode("automation")}>Automation</button><br /><br />
        <button onClick={() => addNode("end")}>End</button>

        <hr />

        <button onClick={runWorkflow}>Run Workflow</button>
      </div>

      {/* CANVAS */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(e, node) => setSelectedNode(node)}
          fitView
          nodeDragHandle=".drag-handle"
          nodesDraggable={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: "280px",
        padding: "20px",
        background: "#fafafa",
        borderLeft: "1px solid #ddd"
      }}>
        <h3>Edit Node</h3>

        {selectedNode ? (
          <>
            <p><b>Type:</b> {selectedNode.type}</p>

            {/* START */}
            {selectedNode.type === "start" && (
              <>
                <label style={labelStyle}>Start Title</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.title || ""}
                  onChange={(e) => updateNode("title", e.target.value)}
                />
              </>
            )}

            {/* TASK */}
            {selectedNode.type === "task" && (
              <>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.title || ""}
                  onChange={(e) => updateNode("title", e.target.value)}
                />

                <label style={labelStyle}>Assignee</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.assignee || ""}
                  onChange={(e) => updateNode("assignee", e.target.value)}
                />

                <label style={labelStyle}>Description</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.description || ""}
                  onChange={(e) => updateNode("description", e.target.value)}
                />
              </>
            )}

            {/* AUTOMATION */}
            {selectedNode.type === "automation" && (
              <>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.title || ""}
                  onChange={(e) => updateNode("title", e.target.value)}
                />

                <label style={labelStyle}>Action</label>
                <select
                  style={inputStyle}
                  value={selectedNode.data.action || ""}
                  onChange={(e) => updateNode("action", e.target.value)}
                >
                  <option value="">Select Action</option>
                  {getAutomations().map((a) => (
                    <option key={a.id} value={a.label}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* END */}
            {selectedNode.type === "end" && (
              <>
                <label style={labelStyle}>End Message</label>
                <input
                  style={inputStyle}
                  value={selectedNode.data.message || ""}
                  onChange={(e) => updateNode("message", e.target.value)}
                />
              </>
            )}
          </>
        ) : (
          <p>Select a node</p>
        )}
      </div>

      {/* SIMULATION PANEL */}
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "280px",
        background: "#fff",
        borderTop: "1px solid #ddd",
        padding: "10px",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 10
      }}>
        <h4>Simulation</h4>

        {logs.length === 0 ? (
          <p>No execution yet</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ fontSize: "13px", marginBottom: "5px" }}>
              {log}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;