import { GlobalData } from "../global/GlobalData";
import { HttpRequest } from "../net/HttpRequest";
import { EventDispatcher } from "./EventDispatcher";
import { EventMessage } from "./EventMessage";
import { MessageManager } from "./MessageManager";

/** 遊戲事件 */

export class GameEvent {
  static enterMaryH5(param: { act: string; id: string; token: string; }) {
    throw new Error('Method not implemented.');
  }
  private _net_http: HttpRequest = new HttpRequest();
  private _eventDispatcher: EventDispatcher = new EventDispatcher();
  static _message: MessageManager = MessageManager.Instance;


  /**
   * 登入
   * @param params    要post出去的資訊物件{act,account,pwd}
   * @param callback  請求完整回調方法
   */
  login(params: any, callback?: Function) {
    // params = { act: "login_h", account: "kkt005", pwd: "kkt005" };
    this._net_http.post(
      GlobalData.apiUrl,
      params,
      this.login_success,
      this.api_error
    );
  }


  /**
   * 注册全局事件
   * @param event     事件名
   * @param listener  處理事件的偵聽器函數
   * @param object    監聽函數綁定的作用域對象
   */
  //=================================回調=================================

  login_success(response) {
    // console.log(response.status);
    // console.log(response);
    if (response.status === 200) {
      GameEvent._message.dispatchEvent(
        EventMessage.LOGIN_SUCCESS, response
      );
    }
    // test
    // else if(response.status === 999){
    //   GameEvent._message.dispatchEvent(
    //     EventMessage.LOGIN_TESTMESSAGE, response
    //   );
    // }
    else if (response.message == "wrong(T)") {
      GameEvent._message.dispatchEvent(
        EventMessage.TOKEN_TIMEOUT,
        response
      );
    }
    else {
      GameEvent._message.dispatchEvent(
        EventMessage.LOGIN_ERROR,
        response
      );

    }
  }

  
  //-------------------------------------------------------
  api_error(response) {
    if (response.event == 'http_request_timout') {
      GameEvent._message.dispatchEvent(
        EventMessage.HTTP_TIMEOUT,
        response
      );
    } else {
      GameEvent._message.dispatchEvent(
        EventMessage.API_ERROR,
        response
      );
    }
  }


  
}