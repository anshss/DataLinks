import { useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { nftContractAddress, nftContractAbi } from "../config.js";
import web3modal from "web3modal";

export default function Encrypt() {
    const [formInput, setFormInput] = useState({
        file: null,
        price: "",
    });

    const lighthouseKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY;

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

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };

    // main function
    const uploadFileEncrypted = async (e) => {
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
        setFormInput({...formInput, file: response.data.Hash});
    };

    const applyAccessConditions = async (cid) => {
        const conditions = [
            {
                id: 1,
                chain: "mumbai",
                method: "balanceOf",
                standardContractType: "ERC721",
                contractAddress: "0xC5e8493f291A510fa9181C01F172A711cfEf2b38",
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

        const price = ethers.utils.parseEther(formInput.price);

        const tx = await contract.setViewCollection(formInput.file, price);
        await tx.wait();

        console.log(tx);
    };

    return (
        <div className="App">
            <input onChange={(e) => uploadFileEncrypted(e)} type="file" />
            <input
                name="price"
                placeholder="Fil"
                required
                onChange={(e) =>
                    setFormInput({
                        ...formInput,
                        price: e.target.value,
                    })
                }
            />

            <button onClick={setViewCollection}>Publish</button>
        </div>
    );
}
