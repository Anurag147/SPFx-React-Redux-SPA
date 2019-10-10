import * as React from 'react';
import styles from '../TrainingDeliveryProcess.module.scss';

export interface ISpinnerProps {
    
  }

class Spinner extends React.Component<ISpinnerProps,{}>{
    public render():React.ReactElement<ISpinnerProps>{
       return (
        <div className={styles.Loader}>Loading...</div>
       );
    }
}
export default Spinner;