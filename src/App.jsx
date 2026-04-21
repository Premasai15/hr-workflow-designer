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

const NODE_LABELS = {
  start: "Start",
  task: "Task",
  automation: "Automation",
  end: "End"
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logs, setLogs] = useState([]);

  const nodeTypes = {
    task: TaskNode,
    start: StartNode,
    end: EndNode,
    automation: AutomationNode
  };

  // ✅ Add Node
  const addNode = (type) => {
    if (type === "start" && nodes.some((n) => n.type === "start")) {
      alert("❌ Only one Start node allowed!");
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      type,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400
      },
      data: {
        title: NODE_LABELS[type],
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

  // Simulation
  const runWorkflow = () => {
    if (!nodes.some((n) => n.type === "start")) {
      alert("❌ Start node required!");
      return;
    }

    if (!nodes.some((n) => n.type === "end")) {
      alert("❌ End node required!");
      return;
    }

    const execution = edges.map((edge) => {
      const from = nodes.find((n) => n.id === edge.source);
      const to = nodes.find((n) => n.id === edge.target);
      return `➡️ ${from?.data.title} → ${to?.data.title}`;
    });

    setLogs(["🚀 Start", ...execution, "✅ End"]);
  };

  // Common input props (🔥 FIXED)
  const inputProps = {
    className: "nodrag",
    onClick: (e) => e.stopPropagation(),
    onKeyDown: (e) => e.stopPropagation()
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT */}
      <div style={{ width: 180, padding: 15, background: "#f0f0f0" }}>
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
          deleteKeyCode={null}        // 🔥 FIX
          nodesFocusable={false}      // 🔥 FIX
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 280, padding: 20 }}>
        <h3>Edit Node</h3>

        {selectedNode ? (
          <>
            <p><b>Type:</b> {selectedNode.type}</p>

            {/* START */}
            {selectedNode.type === "start" && (
              <input
                {...inputProps}
                value={selectedNode.data.title}
                onChange={(e) => updateNode("title", e.target.value)}
              />
            )}

            {/* TASK */}
            {selectedNode.type === "task" && (
              <>
                <input
                  {...inputProps}
                  value={selectedNode.data.title}
                  onChange={(e) => updateNode("title", e.target.value)}
                />
                <input
                  {...inputProps}
                  value={selectedNode.data.assignee}
                  onChange={(e) => updateNode("assignee", e.target.value)}
                />
                <input
                  {...inputProps}
                  value={selectedNode.data.description}
                  onChange={(e) => updateNode("description", e.target.value)}
                />
              </>
            )}

            {/* AUTOMATION */}
            {selectedNode.type === "automation" && (
              <>
                <input
                  {...inputProps}
                  value={selectedNode.data.title}
                  onChange={(e) => updateNode("title", e.target.value)}
                />

                <select
                  {...inputProps}
                  value={selectedNode.data.action}
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
              <input
                {...inputProps}
                value={selectedNode.data.message}
                onChange={(e) => updateNode("message", e.target.value)}
              />
            )}
          </>
        ) : (
          <p>Select a node</p>
        )}
      </div>

      {/* LOG PANEL */}
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 280,
        background: "#fff",
        padding: 10
      }}>
        <h4>Simulation</h4>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>

    </div>
  );
}

export default App;