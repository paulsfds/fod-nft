import { useState, useRef } from 'react';
import { Button, Form, Image, InputGroup, Toast } from 'react-bootstrap';
import { useAccount, useContractWrite } from 'wagmi'
import Parser from 'rss-parser';

import Minter from '../../src/artifacts/contracts/Minter.json';

import classes from './Auction.module.css';

interface AuctionProps {
}

const Auction: React.FC<AuctionProps> = props => {
    const { data: account } = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isNFTLoading, setIsNFTLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isNFTError, setIsNFTError] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');
    const imageRef = useRef<HTMLImageElement>(null);
    let retries = 0;
    const [textPrompt, setTextPrompt] = useState('');

    let imgurl = "https://dy713ty38xcg8.cloudfront.net/" + result + ".json"
    const { write } = useContractWrite(
        {
            addressOrName: '0x648B74F841720B922d9B7E7D196D5758bfdb62a4',
            contractInterface: Minter,
        },
        'mintNFT',
        {
            args: [
                account?.address,
                imgurl,
            ],
            onMutate: (data) => {
                setIsNFTError(false);
                setIsNFTLoading(true);
            },
            onSuccess: (data) => {
                // data.hash
                setIsNFTError(false);
                setIsNFTLoading(false);
            },
            onError: () => {
                setIsNFTLoading(false);
                setIsNFTError(true);
            }
        }
    )

    const setup = async () => {
        let result = await fetchImage();
        let imgurl = "https://dy713ty38xcg8.cloudfront.net/" + result + ".jpg";
        getImage(imgurl);
        setResult(result);
    };

    const getImage = (imgurl: string) => {
        console.log(imgurl);
        fetch(imgurl)
            .then(async (res) => {
                if (res.ok) {
                    return res.blob();
                } else {
                    console.log("retrying to d/l image");
                    if (retries > 100) {
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
        const response = await fetch("http://204.236.167.77:8000/generate?prompt=" + (textPrompt || "3 dudes coding"));
        const uuid = await response.text();
        return uuid;
    };

    const onButtonClick = async () => {
        setIsError(false);
        setIsLoading(true);
        await setup();
    };

    const onNYTButtonClick = async () => {
        let parser = new Parser();

        let title = await (async () => {
            let feed = await parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
            if (feed.items.length > 0) {
                let randomIndex = Math.floor(Math.random() * feed.items.length);
                return feed.items[randomIndex].title;
            }
        })();
        setTextPrompt(title ? title : "");
    };

    const onFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextPrompt(event.target.value);
    };

    const showError = () => {
        if (isError) {
            return (
                <div className={classes.toast}>
                    <Toast
                        className="rounded me-2"
                        bg={'danger'}
                        key={0}
                        onClose={onToastClose}
                    >
                        <Toast.Header>
                            <strong className="me-auto">Error</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {isNFTError ? "Sorry, something went wrong, couldn't mint NFT." : "Sorry, something went wrong, couldn't generate image."}
                        </Toast.Body>
                    </Toast>
                </div>
            );
        }
        return null;
    };

    const onToastClose = () => {
        if (isNFTError) {
            setIsNFTError(false);
        } else {
            setIsError(false);
        }
    };

    return (
        <div className={classes.wrapper}>
            <h4>Text Prompt</h4>
            <div>Describe what you want the AI to create</div>
            <div className={classes.formWrapper}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="e.g. 3 dudes coding"
                        aria-label="e.g. 3 dudes coding"
                        aria-describedby="basic-addon1"
                        onChange={onFormChange}
                        value={textPrompt}
                    />
                    <Button
                        variant="secondary"
                        onClick={onNYTButtonClick}
                    >
                        Grab NYTimes Headline
                    </Button>
                </InputGroup>
                <Button
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                    onClick={!isLoading ? onButtonClick : undefined}
                >
                    {isLoading ? 'Generating...' : 'Generate it!'}
                </Button>{' '}
                {result && (
                    <Button
                        variant="success"
                        size="lg"
                        disabled={isNFTLoading}
                        onClick={!isNFTLoading ? () => write() : undefined}
                    >
                        {isNFTLoading ? 'Minting...' : 'Mint my NFT!'}
                    </Button>
                )}
                <Image
                    ref={imageRef}
                    fluid
                />
                {showError()}
            </div>
        </div>
    );
}

export default Auction;
