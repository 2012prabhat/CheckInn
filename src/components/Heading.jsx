import React from "react";

const Heading = ({ text, className }) => {
  return (
    <div className={`relative text-center ${className}`}>
      <h1 className="text-[21px]  font-bold tracking-wide uppercase w-[160px] mx-auto whitespace-nowrap pb-[13px] relative italic">
        {/* Before pseudo-element */}
        <span className="absolute top-0 left-0 h-[3px] w-[75px] bg-[var(--secBtn)] -translate-y-[4px]"></span>
        {text}
        {/* After pseudo-element */}
        <span className="absolute bottom-0 right-0 h-[3px] w-[75px] bg-[var(--secBtn)] translate-y-[-10px]"></span>
      </h1>
    </div>
  );
};

export default Heading;