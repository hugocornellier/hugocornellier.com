import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface SocialIconProps {
    link: string;
    icon: any;
    track: (title: string) => void;
}

const SocialIcon: React.FC<SocialIconProps> = ({link, icon, track}) => {
    console.log(icon)
    return (
        <Link to={link} target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center align-items-center rounded-circle social-icon project-icon">
            <FontAwesomeIcon icon={icon} onClick={() => track(String(icon.iconName))} />
        </Link>
    );
}

export default SocialIcon