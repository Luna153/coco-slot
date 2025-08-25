/*
 * @Author: Charles
 * @Date: 2023-05-25 01:00
 * @LastEditors: Charles
 * @LastEditTime: 2023-05-25 01:00
 */
import { error, warn } from "cc";
import crypto from 'crypto-ts';
import { GlobalData } from "../global/GlobalData";



var urls: any = {}; // 當前請求地址集合
var reqparams: any = {}; // 請求參數



/** 請求事件 */
export enum HttpEvent {
  /** 斷網 */
  NO_NETWORK = "http_request_no_network",
  /** 未知錯誤 */
  UNKNOWN_ERROR = "http_request_unknown_error",
  /** 未知錯誤 */
  TIMEOUT = "http_request_timout",
}

/** HTTP請求 */
export class HttpRequest {
  //加密token (要加密的文字, 加密密鑰)
  private aesEncrypt(text:string, key:string):string {
    const encrypted = crypto.AES.encrypt(
        text, crypto.enc.Utf8.parse(key), 
        {
            iv: crypto.enc.Utf8.parse(key),
            mode: crypto.mode.CBC,
            padding: crypto.pad.PKCS7
        }
    )
    return encrypted.toString(); //回傳加密後的結果
  }
  
  /** 服務器地址 */
  server: string = "http://127.0.0.1/";
  /** 請求超時時間 */
  timeout: number = 9000;
  // timeout: number = 10000;
  // timeout: number = 20000;

  /**
     * HTTP GET請求
     * @param name                  協議名
     * @param completeCallback      請求完整回調方法
     * @param errorCallback         請求失敗回調方法
     * @example
    var complete = function(response){
        console.log(response);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.get(name, complete, error);
     */
  get(name: string, completeCallback: Function, errorCallback: Function) {
    this.sendRequest(name, null, false, completeCallback, errorCallback);
  }

  /**
     * HTTP GET請求
     * @param name                  協議名
     * @param params                查詢參數
     * @param completeCallback      請求完整回調方法
     * @param errorCallback         請求失敗回調方法
     * @example
    var param = '{"uid":12345}'
    var complete = function(response){
        var jsonData = JSON.parse(response);
        var data = JSON.parse(jsonData.Data);
        console.log(data.Id);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.getWithParams(name, param, complete, error);
     */
  getWithParams(
    name: string,
    params: any,
    completeCallback: Function,
    errorCallback: Function
  ) {
    this.sendRequest(name, params, false, completeCallback, errorCallback);
  }

  /**
   * HTTP GET請求非文本格式數據
   * @param name                  協議名
   * @param completeCallback      請求完整回調方法
   * @param errorCallback         請求失敗回調方法
   */
  getByArraybuffer(
    name: string,
    completeCallback: Function,
    errorCallback: Function
  ) {
    this.sendRequest(
      name,
      null,
      false,
      completeCallback,
      errorCallback,
      "arraybuffer",
      false
    );
  }

  /**
   * HTTP GET請求非文本格式數據
   * @param name                  協議名
   * @param params                查詢參數
   * @param completeCallback      請求完整回調方法
   * @param errorCallback         請求失敗回調方法
   */
  getWithParamsByArraybuffer(
    name: string,
    params: any,
    completeCallback: Function,
    errorCallback: Function
  ) {
    this.sendRequest(
      name,
      params,
      false,
      completeCallback,
      errorCallback,
      "arraybuffer",
      false
    );
  }

  /**
     * HTTP POST請求
     * @param name                  協議名
     * @param params                查詢參數
     * @param completeCallback      請求完整回調方法
     * @param errorCallback         請求失敗回調方法
     * @example
    var param = {"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}
    var complete = function(response){
        var jsonData = JSON.parse(response);
        var data = JSON.parse(jsonData.Data);
        console.log(data.Id);
    }
    var error = function(response){
        console.log(response);
    }
    oops.http.post(name, param, complete, error);
     */
  post(
    name: string,
    params: any,
    completeCallback?: Function,
    errorCallback?: Function
  ) {
    this.sendRequest(name, params, true, completeCallback, errorCallback);
  }

  /** 取消請求中的請求 */
  abort(name: string) {
    var xhr = urls[this.server + name];
    if (xhr) {
      xhr.abort();
    }
  }

  /**
   * 獲得字符串形式的參數
   */
  private getParamString(params: any) {
    var result = "";
    for (var name in params) {
      let data = params[name];
      if (data instanceof Object) {
        for (var key in data) result += `${key}=${data[key]}&`;
      } else {
        result += `${name}=${data}&`;
      }
    }

    return result.substr(0, result.length - 1);
  }

