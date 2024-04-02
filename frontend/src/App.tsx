import About from "./component/About";
import Awards from "./component/Awards";
import Education from "./component/Education";
import Experience from "./component/Experience";
import Sidebar from "./component/Sidebar";
import Projects from "./component/Projects";
import Skills from "./component/Skills";
import Views from "./component/Views";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import {Socket} from "socket.io-client";
import {SocketHelper} from "./context/SocketHelper";

const App: React.FC = () => {

    const [socket, setSocket] = useState<Socket | undefined>();

    useEffect(() => {
        const initializedSocket = SocketHelper.init();
        setSocket(initializedSocket);

        return () => {
            initializedSocket.disconnect(); // Disconnect socket when component unmounts
        };
    }, []);

    const track = (title: string) => {
        if (title.length > 0 && /^[a-zA-Z]/.test(title)) {
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }
        if (socket) {
            socket.emit("track_view_data", title);
        }
    };

    const router = createBrowserRouter([
        {
            path: "",
            element: (
                <div className={"content"}>
                    <Sidebar track={track} socket={socket}/>
                    <div className="container-fluid p-0">
                        <About track={track} />
                        <Education/>
                        <Experience/>
                        <Skills/>
                        <Awards/>
                        <Projects track={track} />
                    </div>
                </div>
            )
        },
        {
            path: "/views",
            element: (
                <Views socket={socket}/>
            )
        }
    ]);

    return <RouterProvider router={router}/>
};

export default App;
