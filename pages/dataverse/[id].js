/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import {
    DataverseConnector,
    WALLET,
    SYSTEM_CALL,
    RESOURCE,
    Currency,
} from "@dataverse/dataverse-connector";
// import web3modal from "web3modal";
// import { ethers } from "ethers";
// import lighthouse from "@lighthouse-web3/sdk";
// import { nftContractAddress, nftContractAbi } from "../../config.js";

export default function Dataverse() {

    const [wallet, setWallet] = useState();

    let dataverseConnector ;
    if (typeof window !== "undefined") {
        dataverseConnector = new DataverseConnector();
    }

    const router = useRouter();
    const { id } = router.query;

    const [linkoData, setLinkoData] = useState({
        cid: "",
        price: "",
        usdPrice: "",
        host: "",
        linkoId: "",
    });

    useEffect(() => {
        if (id) {
            getLinko(id);
        }
    }, [id]);

    async function getLinko(id) {
        // const modal = new web3modal();
        // const connection = await modal.connect();
        // const provider = new ethers.providers.Web3Provider(connection);
        // const contract = new ethers.Contract(
        //     nftContractAddress,
        //     nftContractAbi,
        //     provider
        // );

        // console.log(id)

        // const data = await contract.idToLinko(id);
        // console.log(data);
        // let price_ = ethers.utils.formatEther(data.price);
        // let usdPrice_ = ethers.utils.formatEther(data.usdPrice);
        // console.log(data[4].toNumber())
        setLinkoData({
            cid: id,
            // price: price_,
            // usdPrice: usdPrice_,
            // host: data[3].toString(),
            linkoId: id,
        });
    }

    const [fName, setfName] = useState()
    const [fLink, setfLink] = useState()

    const loadDataverse = async (streamId) => {
        // const streamId =
        //     "kjzl6kcym7w8y98lv98ll0rtzkfcflw9njf944xj596a7eaqiwzjm3atdihkake";
        const res = await dataverseConnector.runOS({
            method: SYSTEM_CALL.loadStream,
            params: streamId,
        });

        console.log(res.streamContent.content.images[0]);
        console.log(res.streamContent.content.text)
        setfLink(res.streamContent.content.images[0])
        setfName(res.streamContent.content.text)
    };

    const buy = async () => {
        await loadDataverse(id);
        // const fileName = await 
        Download(fName, fLink);
    };

    // const buyAccess = async (prop) => {
    //     const modal = new web3modal();
    //     const connection = await modal.connect();
    //     const provider = new ethers.providers.Web3Provider(connection);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(
    //         nftContractAddress,
    //         nftContractAbi,
    //         signer
    //     );

    //     const price = ethers.utils.parseUnits(prop.price.toString(), "ether");

    //     const tx = await contract.mint(prop.linkoId, {
    //         value: price,
    //         gasLimit: 1000000,
    //     });
    //     await tx.wait();
    //     decrypt(prop.cid);

    //     console.log(tx);
    // };

    // const encryptionSignature = async () => {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const address = await signer.getAddress();
    //     const messageRequested = (await lighthouse.getAuthMessage(address)).data
    //         .message;
    //     const signedMessage = await signer.signMessage(messageRequested);
    //     return {
    //         signedMessage: signedMessage,
    //         publicKey: address,
    //     };
    // };

    // const decrypt = async (cid) => {
    //     const { publicKey, signedMessage } = await encryptionSignature();

    //     const keyObject = await lighthouse.fetchEncryptionKey(
    //         cid,
    //         publicKey,
    //         signedMessage
    //     );

    //     const fileType = "image/jpeg";
    //     const decrypted = await lighthouse.decryptFile(
    //         cid,
    //         keyObject.data.key,
    //         fileType
    //     );
    //     console.log(decrypted);

    //     const url = URL.createObjectURL(decrypted);
    //     console.log(url);
    //     // setFileURL(url);
    //     Download(cid, url);
    // };

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

    function Download(_fileName, _fileUrl) {
        const name = _fileName;
        const fileUrl = _fileUrl ;
        console.log("files:", _fileUrl, _fileName)
        saveAs(_fileUrl, _fileName);
    }

    return (
        <div className="mt-10 relative">
            <div className="block w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="flex justify-between">
                    <div>
                        <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Stream ID: {linkoData.cid}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                        {/* price: {linkoData.price}FIL | USD Price : $ */}
                        {linkoData.usdPrice}
                    </p>
                    <div className="gap-4">
                        <button
                            onClick={() => {
                                login();
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Connect
                        </button>
                        <button
                            onClick={() => {
                                buy();
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {/* {
              loading
              ? <Loader />
              : null
              } */}
            </div>
        </div>
    );
}
