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
                    <h2>
                        <a href="https://git.io/typing-svg">
                            <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=25&duration=2000&pause=1000&color=000000&vCenter=true&random=false&width=1000&height=30&lines=Hi+there%2C+I'm+Hugo+Cornellier+%F0%9F%91%8B%F0%9F%8F%BB;I'm+a+Software+Engineer+%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB;Flutter+%26+Dart+Enthusiast,+Open+Source+Contributor+%F0%9F%90%A6;25k%2B+Monthly+Downloads+on+pub.dev+%F0%9F%93%A6" alt="hugocornellier's banner" />
                        </a>
                    </h2>
                    <hr />
                    <ul className="no-bullets">
                        <li>
                            <a href="/blog-agelapse-2026-performance">2026 Performance Updates: Face Detection in AgeLapse</a>
                            <br />
                            <time className="deemphasized">10 Apr 2026</time>
                        </li>
                        <li>
                            <a href="/blog-agelapse-desktop">Introducing AgeLapse Desktop</a>
                            <br />
                            <time className="deemphasized">15 Jan 2025</time>
                        </li>
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
                            Stabilizing a series of images involves aligning key landmarks, such as eyes or other facial
                            features, across multiple frames. This process can significantly improve consistency in
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
        {
            path: "/blog-agelapse-desktop",
            element: (
                <Layout>
                    <article>
                        <h1>Introducing AgeLapse Desktop</h1>
                        <time className="deemphasized">15 Jan 2025</time>
                        <p>
                            AgeLapse has been available on mobile for a while now, helping users document
                            their journey through daily self-portrait time-lapses. Over that time, the most
                            common request has been simple: a desktop version.
                            <br/><br/>
                            Today, I'm releasing AgeLapse Desktop for the first time. Here's what that means
                            and what to expect.
                        </p>

                        <h2>Why a Desktop App?</h2>
                        <p>
                            Processing large photo libraries is demanding. On mobile, rendering and exporting
                            a multi-year time-lapse can take a long time and strain battery life. On desktop,
                            the same workload is handled with significantly more headroom, both in CPU and
                            available memory.
                            <br/><br/>
                            There's also the matter of workflow. Many users have years of photos already stored
                            on their computers, and importing them into a mobile app has never been ideal. A
                            native desktop app solves that directly.
                        </p>

                        <h2>Key Features</h2>
                        <ul>
                            <li>
                                <strong>Full library import:</strong> Load photos directly from your file system,
                                including existing archives from other apps.
                            </li>
                            <li>
                                <strong>Face detection and alignment:</strong> The same landmark-based alignment
                                used in the mobile app is available here, now with faster processing times on
                                desktop hardware.
                            </li>
                            <li>
                                <strong>Export control:</strong> Choose your output resolution, frame rate, and
                                format before exporting.
                            </li>
                            <li>
                                <strong>Fully offline:</strong> Everything runs locally. No account required,
                                no uploads.
                            </li>
                        </ul>

                        <h2>Getting Started</h2>
                        <p>
                            Download the latest release from the <a href="https://agelapse.com/">AgeLapse website</a>.
                            The desktop app is currently available for macOS, with Windows support planned for a
                            future release.
                        </p>

                        <h2>What's Next</h2>
                        <p>
                            This is the first release, so there is still plenty of room to grow. Upcoming features
                            include batch processing, improved alignment controls, and a more polished onboarding
                            experience. Feedback is always welcome.
                        </p>
                    </article>
                </Layout>
            )
        },
        {
            path: "/blog-agelapse-2026-performance",
            element: (
                <Layout>
                    <article>
                        <h1>2026 Performance Updates: Face Detection in AgeLapse</h1>
                        <time className="deemphasized">10 Apr 2026</time>
                        <p>
                            Over the past few months, I've been focused on improving the performance of face
                            detection in AgeLapse. This post covers the key changes, why they were made, and
                            what the results look like in practice.
                        </p>

                        <h2>The Problem</h2>
                        <p>
                            Face detection is one of the most computationally intensive parts of the AgeLapse
                            pipeline. For users with large photo libraries, running detection across hundreds or
                            thousands of images was slow enough to be a real friction point. The goal this year
                            was to address that without sacrificing accuracy.
                        </p>

                        <h2>What Changed</h2>
                        <ul>
                            <li>
                                <strong>Detection pipeline refactor:</strong> The face detection logic was
                                restructured to reduce redundant processing. Previously, each image was processed
                                independently with no shared state; the updated pipeline caches intermediate
                                results and skips unnecessary recomputation where safe to do so.
                            </li>
                            <li>
                                <strong>Concurrency improvements:</strong> Detection now runs across multiple
                                threads where the platform allows it, reducing total wall-clock time on
                                multi-core hardware.
                            </li>
                            <li>
                                <strong>Tighter landmark filtering:</strong> Low-confidence detections are now
                                filtered earlier in the pipeline, cutting down on wasted alignment attempts and
                                downstream errors.
                            </li>
                        </ul>

                        <h2>Results</h2>
                        <p>
                            In testing on a library of 500 images, end-to-end detection time dropped by roughly
                            40% compared to the previous version. Alignment accuracy remained consistent, and
                            the false-positive rate on difficult images (poor lighting, partial occlusion)
                            improved due to the tighter filtering thresholds.
                        </p>

                        <h2>What's Next</h2>
                        <p>
                            There is still room for improvement, particularly around edge cases: extreme angles,
                            low-resolution inputs, and images with multiple faces. Those are the areas I'm
                            looking at next.
                        </p>
                    </article>
                </Layout>
            )
        },
    ]);

    return <RouterProvider router={router}/>;
};


export default App;
