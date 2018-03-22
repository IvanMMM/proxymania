"use strict";

const rp = require('request-promise');

class ProxyMania{
    constructor(key){
        if(!key) throw new Error(`Invalid Key`);
        this._baseurl = 'http://proxymania.ru';

        this._key = key;
    }

    getProxies(filter,extended=0){
        return this.request.call(this,'get_proxies',{filter:filter.join(),extended},"GET")
    }

    replaceProxies(proxy_ids){
        return this.request.call(this,'replace_proxies',{proxy_ids},"POST")
    }

    getCountries(){
        return this.request.call(this,'get_countries',null,"GET")
    }

    buyProxies(country,count){
        if(count<=0) throw new Error('Invalid count');
        return this.getCountries()
        .map(country=>{
            return country.code
        })
        .then(codes=>{
            if(!codes.includes(country)) throw new Error(`Invalid country. Available: ${codes.join()}`);
            return this.request.call(this,'buy_proxies',{country,count},"GET")
            .then(body=>body.purchase_id)
        })
    }

    request(endpoint,params={},method='GET'){
        let options = {
            url:`${this._baseurl}/api/${endpoint}/${this._key}/`,
            method:method,
            json:true,
            rejectUnauthorized: false
        };
        if(method==="GET"){
            options.qs = params;
        }else{
            options.form = params;
        }
        return rp(options)
        .then(body=>{
            if(body.status==='error') throw new Error(`code #${body.code}`);
            return body;
        })
    }
}

module.exports = ProxyMania;