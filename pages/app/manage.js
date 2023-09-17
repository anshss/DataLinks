import React, { useEffect } from 'react'
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { upload } from "@spheron/browser-upload";
import { useState } from "react";
import { Database } from "@tableland/sdk";
import LinkCard from '@/components/linkCard';

export default function Dashboard() {
    const [inputLink, setInputLink] = useState("");
    const [linkData, setLinkData] = useState([])
    const [location, setLocation] = useState();
    const [open, setOpen] = useState()
    console.log(linkData)
    useEffect(() => {
        setLocation(window.location);
      }, []);

    const tableName = "linko_links_80001_6516"; 
    const id = "link1"

    const db = new Database();
    async function getData(){
        try{
            const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
            setLinkData(results)
        }
        catch(e){
            console.log(e)
        }
     }

     console.log(linkData)
     useEffect(() => {
        getData()
     }, [])

     console.log()


    // ---------- spheron

    // const uploadWithSpheron = async (e) => {
    //     const response = await fetch(`https://linko-deploy.vercel.app/api/hello`); // get the temporary access token from server
    //     // console.log(response);
    //     const resJson = await response.json();
    //     // console.log(resJson);
    //     const token = resJson.uploadToken;

    //     const files = e.target.files[0];
    //     // console.log(files);

    //     let currentlyUploaded = 0;

    //     const { uploadId, bucketId, protocolLink, dynamicLinks } = await upload([files], {
    //             token,
    //             onChunkUploaded: (uploadedSize, totalSize) => {
    //                 currentlyUploaded += uploadedSize;
    //                 console.log(
    //                     `Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`
    //                 );
    //             },
    //         }
    //     );
    //     console.log(`${protocolLink}/${files.name}`)
    //     setInputLink(`${protocolLink}/${files.name}`)
    // };

    // ----------

    console.log(open)

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    {/* <button>Manage</button>
                    <input type="file" onChange={uploadWithSpheron} />
                    <input
                        type="name"
                        onChange={(e) => setInputLink(e.target.value)}
                    /> */}
                    <h2 className='text-center text-4xl font-bold mt-4'>Your Linkos</h2>

                    {linkData.map((item, index) => {
                        return <LinkCard getData={getData} onClick={() => setOpen(index)} open={index===open} redirectTo={item.link} key={item.id} id={item.id} link={location?.origin + "/" + item.id}/>
                    }) }
                </div>
            </div>
        </div>
    );
}
