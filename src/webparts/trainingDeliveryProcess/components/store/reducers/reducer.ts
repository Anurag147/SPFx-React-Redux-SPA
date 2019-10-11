import {IAction,actionTypes,IListItem} from '../actions/actions';
import {Reducer } from 'redux';

export interface IApplicationState{
    items: IListItem[];
    isAddFormEnabled:boolean;
    item:IListItem;
    isFormvalid:boolean;
    isDateValid:boolean;
    showSpinner:boolean;
    showPanel:boolean;
}

const initialState: IApplicationState = {
    items:[],
    isAddFormEnabled:false,
    item:{Title:"",Description:"",TrainingStatus:"Pending ",TrainingDate:new Date(),Author:null,Id:0},
    isFormvalid:true,
    isDateValid:true,
    showSpinner:false,
    showPanel:false
};

export const trainingReducer:Reducer<IApplicationState> = (state: IApplicationState = initialState, action:IAction) => {
    if(action.type==actionTypes.SET_DATA){
        let newState:IApplicationState = {...state};
        newState.items=action.data;
        newState.showSpinner=false;
        return newState;
    }
    if(action.type==actionTypes.ADD_DATA){
        let newState:IApplicationState = {...state};
        newState.isAddFormEnabled=true;
        newState.item=initialState.item;
        return newState;
    }
    if(action.type==actionTypes.SET_EDIT){
        let newState:IApplicationState = {...state};
        newState.item=action.data;
        newState.isAddFormEnabled=true;
        newState.item.TrainingDate=new Date(newState.item.TrainingDate.toString());
        return newState;
    }
    if(action.type==actionTypes.SHOW_PANEL){
        let newState:IApplicationState = {...state};
        newState.showPanel=action.data;
        return newState;
    }
    if(action.type==actionTypes.EVENT){
        let newState:IApplicationState = {...state};
        var data=action.data;
        if(data.field=="TITLE"){
            newState.item.Title=data.value;
        }
        if(data.field=="DATE"){
            newState.item.TrainingDate=data.value;
        }
        if(data.field=="DESC"){
            newState.item.Description=data.value;
        }
        return newState;
    }
    if(action.type==actionTypes.ADD_SUCCESS){
        let newState:IApplicationState = {...state};
        newState.isAddFormEnabled=false;
        newState.isFormvalid=true;
        //newState.items.push(newState.item);
        newState.item.Title="";
        newState.item.Description="";
        newState.item.TrainingDate=new Date();
        newState.item.Id=0;
        return newState;
    }
    if(action.type==actionTypes.CANCEL){
        let newState:IApplicationState = {...state};
        newState.isAddFormEnabled=false;
        return newState;
    }
    if(action.type==actionTypes.SET_ERROR){
        let newState:IApplicationState = {...state};
        newState.isFormvalid=false;
        return newState;
    }
    if(action.type==actionTypes.SET_DATE_STATE){
        let newState:IApplicationState = {...state};
        if(action.data){
            newState.isDateValid=true
        }
        else{
            newState.isDateValid=false;
            newState.isFormvalid=false;
        }
        return newState;
    }
    if(action.type==actionTypes.SHOW_SPINNER){
        let newState:IApplicationState = {...state};
        newState.showSpinner=true;
        return newState;
    }
    return state; 
}