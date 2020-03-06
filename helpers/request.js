'use strict';

import {get} from 'lodash';
import axios from 'axios';

export default async (options) => {    
  try {
    const response = await axios(options);

    if (get(response, 'status') >= 200 && get(response, 'status') <= 203) {     
      return [response.data, get(response, 'status', null)];       
    } else {
      console.log(`Error: not success response status of request! Request options: ${JSON.stringify(options)}. Response: ${JSON.stringify(response)}`); 
      return [null, get(response, 'status', null)];     
    }
  } catch (err) {   
    console.log(`Error of executing request. Error:`);  
    console.log(err.response);
    return [null, get(err, 'response.status', null)];    
  }
}