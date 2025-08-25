import { _decorator, Component, screen, Node, ResolutionPolicy, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Resize')
export class Resize extends Component {

    changePolicy = true

    changePhoneSize(){
        this.scheduleOnce(function() {
            // this._phoneContent = this.node.parent.getComponent(UITransform).contentSize;// 手機畫面寬高

            let screenPro = screen.windowSize.width / screen.windowSize.height

            // console.log(screenPro)

            // 視窗大小判斷: Project Setting-> Project Data-> 設定 Fit Width / Fit Height
            if((screenPro >= 0.6 || screenPro <= 0.45) && this.changePolicy == true ){
                view.setResolutionPolicy(ResolutionPolicy.SHOW_ALL)
                this.changePolicy = false;
            }
            else if ((screenPro < 0.6 && screenPro > 0.45) &&this.changePolicy == false){
                view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
                this.changePolicy = true;
            }
        }, 0.1);
    }
    
    start() {
        // 每次載入網頁時, 計算手機板 Or 桌機版
        this.changePhoneSize();
        
        // view.on: 監聽 'canvas-resize'(視窗大小)
        view.on('canvas-resize', () => {
            this.changePhoneSize();
        }, this)

    }
}

