// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { SpheronClient, ProtocolEnum } from "@spheron/storage";

export default async function handler(req, res) {
  try {
    const bucketName = "linko-file-upload";
    const protocol = ProtocolEnum.IPFS;

    const client = new SpheronClient({
      token: process.env.NEXT_PUBLIC_SPHERON_TOKEN,
    });

    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });

    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.log("error is", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}