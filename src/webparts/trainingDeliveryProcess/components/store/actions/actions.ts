import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {Dialog} from '@microsoft/sp-dialog';

export interface IListItem {  
    Title: string;  
    Description: string; 
    TrainingStatus:string;
    TrainingDate:Date;
    Author: {Title:string}
}

export enum actionTypes{
    ADD_DATA,
    INIT_DATA,
    SET_DATA,
    EVENT,
    ADD_SUCCESS,
    CANCEL,
    SET_ERROR
}

export interface IAction{
    type: actionTypes;
    data: any;
}

export const addData = ():IAction => {
    return {
        type:actionTypes.ADD_DATA,
        data:null
    };
};

export const setError = ():IAction => {
    return {
        type:actionTypes.SET_ERROR,
        data:null
    };
};

export const changeData = (data):IAction => {
    return {
        type:actionTypes.EVENT,
        data:data
    };
};

export const setData = (items: IListItem[]):IAction => {
    return {
        type:actionTypes.SET_DATA,
        data: items
    };
};

export const cancel = ():IAction => {
    return {
        type:actionTypes.CANCEL,
        data: null
    };
};

export const initData = (spHttpClient: SPHttpClient, siteUrl:string):any => {
    return dispatch => {
        spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('Trainings')/items?$select=Title,Description,TrainingStatus,TrainingDate,Author/Title&$expand=Author&$orderby=Created desc`,  
        SPHttpClient.configurations.v1,  
        {  
          headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'odata-version': ''  
          }  
        }) 
        .then((response: SPHttpClientResponse): Promise<IListItem[]> => {  
          return response.json();   
        })
        .then((items: IListItem[]): void => {  
          dispatch(setData(items["value"]));
        }, (error: any): void => {  
            console.log('error occurered')
        });    
    };
};

export const postDataSuccess = ():IAction => {
    return {
            type:actionTypes.ADD_SUCCESS,
            data:null
        };
}
export const postData = (spHttpClient: SPHttpClient, siteUrl:string,payLoad:any):any => {
    return dispatch => {
        const body: string = JSON.stringify(payLoad); 
        console.log(body);
        spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('Trainings')/items`,  
        SPHttpClient.configurations.v1,  
        {  
        headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': ''  
        },  
        body: body  
        })  
        .then((response: SPHttpClientResponse): any => {  
        return response.json();  
        })  
        .then((item: any): void => {  
        Dialog.alert("List item created successfully");
        dispatch(postDataSuccess());
        }, (error: any): void => {  
        console.log(error);
        Dialog.alert("List item creation failed");
        });   
    };
};