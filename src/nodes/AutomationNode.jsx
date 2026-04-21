import { Handle, Position } from "reactflow";

export default function AutomationNode({ data }) {
  return (
    <div
      className="drag-handle"
      style={{
        padding: 12,
        borderRadius: 12,
        background: "#fefce8",
        border: "2px solid #eab308",
        cursor: "grab"
      }}
    >
      <strong>⚙️ Automation</strong>

      <div>{data.title}</div>
      <div style={{ fontSize: "12px" }}>
        {data.action || "No Action"}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}