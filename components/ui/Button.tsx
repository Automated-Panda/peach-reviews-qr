import React from "react";

type Variant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
}

const base =
  "w-full rounded-lg font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1a73e8] hover:bg-[#1558b0] text-white h-[52px] focus:ring-[#1a73e8]",
  outline:
    "bg-white border border-[#dadce0] hover:bg-gray-50 text-[#1a73e8] h-[52px] focus:ring-[#1a73e8]",
};

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${classes} inline-flex items-center justify-center no-underline`}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
