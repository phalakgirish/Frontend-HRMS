import React from "react";
import { useState,useRef } from "react";
const ProfilePicture = ({ form, setForm }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleBrowseClick = () => {
        fileInputRef.current.click(); 
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) return alert("Please select a file");
        const formData = new FormData();
        formData.append("image", selectedFile);
        console.log("File ready to upload:", selectedFile);
    };
    return (
        <div>
            <div className="container-fluid mt-4">
                <form>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <div className="text-start">
                                <button type="button" className="btn btn-sm add-btn" onClick={handleBrowseClick}>
                                    Browse
                                </button>
                            </div>
                            <label style={{ fontSize: "10px" }}>Upload files only: gif,png,jpg,jpeg</label>
                            <div className="text-start">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>


                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePicture;