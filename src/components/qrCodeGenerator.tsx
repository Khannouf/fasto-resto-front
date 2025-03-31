import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";

const QRCodeGenerator = () => {

    const params = useParams()
    const url = `http://192.168.1.97:5173/restaurant/${params.idResto}?tableId=${params.numTable}`;

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">Table {params.numTable}</p>
            <QRCodeSVG value={url} size={150} />
        </div>
    );
};

export default QRCodeGenerator;
