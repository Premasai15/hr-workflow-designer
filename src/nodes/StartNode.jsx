import { Handle, Position } from "reactflow";

export default function StartNode({ data }) {
  return (
    <div
      className="drag-handle"
      style={{
        padding: 12,
        borderRadius: 12,
        background: "#ecfdf5",
        border: "2px solid #22c55e",
        cursor: "grab"
      }}
    >
      <strong>Start</strong>
      <div>{data.title}</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}