  /**
   * Http請求
   * @param name(string)              請求地址
   * @param params(JSON)              請求參數
   * @param isPost(boolen)            是否為POST方式
   * @param callback(function)        請求成功回調
   * @param errorCallback(function)   請求失敗回調
   * @param responseType(string)      響應類型
   */
  private sendRequest(
    name: string,
    params: any,
    isPost: boolean,
    completeCallback?: Function,
    errorCallback?: Function,
    responseType?: string,
    isOpenTimeout = true,
    timeout: number = this.timeout
  ) {
    if (name == null || name == "") {
      error("請求地址不能為空");
      return;
    }

    var url: string, newUrl: string, paramsStr: string;
    if (name.toLocaleLowerCase().indexOf("http") == 0) {
      url = name;
    } else {
      url = this.server + name;
    }

    if (params) {
      paramsStr = this.getParamString(params);
      if (url.indexOf("?") > -1) newUrl = url + "&" + paramsStr;
      else newUrl = url + "?" + paramsStr;
    } else {
      newUrl = url;
    }

    if (urls[newUrl] != null && reqparams[newUrl] == paramsStr!) {
      warn(`地址【${url}】已正在請求中，不能重複請求`);
      return;
    }

    var xhr = new XMLHttpRequest();

    let tmpBearer = "sD8DqA8EWr6qUKzdXyIcGzGWjTVWMrWxq1xDcTAleWwtzm9fEKT085dK9Pu5" // 要加密的訊息
    
    /* 
      二次加密是 ( 第一次加密結果上 + "##" + 當下時間搓(10碼) )
    */
    //加密 (要加密的文字, 加密密鑰)
    let pas = this.aesEncrypt(tmpBearer, '36KKa8vEs7zBLi55')
    // GlobalData.console_log("加密  " + pas)
    //二次加密
    let myDate: Date = new Date();
    myDate.getTime().toString().substring(0, 10)
    let twiceEncryptText = pas+"##"+myDate.getTime().toString().substring(0, 10)
    tmpBearer = this.aesEncrypt(twiceEncryptText, '98xvABc5Ess7p02d')
    // GlobalData.console_log("加密  " + tmpBearer)
    

    // 防重複請求功能
    urls[newUrl] = xhr;
    reqparams[newUrl] = paramsStr!;

    if (isPost) {
      xhr.open("POST", url);
    } else {
      xhr.open("GET", newUrl);
    }

    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=utf-8"
    );
    xhr.setRequestHeader(
      "Authorization",
      "Bearer "+tmpBearer
    );
    // xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    var data: any = {};
    data.url = url;
    data.params = params;

    // 請求超時
    if (isOpenTimeout) {
      xhr.timeout = timeout;
      xhr.ontimeout = () => {
        this.deleteCache(newUrl);

        data.event = HttpEvent.TIMEOUT;
        if (errorCallback) errorCallback(data);
      };
    }

    xhr.onloadend = (a) => {
      if (xhr.status == 500) {
        this.deleteCache(newUrl);

        if (errorCallback == null) return;

        data.event = HttpEvent.NO_NETWORK; // 斷網

        if (errorCallback) errorCallback(data);
      }
    };

    xhr.onerror = () => {
      this.deleteCache(newUrl);

      if (errorCallback == null) return;

      if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
        data.event = HttpEvent.NO_NETWORK; // 斷網
      } else {
        data.event = HttpEvent.UNKNOWN_ERROR; // 未知錯誤
      }

      if (errorCallback) errorCallback(data);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4) return;

      this.deleteCache(newUrl);

      if (xhr.status == 200) {
        if (completeCallback) {
          if (responseType == "arraybuffer") {
            // 加載非文本格式
            xhr.responseType = responseType;
            if (completeCallback) completeCallback(xhr.response);
          } else {
            // 加載非文本格式
            var data: any = JSON.parse(xhr.response);
            if (data.code != null) {
              /** 服務器錯誤碼處理 */
              if (data.code == 0) {
                if (completeCallback) completeCallback(data.data);
              } else {
                if (errorCallback) errorCallback(data);
              }
            } else {
              if (completeCallback) completeCallback(data);
            }
          }
        }
      }
    };

    if (params == null || params == "") {
      xhr.send();
    } else {
      xhr.send(paramsStr!); // 根據服務器接受數據方式做選擇
      // xhr.send(JSON.stringify(params));
    }
  }

  private deleteCache(url: string) {
    delete urls[url];
    delete reqparams[url];
  }
}
