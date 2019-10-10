import * as React from 'react';
import {ITrainingDeliveryProcessProps} from '../ITrainingDeliveryProcessProps';
import {initData,IListItem,addData,editData} from '../store/actions/actions';
import {connect} from 'react-redux';
import {IApplicationState} from '../store/reducers/reducer';
import { SPHttpClient } from '@microsoft/sp-http'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from '../TrainingDeliveryProcess.module.scss';
import Spinner from '../Spinner/Spinner';

export interface IStoreProps {
    items:IListItem[];
    onFetchData: (spHttpClient:SPHttpClient,siteUrl:string,listName:string) => {};
    spHttpClient: SPHttpClient;  
    siteUrl: string;
    context:WebPartContext;
    listName:string;
    onAddData: () => {},
    onEditData: (data:IListItem) => {},
    spinner:boolean
  }

class Display extends React.Component<IStoreProps,{}>{

    componentDidMount(){
        this.props.onFetchData(this.props.spHttpClient,this.props.siteUrl,this.props.listName);
    }

    public render():React.ReactElement<IStoreProps>{
        let allItems = null;
        if(this.props.items.length>0){
            let userName=this.props.context.pageContext.user.displayName;
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
                            <div style={{display:'inline',textAlign:'left',paddingLeft:'10px',color:'#2ea808'}}><i className="fa fa-clock-o" style={{fontSize:'18px',paddingRight:'5px',color:'#2ea808'}}>{GetFormattedDate(item.TrainingDate)}</i></div>
                            <div style={{display:'inline',textAlign:'right',paddingLeft:'20px',color:'#2ea808'}}><i className="fa fa-user" style={{fontSize:'18px',color:'#2ea808',paddingRight:'5px'}}>{item.Author.Title}</i></div>
                            <div style={{display:'inline',textAlign:'left',paddingLeft:'10px'}}>{item.Author.Title==userName?(<button type="button" className="btn btn-primary" style={{backgroundColor:'white',width:'70px',color:'grey',border:'1px solid #e3e6e6'}} onClick={()=>this.props.onEditData(item)}>Edit</button>):null}</div>
                        </div>
                    </div>
                </div>
        ))
        }
        if(this.props.spinner){
            allItems=<Spinner/>;
        }
        
        return(
                    <div>
                        <div style={{marginLeft:'5%',marginRight:'5%',width:'90%',height:'40px',textAlign:'right',paddingTop:'10px'}}>
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
        items:state.items,
        spinner:state.showSpinner    
    };
}
const mapDispatchToProps = (dispatch:any) => {
    return {
        onFetchData: (spHttpClient:SPHttpClient,siteUrl:string,listName:string) => {dispatch(initData(spHttpClient,siteUrl,listName))},
        onAddData: () => {dispatch(addData())},
        onEditData:(data:IListItem)=>{dispatch(editData(data))}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Display);