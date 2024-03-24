import {Helmet} from "react-helmet";

export default function Header(props: any) {
    return (
        <Helmet>
            <title>Hugo Cornellier</title>
            <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.slim.min.js"></script>
            <link
                href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:100,200,300,400,500,600,700,800,900"
                rel="stylesheet"/>
            <link
                href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i"
                rel="stylesheet"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
        </Helmet>
    )
}