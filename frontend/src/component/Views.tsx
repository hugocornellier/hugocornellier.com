import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import TableView from './TableView';
import {DefaultEventsMap} from "socket.io/dist/typed-events";

interface Views {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Views: React.FC<Views> = ({ socket }) => {
    const [data, setData] = useState<any>(null);

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
            {data !== null && <TableView data={data} />}
        </>
    );
};

export default Views;
