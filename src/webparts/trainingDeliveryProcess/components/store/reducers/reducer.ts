import {IAction,actionTypes,IListItem} from '../actions/actions';
import {Reducer } from 'redux';

export interface IApplicationState{
    items: IListItem[];
    isAddFormEnabled:boolean;
    item:IListItem;
}

const initialState: IApplicationState = {
    items:[],
    isAddFormEnabled:false,
    item:{Title:"",Description:"",TrainingStatus:"Pending ",TrainingDate:new Date(),Author:null}
};

export const trainingReducer:Reducer<IApplicationState> = (state: IApplicationState = initialState, action:IAction) => {
    if(action.type==actionTypes.SET_DATA){
        let newState:IApplicationState = {...state};
        newState.items=action.data;
        return newState;
    }
    if(action.type==actionTypes.ADD_DATA){
        let newState:IApplicationState = {...state};
        newState.isAddFormEnabled=true;
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
        return newState;
    }
    if(action.type==actionTypes.CANCEL){
        let newState:IApplicationState = {...state};
        newState.isAddFormEnabled=false;
        return newState;
    }
    return state; 
}