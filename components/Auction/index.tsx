import { useState, useRef, useEffect } from 'react';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';

import classes from './Auction.module.css';

interface AuctionProps {
}

const Auction: React.FC<AuctionProps> = props => {
    const [textPrompt, setTextPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [imageUuid, setImageUuid] = useState<string>("");

    const setup = async() => {
        let result = await fetchImage();
        // while (result == "") {
        //     await wait(1000);
        //     result = await fetchImage();
        // }
        setImageUuid(result);
        console.log(imageUuid);
    };

    function wait(ms = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    const fetchImage = async () => {
        const response = await fetch("http://204.236.167.77:8000/generate", {mode: 'no-cors'});
        const uuid = await response.text();
        console.log("fetchImage");
        console.log(response);
        console.log(uuid);
        return uuid;
    };

    const onButtonClick = async () => {
        console.log(textPrompt);
        setIsLoading(true);
        setup();
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
                {isError && <div>
                    Error...womp womp womp
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