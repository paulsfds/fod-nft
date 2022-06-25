import Image from 'react-bootstrap/Image';

import classes from './Art.module.css';

interface ArtProps {
    imgSrc: string;
    className?: string;
}

const Art: React.FC<ArtProps> = props => {
    return (
        <div className={`${classes.imgWrapper}`}>
            <Image
                className={`${classes.img}`}
                src={props.imgSrc}
                fluid
            />
        </div>
    );
};

export default Art;