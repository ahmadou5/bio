"use client";
import React, { useEffect, useRef, useState } from "react";

// Import the types from qr-code-styling
import QRCodeStyling, { Options } from "qr-code-styling";

// Define the props interface
interface StyledQRCodeProps {
  data: string;
  size?: number;
}

// Define a type for our QR code instance
type QRCodeInstance = InstanceType<typeof QRCodeStyling>;

const StyledQRCode: React.FC<StyledQRCodeProps> = ({ data, size = 290 }) => {
  const qrContainer = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeInstance | null>(null);

  useEffect(() => {
    const initQR = async () => {
      if (typeof window !== "undefined") {
        const options: Options = {
          width: size,
          data: data,
          height: size,

          dotsOptions: {
            gradient: {
              type: "radial",
              colorStops: [
                { offset: 0, color: "rgb(0, 0, 0)" },
                { offset: 1, color: "rgba(0, 0, 0, 1)" },
              ],
              rotation: 2.35,
            },
            type: "rounded",
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
          },
          backgroundOptions: {
            color: "transparent",
          },
        };
        const qrCodeInstance = new QRCodeStyling(options);
        setQrCode(qrCodeInstance);
      }
    };
    initQR();
  }, [size, data]);

  useEffect(() => {
    if (qrCode && qrContainer.current) {
      qrContainer.current.innerHTML = "";
      qrCode.append(qrContainer.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (qrCode) {
      qrCode.update({
        data: data,
        width: size,

        height: size,
      });
    }
  }, [qrCode, data, size]);

  return <div className="" ref={qrContainer} />;
};

export default StyledQRCode;
