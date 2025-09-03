import React, { useState, useEffect } from "react";
import { uploadProfile, getProfile, deleteProfile } from "./apis/profileApi";
import { toast } from "react-toastify";

const ProfilePicture = ({ employeeId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileUrl, setProfileUrl] = useState(null);

    useEffect(() => {
        if (employeeId) {
            getProfile(employeeId)
                .then((res) => {
                    if (res.data && res.data.profileUrl) {
                        setProfileUrl(res.data.profileUrl);
                    }
                })
                .catch((err) => console.error("Error fetching profile:", err));
        }
    }, [employeeId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.warn("⚠️ Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("employeeId", employeeId);

        try {
            const res = await uploadProfile(formData);
            setProfileUrl(res.data.imageUrl);
            setSelectedFile(null);

            toast.success("Profile picture uploaded successfully!");
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProfile(employeeId);
            setProfileUrl(null);
            toast.success("Profile deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete profile!");
        }
    };



    return (
        <div className="container mt-4">
            <h5>Profile Picture</h5>

            {profileUrl && (
                <div className="mb-3">
                    <img
                        src={profileUrl}
                        alt="Profile"
                        style={{ width: "120px", height: "120px" }}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={handleFileChange}
                />
                <button type="submit" className="btn btn-sm add-btn">
                    Upload
                </button>
                {profileUrl && (
                    <button className="btn btn-sm btn-danger ms-2" onClick={handleDelete}>
                        Delete
                    </button>
                )}

            </form>
        </div>
    );
};

export default ProfilePicture;
