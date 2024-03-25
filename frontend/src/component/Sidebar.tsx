import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Nav from "./Nav";

interface Sidebar {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Sidebar: React.FC<Sidebar> = ({ socket }) => {

    useEffect(() => {
        if (socket) {
            socket.emit("track_view_data", "/");
        }
    }, [socket]);

    return (
        <>
            <Helmet>
                <title>Hugo Cornellier</title>
                <link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:100,200,300,400,500,600,700,800,900" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet"/>
            </Helmet>
            <Nav socket={socket} />
        </>
    );
};

export default Sidebar;
