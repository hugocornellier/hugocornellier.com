import {useEffect, useState} from "react";
import {Socket} from "socket.io-client";
import {SocketHelper} from "../context/SocketHelper";
import TableView from './TableView';

export default () => {

    const [socket, setSocket] = useState<Socket>();
    const [data, setData] = useState<any>(null);
    useEffect((): void => setSocket(SocketHelper.init()), []);
    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.emit("get_records");
        socket.on("get_records_ret", async (data) => {
            console.log("YAY")
            console.log(data)
            setData(data)
        })
    }, [socket]);

    return (
        <>
            {data !== null && <TableView data={data} />}
        </>
    )
}
