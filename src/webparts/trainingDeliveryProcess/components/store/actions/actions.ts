import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {Dialog} from '@microsoft/sp-dialog';
export interface IListItem {  
    Title: string;  
    Id: number;  
    Description: string; 
    TrainingStatus:string;
    TrainingDate:Date;
    Author: {Title:string},
    Location:ILocation[]
}

export interface ILocation {  
    Label: string;  
    TermGuid: string;  
    WssId: string; 
}

export enum actionTypes{
    ADD_DATA,
    INIT_DATA,
    SET_DATA,
    EVENT,
    ADD_SUCCESS,
    CANCEL,
    SET_ERROR,
    SET_DATE_STATE,
    SHOW_SPINNER,
    SHOW_PANEL,
    SET_EDIT,
    DELETE_DATA,
    SEARCH_DATA,
    SET_LOC
}

export interface IAction{
    type: actionTypes;
    data: any;
}

export const addData = ():IAction=> {
    return {
        type:actionTypes.ADD_DATA,
        data: {}
    };
};

export const searchData = (data:string):IAction=> {
    return {
        type:actionTypes.SEARCH_DATA,
        data: data
    };
};

export const editData = (data:IListItem):IAction=> {
    return {
        type:actionTypes.SET_EDIT,
        data: data
    };
};

export const showPanel = (data:boolean):IAction => {
    return {
        type:actionTypes.SHOW_PANEL,
        data:data
    };
};

export const showSpinner = ():IAction => {
    return {
        type:actionTypes.SHOW_SPINNER,
        data:true
    };
};


export const setError = ():IAction => {
    return {
        type:actionTypes.SET_ERROR,
        data: {}
    };
};

export const setDateState = (data:boolean):IAction => {
    return {
        type:actionTypes.SET_DATE_STATE,
        data:data
    };
};

export const setLocation = (terms: ILocation[]):IAction => {
    return {
        type:actionTypes.SET_LOC,
        data:terms
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
        data: {}
    };
};

export const initData = (spHttpClient: SPHttpClient, siteUrl:string,listName:string):any => {
    return dispatch => {
        dispatch(showSpinner());
        spHttpClient.get(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=Id,Title,Description,Location,TrainingStatus,TrainingDate,Author/Title&$expand=Author&$orderby=TrainingDate`,  
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
            alert(error)
        });    
    };
};

export const postDataSuccess = ():IAction => {
    return {
            type:actionTypes.ADD_SUCCESS,
            data:null
        };
}
export const postData = (spHttpClient: SPHttpClient, siteUrl:string,payLoad:any,listName:string):any => {
    return dispatch => {
        const body: string = JSON.stringify(payLoad); 
        console.log(body);
        spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,  
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
        Dialog.alert("New event created successfully");
        dispatch(postDataSuccess());
        }, (error: any): void => {  
        console.log(error);
        Dialog.alert(error);
        });   
    };
};
export const postEditDataSuccess = ():IAction => {
    return {
            type:actionTypes.ADD_SUCCESS,
            data:null
        };
}
export const postEditData = (spHttpClient: SPHttpClient, siteUrl:string,payLoad:any,listName:string,Id:number):any => {
    return dispatch => {
        const body: string = JSON.stringify(payLoad); 
        spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${Id})`,  
        SPHttpClient.configurations.v1,  
        {  
        headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': '' ,
            "X-HTTP-Method": "MERGE",
            "If-Match": "*" 
        },  
        body: body  
        })  
        .then((response: SPHttpClientResponse): any => {  
            Dialog.alert("Event edited successfully");
            dispatch(postEditDataSuccess()); 
        },
        (error: any): void => {  
            console.log(error);
            Dialog.alert(error);
        });   
    };
};

export const postDeleteDataSuccess = (data:number):IAction => {
    return {
            type:actionTypes.DELETE_DATA,
            data:data
        };
}
export const postDeleteData = (spHttpClient: SPHttpClient, siteUrl:string,listName:string,Id:number):any => {
    return dispatch => {
        spHttpClient.post(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${Id})`,  
        SPHttpClient.configurations.v1,  
        {  
        headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': '' ,
            "IF-MATCH": "*",  
            "X-HTTP-Method": "DELETE",  
        } 
        })  
        .then((response: SPHttpClientResponse): any => {  
            Dialog.alert("Training deleted successfully");
            dispatch(postDeleteDataSuccess(Id)); 
        },
        (error: any): void => {  
            console.log(error);
            Dialog.alert(error);
        });   
    };
};