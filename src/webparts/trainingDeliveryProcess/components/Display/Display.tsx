import * as React from 'react';
import {ITrainingDeliveryProcessProps} from '../ITrainingDeliveryProcessProps';
import {initData,IListItem,addData} from '../store/actions/actions';
import {connect} from 'react-redux';
import {IApplicationState} from '../store/reducers/reducer';
import { SPHttpClient } from '@microsoft/sp-http'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from '../TrainingDeliveryProcess.module.scss';

export interface IStoreProps {
    items:IListItem[];
    onFetchData: (spHttpClient:SPHttpClient,siteUrl:string) => {};
    spHttpClient: SPHttpClient;  
    siteUrl: string;
    context:WebPartContext;
    onAddData: () => {}
  }

class Display extends React.Component<IStoreProps,{}>{

    componentDidMount(){
        this.props.onFetchData(this.props.spHttpClient,this.props.siteUrl);
    }

    public render():React.ReactElement<IStoreProps>{
        let allItems = null;
        if(this.props.items.length>0){
            allItems = this.props.items.map(item=>(
                    <div className={styles.Feed}>
                        <div style={{backgroundColor:'#06d4d4',height:'25px'}}>
                            <div className={styles.FeedTitle}>{item.Title}</div>
                        </div>
                        <div style={{border: '1px solid #e3e8e8'}}>
                            <div style={{paddingTop:'10px',paddingBottom:'10px'}}>
                                <div className={styles.FeedDescription}>{item.Description}</div>
                            </div>
                            <div style={{paddingBottom:'10px',fontSize:'small'}}>
                                <div style={{display:'inline',width:'50%',textAlign:'left',paddingLeft:'10px',color:'#2ea808'}}><i className="fa fa-clock-o" style={{fontSize:'18px',paddingRight:'5px',color:'#2ea808'}}></i>{GetFormattedDate(item.TrainingDate)}</div>
                                <div style={{display:'inline',width:'50%',textAlign:'right',paddingLeft:'90px',color:'#2ea808'}}><i className="fa fa-user" style={{fontSize:'18px',color:'#2ea808',paddingRight:'5px'}}></i>{item.Author.Title}</div>
                            </div>
                        </div>
                    </div>
            ))
        }
        return(
                    <div>
                        <div style={{marginLeft:'15%',marginRight:'15%',width:'70%',height:'40px',textAlign:'right',paddingTop:'10px'}}>
                            <button type="button" className="btn btn-danger" onClick={this.props.onAddData}>ADD TRAINING</button>
                        </div>
                        <div style={{height:'10px'}}>

                        </div>
                        {allItems}
                    </div>                   
        );
    }
}

const GetFormattedDate = (createdDate:Date):string => {
    var date:Date = new Date(createdDate.toString());
    var month:number=date.getMonth()+1;
    return date.getDate() + "/" + month + "/" + date.getFullYear();
}

const mapStateToProps = (state:IApplicationState) => {
    return {
        items:state.items    
    };
}
const mapDispatchToProps = (dispatch:any) => {
    return {
        onFetchData: (spHttpClient:SPHttpClient,siteUrl:string) => {dispatch(initData(spHttpClient,siteUrl))},
        onAddData: () => {dispatch(addData())}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Display);