import * as React from 'react';
import styles from './TrainingDeliveryProcess.module.scss';
import { ITrainingDeliveryProcessProps } from './ITrainingDeliveryProcessProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class TrainingDeliveryProcess extends React.Component<ITrainingDeliveryProcessProps, {}> {
  public render(): React.ReactElement<ITrainingDeliveryProcessProps> {
    return (
      <div className={ styles.trainingDeliveryProcess }>
        <div className={ styles.container }>
          <div className={ styles.row }>
           
          </div>
        </div>
      </div>
    );
  }
}
