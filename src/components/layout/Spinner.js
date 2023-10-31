import React from "react";
import spinner from "../../assets/spinner.gif";

export const Spinner = () => {
  return (
    <div className="spinner-container">
      <img
        src={spinner}
        alt="Loading..."
        title="Loading..."
        className="spinner"
      />
      <p className="spinner-loading" title="Loading...">
        Loading...
      </p>
    </div>
  );
};
