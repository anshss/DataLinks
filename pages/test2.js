import { useEffect, useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { nftContractAddress, nftContractAbi } from "../config.js";
import { saveAs } from "file-saver";
import web3modal from "web3modal";
export default function Decrypt() {
    
    const [fileURL, setFileURL] = useState(null);
    const [linkos, setLinkos] = useState([])

    useEffect(() => {
        fetchPaidLinks()
    }, [])

    const fetchPaidLinks = async () => {
        const modal = new web3modal();
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = new ethers.Contract(
            nftContractAddress,
            nftContractAbi,
            provider
        );

        const data = await contract.fetchLinko();

        const items = await Promise.all(
            data.map(async (i) => {
                let price = ethers.utils.formatEther(i.price);
                let usdPrice = ethers.utils.formatEther(i.usdPrice);
                let item = {
                    cid: i.cid,
                    price,
                    usdPrice,
                    host: i.host.toString(),
                    linkoId: i.linkoId,
                };
                return item;
            })
            );
            
            console.log(items);
            setLinkos(items);

    };


    const buyAccess = async (prop) => {

        const modal = new web3modal();
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            nftContractAddress,
            nftContractAbi,
            signer
        );

        const price = ethers.utils.parseUnits(prop.price.toString(), "ether");

        const tx = await contract.mint(prop.linkoId, {
            value: price,
            gasLimit: 1000000,
        });
        await tx.wait();
        decrypt(prop.cid)

        console.log(tx)
    } 

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

    const decrypt = async (cid) => {
        const { publicKey, signedMessage } = await encryptionSignature();

        const keyObject = await lighthouse.fetchEncryptionKey(
            cid,
            publicKey,
            signedMessage
        );

        const fileType = "image/jpeg";
        const decrypted = await lighthouse.decryptFile(
            cid,
            keyObject.data.key,
            fileType
        );
        console.log(decrypted);

        const url = URL.createObjectURL(decrypted);
        console.log(url);
        setFileURL(url);
        Download(cid, url)
    };

    async function Download(_fileName, _fileUrl) {
        const name = _fileName;
        const fileUrl = _fileUrl;
        saveAs(fileUrl, name);
    }

    function LinkoCard(prop) {
        return(
            <div>
                <div>cid : {prop.cid}</div>
                <div>price : {prop.price}</div>
                <div>usdPrice : {prop.usdPrice}</div>
                <div onClick={() => buyAccess(prop)}>
                    <p>Buy</p>
                </div>
            </div>
        )
    }

    // return (
    //     <div className="App">
    //         <button onClick={() => decrypt()}>decrypt</button>
    //         {fileURL ? (
    //             <a href={fileURL} target="_blank">
    //                 viewFile
    //             </a>
    //         ) : null}
    //     </div>
    // );

    return (
        <>
            <div>
                <div>
                    {linkos.map((item, i) => (
                        <LinkoCard
                            key={i}
                            cid={item.cid}
                            price={item.price}
                            usdPrice={item.usdPrice}
                            host={item.host}
                            linkoId={item.linkoId}
                        />
                    ))}
                </div>
            </div>
        </>
    );

}
