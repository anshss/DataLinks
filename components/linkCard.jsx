import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Database } from "@tableland/sdk";
import Loader from "./Loader";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { nftContractAddress, nftContractAbi } from "../config.js";
import web3modal from "web3modal";
import { Web3Storage } from "web3.storage";
// import Link from "next/link";
// import { upload } from "@spheron/browser-upload";
// import { DataverseConnector } from '@dataverse/dataverse-connector';
// import { RESOURCE } from "@dataverse/dataverse-connector";
import {
    DataverseConnector,
    WALLET,
    SYSTEM_CALL,
    RESOURCE,
    Currency,
} from "@dataverse/dataverse-connector";

export default function LinkCard({
    link,
    redirectTo,
    id,
    onClick,
    open,
    getData,
}) {
    const db = new Database();
    const tableName = "linko_links_80001_6516";

    const dataverseConnector = new DataverseConnector();

    const [type, setType] = useState("file");
    const [redirectLink, setRedirectLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState("");
    const [cid, setCid] = useState("");
    const [wallet, setWallet] = useState();
    const [conditionAddress, setConditionAddress] = useState();

    console.log(redirectLink);
    const lighthouseKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY;

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };

    const getLinkoId = async () => {
        const modal = new web3modal();
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
            nftContractAddress,
            nftContractAbi,
            provider
        );

        const data = await contract.linkoId();
        return data;
    };

    const setViewCollection = async () => {
        const modal = new web3modal();
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            nftContractAddress,
            nftContractAbi,
            signer
        );

        const price_ = ethers.utils.parseEther(price);

        const tx = await contract.setViewCollection(cid, price_);
        await tx.wait();
        setLoading(false);
        console.log(tx);
    };

    const handleChange = (event) => {
        setType(event.target.value);
    };
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const handelSubmit = async () => {
        setLoading(true);
        if (type === "paid") {
            await setViewCollection();
        }
        try {
            const { meta: insert } = await db
                .prepare(`UPDATE ${tableName} SET link=? WHERE id=?`)
                .bind(redirectLink, id)
                .run();

            // Wait for transaction finality
            await insert.txn.wait();
            console.log("Done");
            await getData();

            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    // upload with lighthouse

    const uploadWithLighthouse = async (e) => {
        setLoading(true);
        const sig = await encryptionSignature();
        const response = await lighthouse.uploadEncrypted(
            e,
            lighthouseKey,
            sig.publicKey,
            sig.signedMessage,
            progressCallback
        );
        console.log(response);

        applyAccessConditions(response.data.Hash);
        const linkId = await getLinkoId();
        setRedirectLink(location?.origin + "/paid/" + (+linkId + 1));
        setCid(response.data.Hash);
        setLoading(false);
    };

    const encryptionSignature = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const messageRequested = (await lighthouse.getAuthMessage(address)).data
            .message;
        const signedMessage = await signer.signMessage(messageRequested);
        return {
            signedMessage: signedMessage,
            publicKey: address,
        };
    };
    const applyAccessConditions = async (cid) => {
        const conditions = [
            {
                id: 1,
                chain: "mumbai",
                method: "balanceOf",
                standardContractType: "ERC721",
                contractAddress: nftContractAddress,
                returnValueTest: { comparator: ">=", value: "1" },
                parameters: [":userAddress"],
            },
        ];

        const aggregator = "([1])";
        const { publicKey, signedMessage } = await encryptionSignature();

        const response = await lighthouse.applyAccessCondition(
            publicKey,
            cid,
            signedMessage,
            conditions,
            aggregator
        );

        console.log(response);
    };

    // upload with dataverse

    const login = async () => {
        await connectWallet();
        await createCapability();
    };

    const connectWallet = async () => {
        try {
            const res = await dataverseConnector.connectWallet();
            setWallet(res.wallet);
            return res.address;
        } catch (error) {
            console.error(error);
        }
    };

    const app = "Linkwink";

    const createCapability = async () => {
        const pkh = await dataverseConnector.runOS({
            method: SYSTEM_CALL.createCapability,
            params: {
                appId: "134e3f10-221c-4bfe-8319-ef2388605e2d",
                resource: RESOURCE.CERAMIC,
                wallet,
            },
        });
        console.log("done");
        return pkh;
    };

    const uploadWithDataverse = async (e) => {
        setLoading(true);

        const fileLink = await uploadImageToIPFS(e);

        const encrypted = JSON.stringify({
            text: false,
            images: false,
            videos: false,
        });

        const res = await dataverseConnector.runOS({
            method: SYSTEM_CALL.createStream,
            params: {
                modelId:
                    "kjzl6hvfrbw6c9yiu34m9yqjdlldrsspbxdns0xxudolli44qjgwjjd048vapqq",
                streamContent: {
                    appVersion: "0.1.0",
                    text: "file",
                    images: [fileLink],
                    videos: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    encrypted,
                },
                decryptionConditions: [
                    {
                        conditionType: "evmBasic",
                        contractAddress: "",
                        standardContractType: "",
                        chain: "filecoin",
                        method: "",
                        parameters: [":userAddress"],
                        returnValueTest: {
                            comparator: "=",
                            value: conditionAddress,
                        },
                    },
                ],
            },
        });
        console.log("stream id:", res.streamId);

        const linkId = await getLinkoId();
        setRedirectLink(location?.origin + "/dataverse/" + (+res.streamId));
        console.log(redirectLink)
        setLoading(false);
    };

    const loadDataverse = async () => {
        const streamId =
            "kjzl6kcym7w8y98lv98ll0rtzkfcflw9njf944xj596a7eaqiwzjm3atdihkake";
        const res = await dataverseConnector.runOS({
            method: SYSTEM_CALL.loadStream,
            params: streamId,
        });

        console.log(res.streamContent.content.images[0]);
    };


    // const uploadMonetizedWithDataverse = async (e) => {
    //     setLoading(true);

    //     const fileLink = await uploadImageToIPFS(e);

    //     const encrypted = JSON.stringify({
    //         text: false,
    //         images: false,
    //         videos: false,
    //     });

    //     const res = await dataverseConnector.runOS({
    //         method: SYSTEM_CALL.createStream,
    //         params: {
    //             modelId:
    //                 "kjzl6hvfrbw6c9yiu34m9yqjdlldrsspbxdns0xxudolli44qjgwjjd048vapqq",
    //             streamContent: {
    //                 appVersion: "0.1.0",
    //                 text: "file",
    //                 images: [fileLink],
    //                 videos: [],
    //                 createdAt: new Date().toISOString(),
    //                 updatedAt: new Date().toISOString(),
    //                 encrypted,
    //             },
    //             // (indexFileId ? { indexFileId } : { streamId }),
    //             datatokenVars: {
    //                 profileId: "anshss.test",
    //                 collectLimit: 100,
    //                 amount: 0.0001,
    //                 currency: Currency.WMATIC,
    //             },
    //             decryptionConditions: [
    //                 {
    //                     conditionType: "evmBasic",
    //                     contractAddress: "",
    //                     standardContractType: "",
    //                     chain: "filecoin",
    //                     method: "",
    //                     parameters: [":userAddress"],
    //                     returnValueTest: {
    //                         comparator: "=",
    //                         value: "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB",
    //                     },
    //                 },
    //             ],
    //         },
    //     });
    //     console.log("stream id:", res.streamId);

    //     const linkId = await getLinkoId();
    //     setRedirectLink(location?.origin + "/file/" + (+linkId + 1));
    //     setLoading(false);
    // };

    // const loadMonetizedDataverse = async () => {
    //   const streamId =
    //   "kjzl6kcym7w8y98lv98ll0rtzkfcflw9njf944xj596a7eaqiwzjm3atdihkake";

    //     await dataverseConnector.runOS({
    //         method: SYSTEM_CALL.unlock,
    //         params: {
    //             indexFileId: streamId,
    //         },
    //     });

    //     console.log(res.streamContent.content.images[0]);
    // };

    async function uploadImageToIPFS(e) {
        const inputFile = e.target.files[0];
        const inputFileName = e.target.files[0].name;
        const files = [new File([inputFile], inputFileName)];
        const metaCID = await uploadToIPFS(files);
        const url = `https://ipfs.io/ipfs/${metaCID}/data.json`;
        console.log("ipfs:", url);
        return url;
    }

    function getAccessToken() {
        // return process.env.NEXT_PUBLIC_Web3StorageID
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs";
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    const uploadToIPFS = async (files) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        return cid;
    };

    // upload with spheron

    // const uploadWithSpheron = async (e) => {
    //   setLoading(true)
    //   const response = await fetch(`https://linko-deploy.vercel.app/api/hello`); // get the temporary access token from server
    //   // console.log(response);
    //   const resJson = await response.json();
    //   // console.log(resJson);
    //   const token = resJson.uploadToken;

    //   const files = e.target.files[0];
    //   // console.log(files);

    //   let currentlyUploaded = 0;

    //   const { uploadId, bucketId, protocolLink, dynamicLinks } = await upload(
    //     [files],
    //     {
    //       token,
    //       onChunkUploaded: (uploadedSize, totalSize) => {
    //         currentlyUploaded += uploadedSize;
    //         console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
    //       },
    //     }
    //   );
    //   console.log(`${protocolLink}/${files.name}`);
    //   setRedirectLink(`${protocolLink}/${files.name}`);
    //   setLoading(false)
    // };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="mt-10 relative">
                <div
                    onClick={onClick}
                    className="block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <div className="flex justify-between">
                        <div>
                            <a
                                target="_blank"
                                className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                                href={link}
                            >
                                {link}
                            </a>
                            <button
                                type="button"
                                onClick={() =>
                                    navigator.clipboard.writeText(link)
                                }
                                className="w-[30px] h-[30px] ml-3 text-gray-500 bg-white rounded-full border border-gray-200 dark:border-gray-600 hover:text-gray-900 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 mx-auto mt-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                </svg>
                            </button>
                        </div>
                        {redirectLink !== "" ? (
                            <div>
                                <button
                                    onClick={handelSubmit}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Update Link
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex gap- items-center mt-2">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth={0}
                            viewBox="0 0 24 24"
                            role="graphics-document"
                            height={20}
                            width={20}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>redirect</title>
                            <path fill="none" d="M0 0h24v24H0V0z" />
                            <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z" />
                        </svg>
                        <a target="_blank" href={redirectTo}>
                            {redirectTo}
                        </a>
                    </div>

                    <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                        You have successfully generate a linko. To add routes,
                        click on Manage button
                    </p>

                    {open ? (
                        <div className="mt-6 flex gap-10">
                            <div>
                                <FormControl
                                    size="medium"
                                    sx={{ my: 1, minWidth: "350px" }}
                                >
                                    <InputLabel
                                        sx={{ color: "white" }}
                                        id="demo-simple-select-helper-label"
                                    >
                                        Type
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={type}
                                        label="Type"
                                        onChange={handleChange}
                                        sx={{
                                            color: "white",
                                            borderColor: "gray",
                                        }}
                                    >
                                        <MenuItem value={"dataverse"}>
                                            Dataverse
                                        </MenuItem>
                                        <MenuItem value={"lighthouse"}>
                                            Lighthouse
                                        </MenuItem>
                                        {/* <MenuItem value={"link"}>Link</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </div>

                            {
                                // type === "dataverse" ? (
                                //   <div>
                                //     <TextField
                                //       sx={{ my: 1, minWidth: "350px" }}
                                //       onChange={(e) => setRedirectLink(e.target.value)}
                                //       id="outlined-basic"
                                //       label="URL"
                                //       variant="outlined"
                                //     />
                                //   </div>
                                // ) :
                                type === "dataverse" ? (
                                    <div>
                                        <input
                                            onChange={uploadWithDataverse}
                                            className="block w-full text-lg py-2.5 my-1 text-gray-900 border border-gray-300 rounded-sm  cursor-pointer  dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
                                            id="large_size"
                                            type="file"
                                        />

                                        <input
                                            onChange={(e) =>
                                                setConditionAddress(e.target.value)
                                            }
                                            className="block w-full text-lg py-2.5 my-1 bg-transparent text-gray-900 border border-gray-300 rounded-sm  cursor-pointer  dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
                                            id="large_size"
                                            type="text"
                                        />

                                        <button onClick={login}>Connect</button>
                                        {/* <button onClick={loadDataverse}>
                                            Load
                                        </button> */}
                                        {/* <button
                                            onClick={loadMonetizedDataverse}
                                        >
                                            LoadMonetized
                                        </button> */}

                                        {/* <br></br> */}

                                        {/* <input
                                            onChange={uploadWithDataverse}
                                            className="block w-full text-lg py-2.5 my-1 text-gray-900 border border-gray-300 rounded-sm  cursor-pointer  dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
                                            id="large_size"
                                            type="file"
                                        >
                                            Upload
                                        </input> */}
                                        {/* <button onClick={createCapability}>
                                            Create Capability
                                        </button> */}
                                    </div>
                                ) : (
                                    // type === "lighthouse" ?
                                    <div className="flex justify-between items-center gap-5">
                                        <TextField
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                        />
                                        <input
                                            onChange={uploadWithLighthouse}
                                            className="block w-full text-lg py-2.5 my-1 text-gray-900 border border-gray-300 rounded-sm  cursor-pointer  dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
                                            id="large_size"
                                            type="file"
                                        />
                                    </div>
                                )
                            }
                        </div>
                    ) : null}
                    {loading ? <Loader /> : null}
                </div>
            </div>
        </ThemeProvider>
    );
}
