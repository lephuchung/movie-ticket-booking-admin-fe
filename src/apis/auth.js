export const signIn = async (formData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/auth/signin/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.accessToken);
            localStorage.setItem("user", JSON.stringify(result.user));
            return { success: true, token: result.token, user: result.user };
        } else {
            return { success: false, error: result.error, status: response.status };
        }
    } catch (error) {
        return { success: false, error: "Something went wrong!" };
    }
};

export const signOut = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found, user already logged out.");
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/auth/signout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Điều hướng người dùng về trang chủ
            window.location.href = "/";
        } else {
            console.error("Logout failed:", result.error);
        }
    } catch (error) {
        console.error("An error occurred while logging out:", error.message);
    }
};