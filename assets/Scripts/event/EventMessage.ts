/*
 * @Author: Charles
 * @Date: 2023-05-25 01:00
 * @LastEditors: Charles
 * @LastEditTime: 2023-05-25 01:00
 */

/**
 * 全局事件監聽方法
 * @param event      事件名
 * @param args       事件參數
 */
export type ListenerFunc = (event: string, args: any) => void;

/** 框架內部全局事件  */
export enum EventMessage {
  /**登入成功 */
  LOGIN_SUCCESS = "EventMessage.LOGIN_SUCCESS",
  /**登入失敗 */
  LOGIN_ERROR = "EventMessage.LOGIN_ERROR",
  /** 取得玩家資訊成功 */
  PLAYER_INFO_SUCCESS = "EventMessage.PLAYER_INFO_SUCCESS",
  /** 取得玩家資訊失敗 */
  PLAYER_INFO_ERROR = "EventMessage.PLAYER_INFO_ERROR",
  // test
  // LOGIN_TESTMESSAGE = 'EventMessage.LOGIN_TESTMESSAGE', 
  //===========================================================//
  
  
  /**API沒抓到 (錯誤當機or超時) */
  API_ERROR = 'EventMessage.API_ERROR',
  HTTP_TIMEOUT = 'EventMessage.HTTP_TIMEOUT',
  TOKEN_TIMEOUT = 'EventMessage.TOKEN_TIMEOUT',


}
