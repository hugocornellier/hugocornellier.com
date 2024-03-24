import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";

const Header: React.FC = () => {
    const [socket, setSocket] = useState<Socket | undefined>();

    useEffect(() => {
        const initializedSocket = SocketHelper.init();
        setSocket(initializedSocket);

        return () => {
            initializedSocket.disconnect(); // Disconnect socket when component unmounts
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit("track_view_data");
        }
    }, [socket]);

    return (
        <Helmet>
            <title>Hugo Cornellier</title>
            <link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:100,200,300,400,500,600,700,800,900" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet"/>
        </Helmet>
    );
};

export default Header;
