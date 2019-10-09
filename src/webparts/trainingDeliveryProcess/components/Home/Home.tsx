import * as React from 'react';
import {connect} from 'react-redux';
import {IApplicationState} from '../store/reducers/reducer';
import { SPHttpClient } from '@microsoft/sp-http'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from '../TrainingDeliveryProcess.module.scss';
import Display from '../Display/Display';
import Add from '../Add/Add';

export interface ISPContextProps {
    spHttpClient: SPHttpClient;  
    siteUrl: string;
    listName:string;
    context:WebPartContext;
    isAddFormEnabled:boolean
  }

class Home extends React.Component<ISPContextProps,{}>{
    public render():React.ReactElement<ISPContextProps>{
        
        let componentTobeDisplayed = null;
        if(!this.props.isAddFormEnabled){
            componentTobeDisplayed= 
                <Display context={this.props.context} 
                    spHttpClient={this.props.spHttpClient} 
                    siteUrl= {this.props.siteUrl}
                    listName={this.props.listName}/>
            ;
        }
        else{
            componentTobeDisplayed= 
                <Add context={this.props.context} 
                    spHttpClient={this.props.spHttpClient} 
                    siteUrl= {this.props.siteUrl}
                    listName={this.props.listName}/>
            ;
        }
        return(
            <div className={styles.trainingDeliveryProcess }>
                <div className={styles.container }>
                        {componentTobeDisplayed}         
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state:IApplicationState) => {
    return {
        isAddFormEnabled:state.isAddFormEnabled    
    };
}

export default connect(mapStateToProps)(Home);