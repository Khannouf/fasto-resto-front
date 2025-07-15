import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";
const api = import.meta.env.VITE_FRONT_URL

const QRCodeGenerator = () => {

    const params = useParams()
    const url = `${api}/restaurant/${params.idResto}/${params.numTable}`;

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">Table {params.numTable}</p>
            <QRCodeSVG value={url} size={150} />
        </div>
    );
};

export default QRCodeGenerator;
