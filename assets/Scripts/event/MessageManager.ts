import { log, warn } from "cc";
import { ListenerFunc } from "./EventMessage";

class EventData {
  public event!: string;
  public listener!: ListenerFunc;
  public object: any;
}

/**
 * 批量註冊、移除全局事件對象
 */
export class MessageEventData {
  private events: any = {};

  /**
   * 註冊全局事件
   * @param event      事件名
   * @param listener   處理事件的偵聽器函數
   * @param object     偵聽函數綁定的作用域對象
   */
  on(event: string, listener: ListenerFunc, object: object) {
    let list: Array<EventData> = this.events[event];
    if (list == null) {
      list = [];
      this.events[event] = list;
    }
    let data: EventData = new EventData();
    data.event = event;
    data.listener = listener;
    data.object = object;
    list.push(data);

    MessageManager.Instance.on(event, listener, object);
  }

  /**
   * 移除全局事件
   * @param event     事件名
   */
  off(event: string) {
    let ebs: Array<EventData> = this.events[event];
    if (!ebs) {
      return;
    }
    for (let eb of ebs) {
      MessageManager.Instance.off(event, eb.listener, eb.object);
    }
    delete this.events[event];
  }

  /**
   * 触发全局事件
   * @param event(string)      事件名
   * @param args(any)          事件參數
   */
  dispatchEvent(event: string, arg: any = null) {
    console.log("傳到MessageManger");
    MessageManager.Instance.dispatchEvent(event, arg);
  }

  /** 清除所有的全局事件监听 */
  clear() {
    for (let event in this.events) {
      this.off(event);
    }
  }
}



export class MessageManager {
  static readonly Instance: MessageManager = new MessageManager();

  private events: any = {};

  /**
   * 註冊全局事件
   * @param event      事件名
   * @param listener   處理事件的偵聽器函數
   * @param object     偵聽函數綁定的作用域對象
   */
  on(event: string, listener: ListenerFunc, object: object) {
    if (!event || !listener) {
      warn(`注册【${event}】事件的侦听器函数为空`);
      return;
    }

    let list: Array<EventData> = this.events[event];
    if (list == null) {
      list = [];
      this.events[event] = list;
    }

    let length = list.length;
    for (let i = 0; i < length; i++) {
      let bin = list[i];
      if (bin.listener == listener && bin.object == object) {
        warn(`名为【${event}】的事件重复注册侦听器`);
      }
    }

    let data: EventData = new EventData();
    data.event = event;
    data.listener = listener;
    data.object = object;
    list.push(data);
  }

  /**
   * 监听一次事件，事件响应后，该监听自动移除
   * @param event     事件名
   * @param listener  事件触发回调方法
   * @param object    侦听函数绑定的作用域对象
   */
  once(event: string, listener: ListenerFunc, object: object) {
    let _listener: any = ($event: string, $args: any) => {
      this.off(event, _listener, object);
      _listener = null;
      listener.call(object, $event, $args);
    };
    this.on(event, _listener, object);
  }

  /**
   * 移除全局事件
   * @param event     事件名
   * @param listener  處理事件的偵聽器函數
   * @param object    偵聽函數綁定的作用域對象
   */
  off(event: string, listener: Function, object: object) {
    let list: Array<EventData> = this.events[event];

    if (!list) {
      log(`名为【${event}】的事件不存在`);
      return;
    }

    let length = list.length;
    for (let i = 0; i < length; i++) {
      let bin: EventData = list[i];
      if (bin.listener == listener && bin.object == object) {
        list.splice(i, 1);
        break;
      }
    }

    if (list.length == 0) {
      delete this.events[event];
    }
  }

  /**
   * 触发全局事件
   * @param event(string)      事件名
   * @param args(any)          事件參數
   */
  dispatchEvent(event: string, args: any = null) {
    let list: Array<EventData> = this.events[event];

    if (list != null) {
      let temp: Array<EventData> = list.concat();
      let length = temp.length;
      for (let i = 0; i < length; i++) {
        let eventBin = temp[i];
        eventBin.listener.call(eventBin.object, event, args);
      }
    }
  }
}
