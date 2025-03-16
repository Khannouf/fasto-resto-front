import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = ({ idResto, tableId }: { idResto: number; tableId: number }) => {
    const url = `http://localhost:5173/restaurant/${idResto}?tableId=${tableId}`;

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">Table {tableId}</p>
            <QRCodeSVG value={url} size={150} />
        </div>
    );
};

export default QRCodeGenerator;
