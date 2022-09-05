import {useOutlet} from "react-router-dom";
import Styles from './index.module.less';

const MainLayout = () => {
  const outlet = useOutlet()

  return (
        <div className={Styles.layout}>
          <div className={Styles.header}>
            <div className={Styles.appTitle}>SATH</div>
          </div>
          {outlet}
        </div>
    );
}

export default MainLayout;
