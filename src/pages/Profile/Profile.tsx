import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { useGlobalUI } from "../../context/globalUIContext";
import { createDocument, getDocument, updateDocument } from "../../firebase/firebaseUtils";

export default function Profile() {
    const { user } = useAuth();
    const { showToast, openAlert, setLoading } = useGlobalUI();

    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            setPhotoURL(user.photoURL || "");
            fetchExtraDetails();
        }
    }, [user]);

    const fetchExtraDetails = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const doc = await getDocument<{ phone: string; company: string; address: string }>(
                "users",
                user.uid
            );
            if (doc) {
                setPhone(doc.phone || "");
                setCompany(doc.company || "");
                setAddress(doc.address || "");
            }
        } catch (error) {
            console.error("Error fetching user details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Update Firebase Auth Profile
            if (name !== user.displayName || photoURL !== user.photoURL) {
                await updateProfile(user, {
                    displayName: name,
                    photoURL: photoURL,
                });
            }

            // Update/Create Firestore Document
            const userRef = await getDocument("users", user.uid);
            const data = { phone, company, address };

            if (userRef) {
                await updateDocument("users", user.uid, data);
            } else {
                await createDocument("users", data, user.uid);
            }

            showToast("Profile updated successfully!");
            setIsEditing(false);
        } catch (error: any) {
            openAlert(`Failed to update profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                My Profile
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 33%' } }}>
                    <Card variant="outlined">
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Avatar
                                src={photoURL || user?.photoURL || ""}
                                alt={name}
                                sx={{ width: 100, height: 100 }}
                            />
                            <Typography variant="h6">{user?.displayName || "User"}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email}
                            </Typography>
                            <Button variant="outlined" fullWidth onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancel Edit" : "Edit Profile"}
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                />
                                <TextField
                                    label="Photo URL"
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    helperText="Enter a publicly accessible URL for your avatar"
                                />
                                <TextField
                                    label="Email"
                                    value={user?.email || ""}
                                    disabled
                                    fullWidth
                                />
                                <TextField
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                />
                                <TextField
                                    label="Company Name"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                />
                                <TextField
                                    label="Company Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                                {isEditing && (
                                    <Button variant="contained" onClick={handleSave} sx={{ alignSelf: "flex-start" }}>
                                        Save Changes
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
