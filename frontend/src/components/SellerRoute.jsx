import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);
    return userInfo && userInfo.role === 'seller' ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default SellerRoute;
