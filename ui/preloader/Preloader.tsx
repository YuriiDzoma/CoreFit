import styles from './Preloader.module.scss';
import Image from 'next/image';
import logo from '@/public/logos/logo.png';

const Preloader = () => {
    return (
        <div className={styles.preloader}>
            <div className={styles.inner}>
                <div className={styles.logoWrap}>
                    <Image src={logo} alt="preloader" width={80} height={80} />
                </div>
                <span className={styles.loader}/>
            </div>
        </div>
    );
};

export default Preloader;