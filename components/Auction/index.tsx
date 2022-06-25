import { useState } from 'react';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';

import classes from './Auction.module.css';

interface AuctionProps {
}

const Auction: React.FC<AuctionProps> = props => {
    const [textPrompt, setTextPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const onButtonClick = async () => {
        console.log(textPrompt);
        setIsLoading(true);
        await new Promise(f => setTimeout(f, 1000));
        setIsLoading(false);
        setIsLoaded(true);
    };

    const onFormChange = (event) => {
        setTextPrompt(event.target.value);
    };

    return (
        <div style={{ backgroundColor: 'white' }} className={classes.wrapper}>
            <h4>Text Prompt</h4>
            Describe what you want the AI to create
            <div className={`${classes.formWrapper}`}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="e.g. 3 dudes coding"
                        aria-label="e.g. 3 dudes coding"
                        aria-describedby="basic-addon1"
                        onChange={onFormChange}
                    />
                    <Button
                        variant="outline-secondary"
                        id="button-addon2"
                        onClick={onButtonClick}
                    >
                        Mint it!
                    </Button>
                </InputGroup>
                {isLoading && <div>
                    Loading...
                </div>}
                {isLoaded &&
                    <Image
                        src={"https://media.discordapp.net/attachments/960284006581149699/990373806923186288/threedudescoding.png"}
                        fluid
                    />}
            </div>
        </div>
    );
}

export default Auction;