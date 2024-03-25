import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface SocialIconProps {
    link: string;
    icon: any; // or FontAwesomeIconProps
}

const SocialIcon: React.FC<SocialIconProps> = ({link, icon}) => {
    return (
        <Link to={link} target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center align-items-center rounded-circle social-icon project-icon">
            <FontAwesomeIcon icon={icon} />
        </Link>
    );
}

export default SocialIcon