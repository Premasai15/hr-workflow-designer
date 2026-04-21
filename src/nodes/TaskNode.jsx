import { Handle, Position } from "reactflow";

export default function TaskNode({ data }) {
  return (
    <div
      className="drag-handle"
      style={{
        padding: 12,
        borderRadius: 12,
        background: "#eef2ff",
        border: "2px solid #4f46e5",
        cursor: "grab"
      }}
    >
      <strong>Task</strong>
      <div>{data.title}</div>
      <div style={{ fontSize: "12px" }}>
        👤 {data.assignee}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}