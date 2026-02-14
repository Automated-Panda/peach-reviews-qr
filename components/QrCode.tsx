import QRCode from "qrcode";

interface QrCodeProps {
  url: string;
  size?: number;
}

/**
 * Server component: generates QR code as a data URL at build/request time.
 * No client-side JS needed for QR rendering.
 */
export default async function QrCode({ url, size = 240 }: QrCodeProps) {
  const dataUrl = await QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className="mx-auto"
    />
  );
}
