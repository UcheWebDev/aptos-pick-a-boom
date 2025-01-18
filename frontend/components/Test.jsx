import React, { useState } from "react";

const Test = () => {
  const [Counter, setCounter] = useState(0);
  const increamentCount = () => setCounter(Counter + 1);
  return (
    <div className="p-5">
      <div> Counter : {Counter}</div>
      <button
        className="bg-red-300 py-3 px-3"
        type="button"
        onClick={increamentCount}
      >
        update counter
      </button>
    </div>
  );
};

export default Test;
