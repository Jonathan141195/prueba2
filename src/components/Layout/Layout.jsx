import Header from './Header';
import { Footer } from './Footer';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
Layout.propTypes = { children: PropTypes.node.isRequired };
export function Layout({ children }) {
    return (
        <>
            <Header />
            <Container
                maxWidth='xl'
                style={{ paddingTop: '1rem', paddingBottom: '3rem' }}
                className='h-screen mx-auto'
            >
                {children}
            </Container>
            <Footer />
        </>
    );
}