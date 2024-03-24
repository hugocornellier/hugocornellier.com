import {useEffect, useState} from "react";
import {Socket} from "socket.io-client";
import {SocketHelper} from "../context/SocketHelper";
import db from "../../../backend/db/db";
import TableView from './TableView';

export default () => {
    const rowData = [
        {
            city: 'New York',
            country: 'USA',
            date: '2024-03-24',
            ip: '192.168.1.1',
            region: 'NY',
            timezone: 'EST',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1000.123 Safari/537.36',
        },
        {
            city: 'London',
            country: 'UK',
            date: '2024-03-25',
            ip: '192.168.1.2',
            region: 'England',
            timezone: 'GMT',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1000.123 Safari/537.36',
        },
        // Add more data as needed
    ];

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
