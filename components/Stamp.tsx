export function Stamp({
  size = 56,
  char = "通",
}: {
  size?: number;
  char?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="#b83227"
        strokeWidth="2.4"
      />
      <circle
        cx="32"
        cy="32"
        r="24.5"
        fill="none"
        stroke="#b83227"
        strokeWidth="0.9"
      />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fill="#b83227"
        fontFamily="serif"
        fontSize="26"
        fontWeight="600"
      >
        {char}
      </text>
    </svg>
  );
}
