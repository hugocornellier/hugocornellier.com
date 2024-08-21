import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import { Socket } from "socket.io-client";
import { SocketHelper } from "./context/SocketHelper";
import Views from "./component/Views";
import Layout from "./component/Layout";

const App: React.FC = () => {

    const [socket, setSocket] = useState<Socket | undefined>();

    useEffect(() => {
        const initializedSocket = SocketHelper.init();
        setSocket(initializedSocket);

        return () => {
            initializedSocket.disconnect(); // Disconnect socket when component unmounts
        };
    }, []);

    const router = createBrowserRouter([
        {
            path: "",
            element: (
                <Layout>
                    <article>
                        <h2>Hello, World! I'm Hugo 👋</h2>
                        <p>You may know me as the author of <a href="https://agelapse.com/">AgeLapse</a>.</p>
                        <p>
                            I'm a Developer with a passion for bringing ideas to life. Growing up in the '90s and early
                            2000s, I fell in love with the internet, and that passion has driven me to design and
                            develop applications and websites that are fast, responsive, and accessible to everyone.
                            <br/><br/>
                            I am currently seeking my first Junior Developer role.
                            <br/><br/>
                            💼 Interested in working together? Reach out to me via email.
                            <br/>
                            💬 Got a question or just curious about something? Feel free to ask!
                        </p>
                    </article>
                    <hr />
                    <ul className="no-bullets">
                        <li>
                            <a href="/blog-may-2nd-2024">Affine Transformations in Flutter: A Guide</a>
                            <br />
                            <time className="deemphasized">2 May 2024</time>
                        </li>
                    </ul>
                </Layout>
            )
        },
        {
            path: "/contact",
            element: (
                <Layout>
                    <article>
                        <h1>contact</h1>
                        <p>Want to get in touch?</p>

                        <h4 id="email">email</h4>
                        <address>
                            <span className="label">address: </span>
                            <a href="mailto:hugo.cornellier@gmail.com">
                                <span className="__cf_email__" data-cfemail="9cfff3f8e5dcf7eef5f9fbf9eeb2f5f3">
                                    hugo.cornellier@gmail.com
                                </span>
                            </a>
                        </address>

                        <h4 id="other">other</h4>
                        <address>
                            <span className="label">github: </span>
                            <a href="https://github.com/hugocornellier">@hugocornellier</a>
                            <br/>
                            <span className="label">linkedin: </span>
                            <a href="https://www.linkedin.com/in/hugocornellier">Hugo Cornellier</a>
                        </address>
                    </article>
                </Layout>
            )
        },
        {
            path: "/views",
            element: (
                <Views socket={socket}/>
            )
        },
        {
            path: "/blog-may-2nd-2024",
            element: (
                <Layout>
                    <div>
                        <h1>Using Affine Transformations to Stabilize Images on Two (2) Key Landmarks</h1>
                        <p>
                            Stabilizing a series of images involves aligning key landmarks—such as eyes or other facial
                            features—across multiple frames. This process can significantly improve consistency in
                            applications like time-lapse creation or facial analysis.
                            <br/><br/>
                            In this post, we'll explore how to
                            achieve this in Flutter/Dart using affine transformations.
                        </p>

                        <h2>Step 1: Perform Landmark Detection</h2>
                        <p>
                            The first step in the stabilization process is detecting the landmarks that you want to
                            align across your images. In this example, I used Google MLKit to detect facial landmarks
                            such as the eyes, nose, and mouth.
                            <br/><br/>
                            Once the landmarks are detected, the key points representing the left and right eyes serve
                            as my two reference positions for the affine transformations.
                        </p>

                        <h2>Step 2: Calculate the Affine Transformation Matrix</h2>
                        <p>
                            Once the landmarks are detected, the next step is to calculate the affine transformation
                            matrix that will align these points to a desired position. Here's how this is done:
                        </p>
                        <ul>
                            <li>
                                <strong>Calculate Rotation and Scale:</strong> The rotation angle is determined by the
                                relative positions of the landmarks (e.g., the eyes), and the scale factor is calculated
                                based on the distance between the landmarks in the image compared to the desired
                                distance.
                                <pre><code>
                                    {`
double rotationDegrees = atan2(verticalDistance, horizontalDistance) * (180 / pi) * (rightEye.y > leftEye.y ? -1 : 1);
double scaleFactor = eyeDistanceGoal / hypotenuse;
                                    `}
                                </code></pre>
                            </li>
                            <li>
                                <strong>Determine Translation Offsets:</strong> After calculating the rotation and
                                scale, the next step is to determine how much to translate (move) the image so that the
                                landmarks align correctly. This is done by comparing the detected landmark positions
                                with the desired goal positions.
                                <pre><code>
                                    {`
double translateX = (goalX - transformedPoint['x']!);
double translateY = (goalY - transformedPoint['y']!);
                                    `}
                                </code></pre>
                            </li>
                            <li>
                                <strong>Apply the Transformation:</strong> With the rotation, scale, and translation
                                calculated, these transformations are applied sequentially to the image using the affine
                                transformation matrix.
                                <pre><code>
                                    {`
Map<String, double> transformedPoint = transformPointByCanvasSize(
  originalPointX: originalPointX,
  originalPointY: originalPointY,
  scale: scaleFactor,
  rotationDegrees: rotationDegrees,
  canvasWidth: canvasWidth.toDouble(),
  canvasHeight: canvasHeight.toDouble(),
  originalWidth: img!.width.toDouble(),
  originalHeight: img.height.toDouble(),
);
                                    `}
                            </code></pre>
                            </li>
                        </ul>

                        <h2>Step 3: Paint the Transformed Image</h2>
                        <p>
                            The final step is to apply the calculated transformations and paint the image onto a new
                            canvas. This step involves translating, rotating, and scaling the image according to the
                            calculated parameters. Here's how you can paint the transformed image:
                        </p>
                        <pre><code>
                            {`
canvas.save();
canvas.translate(translateX, translateY);
canvas.translate(size.width / 2, size.height / 2);
canvas.rotate(rotationAngle * (pi / 180));
canvas.translate(-size.width / 2, -size.height / 2);

paintImage(
  canvas: canvas,
  image: image!,
  fit: BoxFit.fill,
  alignment: Alignment.center,
  filterQuality: FilterQuality.high,
  rect: Rect.fromCenter(
    center: Offset(size.width / 2, size.height / 2),
    width: image!.width * scaleFactor,
    height: image!.height * scaleFactor,
  ),
);

canvas.restore();
                            `}
                        </code></pre>
                        <p>
                            This process ensures that the landmarks are aligned consistently across all images,
                            resulting in a smooth and stable sequence.
                        </p>
                    </div>
                </Layout>
            )
        },
    ]);

    return <RouterProvider router={router}/>;
};


export default App;
