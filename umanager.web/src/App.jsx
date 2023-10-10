import { Layout } from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { PrivateRoute } from './components/auth/PrivateRoute';

export default function App() {
    return (
        <Layout>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, requireAuth, ...rest } = route;
                    return <Route key={index} {...rest} element={requireAuth ? <PrivateRoute {...rest}  element={element} /> : element } />;
                })}
            </Routes>
        </Layout>
    );
}
