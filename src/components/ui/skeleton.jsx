import React from "react";

const Skeleton = ({ className }) => {
    return <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md ${className}`}></div>;
};

export default Skeleton;