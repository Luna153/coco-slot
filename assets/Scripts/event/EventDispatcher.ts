/*
 * @Author: Charles
 * @Date: 2023-05-25 01:00
 * @LastEditors: Charles
 * @LastEditTime: 2023-05-26 16:48
 */
import { ListenerFunc } from "./EventMessage";
import { MessageEventData } from "./MessageManager";

/* 事件對象基類，繼承該類將擁有發送和接送事件的能力 */
export class EventDispatcher {
  protected _msg: MessageEventData | null = null;

  /**
   * 註冊全域事件
   * @param event     事件名
   * @param listener  處理事件的監聽器函數
   * @param object    監聽函式綁定的作用域對象
   */
  on(event: string, listener: ListenerFunc, object: any) {
    if (this._msg == null) {
      this._msg = new MessageEventData();
    }
    this._msg.on(event, listener, object);
  }

  /**
   * 移除全局事件
   * @param event      事件名
   */
  off(event: string) {
    if (this._msg) {
      this._msg.off(event);
    }
  }

  /**
   * 觸發全局事件
   * @param event      事件名
   * @param args       事件參數
   */
  dispatchEvent(event: string, args: any = null) {
    console.log("來EventDispatcher", event);
    if (this._msg == null) {
      this._msg = new MessageEventData();
    }
    this._msg.dispatchEvent(event, args);
  }

  /**
   * 銷毀事件對象
   */
  destroy() {
    if (this._msg) {
      this._msg.clear();
    }
    this._msg = null;
  }
}
