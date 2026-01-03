import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
// import ForgotPassword from "../ForgotPassword/forgotPassword"; // Not needed for signup? Or maybe keep it? usually not needed
import { GoogleIcon } from "../../shared/customIcons";
import AppTheme from "../../shared/AppTheme";
import ColorModeSelect from "../../shared/ColorModeSelect";
import { Link, useNavigate } from "react-router-dom";
import React, { FormEvent } from "react";
import { registerUser } from "../../firebase/auth";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ROUTES } from "../../constants/routes.constants";
import { handleError } from "../../utils/error.utils";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
    minHeight: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
}));

export default function Signup(props: { disableCustomTheme?: boolean }) {
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (nameError || emailError || passwordError) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            // Run validation if empty
            validateInputs();
            return;
        }

        try {
            const user = await registerUser(email, password);
            // NOTE: Here you might want to update the user profile with 'name'
            // await updateProfile(user, { displayName: name }); 
            if (user) {
                navigate(`${ROUTES.DASHBOARD.ROOT}/${ROUTES.DASHBOARD.HOME}`);
            }
        } catch (error) {
            handleError(error, "Registration failed");
        }
    };

    const validateInputs = () => {
        const name = document.getElementById("name") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        let isValid = true;

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Name is required.");
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        return isValid;
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column" justifyContent="space-between">
                <ColorModeSelect
                    sx={{ position: "fixed", top: "1rem", right: "1rem" }}
                />
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                    >
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Full Name</FormLabel>
                            <TextField
                                error={nameError}
                                helperText={nameErrorMessage}
                                id="name"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                autoComplete="name"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={nameError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl variant="outlined" fullWidth>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                id="password"
                                type={showPassword ? "text" : "password"}
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                variant="outlined"
                                placeholder="******"
                                fullWidth
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? "hide password" : "show password"
                                                    }
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    sx={{
                                                        border: 0,
                                                        backgroundColor: "transparent",
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </FormControl>
                        {/* <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Button
                            fullWidth
                            disabled
                            variant="outlined"
                            onClick={() => alert("Sign up with Google")}
                            startIcon={<GoogleIcon />}
                        >
                            Sign up with Google
                        </Button>
                        <Typography sx={{ textAlign: "center" }}>
                            Already have an account?{" "}
                            <Link to={ROUTES.LOGIN}>Sign in</Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
