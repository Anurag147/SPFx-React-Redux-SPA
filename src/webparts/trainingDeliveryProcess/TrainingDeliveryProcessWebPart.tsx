import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import * as strings from 'TrainingDeliveryProcessWebPartStrings';
import {Provider} from 'react-redux';
import {createStore} from './components/store/store';
import Home from './components/Home/Home';
import { SPComponentLoader } from '@microsoft/sp-loader';
require('bootstrap');

export interface ITrainingDeliveryProcessWebPartProps {
  description: string;
}

export default class TrainingDeliveryProcessWebPart extends BaseClientSideWebPart<ITrainingDeliveryProcessWebPartProps> {
  private store: any;
  public constructor() {
    super();
    this.store = createStore();
  }
  public render(): void {
    
    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssURL);

    let fontCssURL = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    SPComponentLoader.loadCss(fontCssURL);

    const element = (
      <Provider store={this.store}>
        <Home context={this.context} 
        spHttpClient={this.context.spHttpClient} 
        siteUrl= {this.context.pageContext.web.absoluteUrl}/>
      </Provider>
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
