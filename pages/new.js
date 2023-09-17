import { Navbar } from "@/components/navbar";

export default function New() {
    return (
        <div>
            <Navbar />
            <p>new</p>
            <video controls autoplay name="media">
                <source
                    src="https://gateway.lighthouse.storage/ipfs/QmdQN5R6F8mU4X8qZ3bUXCnCRNKCeaRZ1L2YjPKrbaEmh8"
                    type="video/webm"
                />
            </video>
        </div>
    );
}
