import * as React from 'react';
import {connect} from 'react-redux';
import {IApplicationState} from '../store/reducers/reducer';
import { SPHttpClient } from '@microsoft/sp-http'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import styles from '../TrainingDeliveryProcess.module.scss';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker'; 
import {changeData,IListItem,postData,cancel} from '../store/actions/actions';


export interface IAddFormProps{
    spHttpClient: SPHttpClient;  
    siteUrl: string;
    context:WebPartContext;
    changeData: (data:any) => {};
    item:IListItem;
    postData: (spHttpClient:SPHttpClient,siteUrl:string,data:any) => {};
    onCancel: () => {};
}

class Add extends React.Component<IAddFormProps , {}>{
 
    private onFormFieldChange = (event,inputIdentifier:string) => {
        var data={
            value: event.target.value,
            field: inputIdentifier
        }
        this.props.changeData(data);
    };

    private onSubmit = () => {
        const data = {
            Title:this.props.item.Title,
            TrainingDate:this.props.item.TrainingDate,
            TrainingStatus:this.props.item.TrainingStatus,
            Description:this.props.item.Description
        }
        this.props.postData(this.props.spHttpClient,this.props.siteUrl,data);
    }

    private onCancel = () => {
        this.props.onCancel();
    }

    private onDateFieldChange = (date: Date | null | undefined) => {
        var data={
            value: date,
            field: "DATE"
        }
        this.props.changeData(data);
    };

    private _onFormatDate = (date: Date): string => { 
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(); 
    }; 
        public render():React.ReactElement<IAddFormProps>{
        return (
            <div className={styles.Add}>
                <div style={{backgroundColor:'#06d4d4',height:'25px'}}>
                            <div className={styles.FeedTitle}>ADD TRAINING</div>
                </div>
                <div className= "col-md-12" style={{backgroundColor:'white',border:'1px solid #e3e8e8'}}>
                <div className="col-md-12" style={{marginTop:'10px'}}>
                <div className="col-md-2">
                    <label style={{fontWeight:'bold'}}>Title <label style={{color:'red'}}>*</label></label>
                </div>
                <div className="col-md-10">
                    <input style={{width:'100%'}} type="text" onChange={(event)=>this.onFormFieldChange(event,"TITLE")}></input>
                </div>
            </div>
            <div className="col-md-12" style={{marginTop:'10px'}}>
                <div className="col-md-2">
                    <label style={{fontWeight:'bold'}}>Date <label style={{color:'red'}}>*</label></label>
                </div>
                <div className="col-md-10">
                <DatePicker placeholder="Select a date..."  
                            formatDate={this._onFormatDate} 
                            minDate={new Date(2000,12,30)} 
                            isMonthPickerVisible={false} 
                            onSelectDate={this.onDateFieldChange}
                        /> 
                </div>
            </div>
            
            <div className="col-md-12" style={{marginTop:'10px'}}>
                <div className="col-md-2">
                    <label style={{fontWeight:'bold'}}>Description <label style={{color:'red'}}>*</label></label>
                </div>
                <div className="col-md-10">
                    <textarea style={{minHeight:'200px',width:'100%'}} onChange={(event)=>this.onFormFieldChange(event,"DESC")}></textarea>
                </div>
            </div>
            <div className="col-md-12" style={{marginTop:'10px',marginBottom:'10px'}}>
                <div className="col-md-2">
                    <button type="button" className="btn btn-success" style={{marginLeft:'10%',width:'100%'}} onClick={()=>{this.onSubmit()}}>Submit</button>
                </div>
                <div className="col-md-2">
                    <button type="button" className="btn btn-danger" style={{marginLeft:'10%',width:'100%'}} onClick={()=>{this.onCancel()}}>Cancel</button>
                </div>
                <div className="col-md-8">
                </div>
            </div>                
                </div>
            </div>
        )
    };
}

const mapStateToProps = (state:IApplicationState) => {
    return {
        item:state.item    
    };
}

const mapDispatchToProps = (dispatch:any) => {
    return {
       changeData: (data:any) => {dispatch(changeData(data))},
       postData: (spHttpClient:SPHttpClient,siteUrl:string,data:any) => {dispatch(postData(spHttpClient,siteUrl,data))},
       onCancel: () => {dispatch(cancel())}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Add);