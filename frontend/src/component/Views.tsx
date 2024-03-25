import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import TableView from './TableView';

const Views: React.FC = () => {
    const [socket, setSocket] = useState<Socket>();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const initializedSocket = SocketHelper.init();
        setSocket(initializedSocket);

        return () => {
            if (initializedSocket) {
                initializedSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.emit("get_records");
        socket.on("get_records_ret", (receivedData: any) => {
            setData(receivedData);
        });
    }, [socket]);

    return (
        <>
            {data !== null && (
                <TableView data={data} />
            )}
        </>
    );
};

export default Views;
