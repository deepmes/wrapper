let http = require('http');
let mapParam = require('./mapParam');

class Deepmes {

    constructor(apiKey, options = {
        defaultShard: 'statout',
    }){
        this.apiKey = apiKey,
        this.apiURL = '10.3.170.77',
        this.port = '3030',
        this.defaultShard = options.defaultShard || 'statout';
        this.endpoint = {
            process: 'process'
        };
    }

    // set api key
    setAPIkey(newAPIkey){
        this.apiKey = newAPIkey;
    }

    // get request to shards rest api
    requestData(shard, endpoint, params){
        return new Promise((resolve, reject) => {
            let queryParams = '';

            if(params) {
                Object.keys(params).forEach((key) => {
                    queryParams += queryParams ? `&${key}=${params[key]}` : `?${key}=${params[key]}`;
                });
            }

            const headers = {
                Authentication: `${this.apiKey}`
            }

            let responseData = '';

            const apiRequest = http.get({
                hostname: this.apiURL,
                port: this.port,
                path: `/shards/${shard}/${endpoint}${queryParams}`,
                headers
            }
            , (apiResponse) => {
                apiResponse.setEncoding('utf8');
                apiResponse.on('data', data => {
                    responseData += data;
                });

                apiResponse.on('end', () => {
                    try {
                        const parsedData = JSON.parse(responseData);
                        if(apiResponse.statusCode >= 400){
                            return resolve(parsedData);
                        }
                        return resolve(parsedData);
                    } catch (err) {
                        return reject(err);
                    }
                });

                apiResponse.on('error', e => reject(e));
            });

        });

    }

    // search process
    searchProcess(params, shard = this.defaultShard){
        return this.requestData(
            shard,
            this.endpoint.process,
            mapParam.map(params, mapParam.process)
        );
    }

}

module.exports = Deepmes;