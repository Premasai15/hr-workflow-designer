import { Handle, Position } from "reactflow";

export default function EndNode({ data }) {
  return (
    <div
      className="drag-handle"
      style={{
        padding: 12,
        borderRadius: 12,
        background: "#fef2f2",
        border: "2px solid #ef4444",
        cursor: "grab"
      }}
    >
      <strong>End</strong>
      <div>{data.message || "Completed"}</div>

      <Handle type="target" position={Position.Top} />
    </div>
  );
}
