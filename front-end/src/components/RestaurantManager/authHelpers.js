
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('restaurantRefreshToken');

    if (!refreshToken) {
        window.location.href = '/restaurant-manager/login'; // 🔥 use window.location instead inside non-component files
        return false;
    }

    try {
        const response = await fetch('/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`
            }
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('restaurantAccessToken', data.access_token);
            return true;
        } else {
            localStorage.clear();
            window.location.href = '/restaurant-manager/login';
            return false;
        }
    } catch {
        localStorage.clear();
        window.location.href = '/restaurant-manager/login';
        return false;
    }
};
