import { upload } from "@spheron/browser-upload";
import { Web3Storage } from "web3.storage";

export function Dashboard() {

    // ---------- web3.storage

    const web3StorageKey = process.env.NEXT_PUBLIC_WEB3STORAGE;

    function getAccessToken() {
        return web3StorageKey;
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    const uploadToIPFS = async (files) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        return cid;
    };

    const uploadWithWeb3Storage = async (e) => {
        const data = e.target.files[0]
        const files = [new File([data], "data.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
            console.log(metaUrl);
            return metaUrl;
        } catch (error) {
            console.log("Error uploading:", error);
        }
    };

    // ---------- spheron
    
    const uploadWithSpheron = async (e) => {
        
        const response = await fetch(`https://linko-deploy.vercel.app/api/hello`); // get the temporary access token from server
        console.log(response)
        const resJson = await response.json();
        console.log(resJson)
        const token = resJson.uploadToken;

        const files = e.target.files[0]
        console.log(files)

        let currentlyUploaded = 0;

        const { uploadId, bucketId, protocolLink, dynamicLinks } = await upload(
            [files],
            {
                token,
                onChunkUploaded: (uploadedSize, totalSize) => {
                    currentlyUploaded += uploadedSize;
                    console.log(
                        `Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`
                    );
                },
            }
        );
    };

    // ----------

    return (
        <div>
            test
            <div>
                <input type="file" onChange={uploadWithSpheron} />
                <input type="file" onChange={uploadWithWeb3Storage} />
                {/* <input type="name" placeholder="paste a link" onChange={uploadWithSpheron}/> */}
                {/* <button onClick={map}>Upload</button> */}
                {/* <button onClick={map}>Upload</button> */}
            </div>
        </div>
    );
}
