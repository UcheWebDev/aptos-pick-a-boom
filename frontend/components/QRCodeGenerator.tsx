import React from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ url = "https://pickaboom.xyz", openInNewTab = true }) => {
  const handleClick = () => {
    if (openInNewTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-24 h-24 cursor-pointer "
      title={`Click to visit ${url}`}
    >
      <QRCode
        value={url}
        size={96} // 24 * 4 = 96px to match w-24 h-24
        level="H"
        style={{ color: "white" }}
        className="w-full h-full"
      />
    </div>
  );
};

export default QRCodeGenerator;
