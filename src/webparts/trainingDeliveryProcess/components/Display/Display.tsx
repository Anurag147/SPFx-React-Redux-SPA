import * as React from 'react';
import {initData,IListItem,addData,editData,postDeleteData} from '../store/actions/actions';
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
    postDeleteData: (spHttpClient: SPHttpClient, siteUrl:string,listName:string,Id:number) => {},
    spinner:boolean
  }

class Display extends React.Component<IStoreProps,{}>{

    componentDidMount(){
        this.props.onFetchData(this.props.spHttpClient,this.props.siteUrl,this.props.listName);
    }

    public render():React.ReactElement<IStoreProps>{
        let allItems = null;
        let displayButtonClass="btn btn-primary "+ styles.EditButton;
        let deleteButtonClass="btn btn-danger "+ styles.EditButton;
        let dateIconClass="fa fa-clock-o "+ styles.FontIcon;
        let personIconClass="fa fa-user "+ styles.FontIcon;

        if(this.props.items.length>0){
            let userName=this.props.context.pageContext.user.displayName;
            allItems = this.props.items.map(item=>(
                <div className={styles.Feed}>
                    <div className={styles.DisplayLabel}>
                        <div className={styles.FeedTitle}>{item.Title}</div>
                    </div>
                    <div className={styles.DisplayPanel}>
                        <div className={styles.DescriptionPanel}>
                            <div className={styles.FeedDescription}>{item.Description}</div>
                        </div>
                        <div className={styles.DisplayInfo}>
                            <div className={styles.DatePanel}><i className={dateIconClass}>{GetFormattedDate(item.TrainingDate)}</i></div>
                            <div className={styles.PersonPanel}><i className={personIconClass}>{item.Author.Title}</i></div>
                            <div className={styles.EditPanel}>{item.Author.Title==userName?(<button type="button" className={displayButtonClass} onClick={()=>this.props.onEditData(item)}>Edit</button>):null}</div>
                            <div className={styles.EditPanel}>{item.Author.Title==userName?(<button type="button" className={deleteButtonClass} onClick={()=>this.props.postDeleteData(this.props.spHttpClient,this.props.siteUrl,this.props.listName,item.Id)}>Delete</button>):null}</div>
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
                        <div className={styles.ButtonPanel}>
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
        onEditData:(data:IListItem)=>{dispatch(editData(data))},
        postDeleteData: (spHttpClient: SPHttpClient, siteUrl:string,listName:string,Id:number) => {dispatch(postDeleteData(spHttpClient,siteUrl,listName,Id))}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Display);