import { useState, useRef } from 'react';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import { useContractWrite } from 'wagmi'

import Minter from '../../src/artifacts/contracts/Minter.json';

import classes from './Auction.module.css';

interface AuctionProps {
}

const Auction: React.FC<AuctionProps> = props => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const imageRef = useRef<HTMLImageElement>(null);
    let retries = 0;
    let textPrompt = "";

    const { data: contract, isError: isContractError, isLoading: isContractLoading, write } = useContractWrite(
        {
            addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
            contractInterface: Minter,
        },
        'feed',
    )

    const setup = async () => {
        let result = await fetchImage();
        getImage("http://192.168.0.147:8080/https://fod-image.s3.us-west-1.amazonaws.com/" + result + ".jpg");
    };

    const getImage = (imgurl: string) => {
        fetch(imgurl)
            .then(async(res) => {
                if (res.ok) {
                    return res.blob();
                } else {
                    console.log("retrying to d/l image");
                    if (retries > 5) {
                        console.log("done retrying");
                        setIsLoading(false);
                        setIsError(true);
                        return null;
                    }
                    await wait(3000);
                    getImage(imgurl);
                    retries += 1; 
                }
            }) // Gets the response and returns it as a blob
            .then(blob => {
                if (!blob) {
                    return;
                }
                let objectURL = URL.createObjectURL(blob);
                setIsLoading(false);
                setIsLoaded(true);
                if (imageRef) {
                    imageRef.current!.src = objectURL;
                }
            });
    };

    function wait(ms = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    const fetchImage = async () => {
        const response = await fetch("http://192.168.0.147:8080/http://204.236.167.77:8000/generate?prompt=" + textPrompt);
        const uuid = await response.text();
        return uuid;
    };

    const onButtonClick = async () => {
        console.log(textPrompt);
        setIsError(false);
        setIsLoaded(false);
        setIsLoading(true);
        await setup();
        // write();
    };

    const onFormChange = (event) => {
        textPrompt = event.target.value;
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
                <Image
                    ref={imageRef}
                    fluid
                />
            </div>
        </div>
    );
}

export default Auction;