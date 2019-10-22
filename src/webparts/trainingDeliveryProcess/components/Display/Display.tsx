import * as React from 'react';
import {initData,IListItem,addData,editData,postDeleteData,searchData} from '../store/actions/actions';
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
    searchData: (data:string) => {},
    spinner:boolean
  }

class Display extends React.Component<IStoreProps,{}>{

    componentDidMount(){
        this.props.onFetchData(this.props.spHttpClient,this.props.siteUrl,this.props.listName);
    }

    private onSearchFieldChange = (event) => {
        this.props.searchData(event.target.value);
    };

    public render():React.ReactElement<IStoreProps>{
        let allItems = null;
        let displayButtonClass="btn btn-primary "+ styles.EditButton;
        let deleteButtonClass="btn btn-danger "+ styles.EditButton;
        let dateIconClass="fa fa-clock-o "+ styles.FontIcon;
        let personIconClass="fa fa-user "+ styles.FontIcon;

        if(this.props.items.length>0){
            let userName=this.props.context.pageContext.user.displayName;
            let locations:string = "";
            allItems = this.props.items.map(item=>(
                <div className={styles.Feed}>
                    <div className={styles.DisplayLabel}>
                        <div className={styles.FeedTitle}>{item.Title}</div>
                    </div>
                    <div className={styles.DisplayPanel}>
                        <div style={{textAlign:'right',marginRight:'5px',marginTop:'5px'}}>
                            <div className={styles.EditPanel}>{item.Author.Title==userName?(<i style={{color:'black',fontSize:'20px'}} className="fa fa-edit" onClick={()=>this.props.onEditData(item)}></i>):null}</div>
                            <div className={styles.EditPanel}>{item.Author.Title==userName?(<i style={{color:'#ff4d4d',fontSize:'20px'}} className="fa fa-trash" onClick={()=>this.props.postDeleteData(this.props.spHttpClient,this.props.siteUrl,this.props.listName,item.Id)}></i>):null}</div>
                        </div>
                        <div className={styles.DescriptionPanel}>
                            <div className={styles.FeedDescription}>{item.Description}</div>
                        </div>
                        <div className={styles.DisplayInfo}>
                            <div className={styles.DatePanel}><i className={dateIconClass}>{" "+GetFormattedDate(item.TrainingDate)}</i></div>
                            <div className={styles.PersonPanel}><i className={personIconClass}>{" "+item.Author.Title}</i></div>
                            <div className={styles.PersonPanel}>{item.Location!=null && item.Location.length>0 ?(<i className={personIconClass}>{item.Location.length==1?item.Location.map(i=>(" "+i.Label)):item.Location.map(i=>(i.Label+","))}</i>):""}</div>
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
                            <input type="text" onChange={(event)=>this.onSearchFieldChange(event)} className={styles.SearchTab} placeholder=" Search Training "></input>
                            <button type="button" className="btn btn-danger" onClick={this.props.onAddData}>ADD</button>
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
    var allMonths:string[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return date.getDate() + "-" + allMonths[month+1] + "-" + date.getFullYear();
}

const mapStateToProps = (state:IApplicationState) => {
    return {
        items:state.searchedItems,
        spinner:state.showSpinner    
    };
}
const mapDispatchToProps = (dispatch:any) => {
    return {
        onFetchData: (spHttpClient:SPHttpClient,siteUrl:string,listName:string) => {dispatch(initData(spHttpClient,siteUrl,listName))},
        onAddData: () => {dispatch(addData())},
        searchData:(data:string) => {dispatch(searchData(data))},
        onEditData:(data:IListItem)=>{dispatch(editData(data))},
        postDeleteData: (spHttpClient: SPHttpClient, siteUrl:string,listName:string,Id:number) => {dispatch(postDeleteData(spHttpClient,siteUrl,listName,Id))}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Display);