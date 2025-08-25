import { _decorator, Button, Component, Label, ProgressBar, Sprite, tween, UI, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Manerger')
export class Manerger extends Component {

    @property(Button)
    private button: Button = null;

    @property(Sprite)
    private sprite: Sprite = null;

    @property(ProgressBar)
    private progressBar: ProgressBar = null;

    @property(Label)
    private second: Label = null;
    @property(Label)
    private minute: Label = null;
    @property(Label)
    private timer: Label = null;

    pg_val = 0.1;
    sec = 0;
    min = 0;

    // 倒計時器
    reclock = true;
    start_t = 5;
    cur_t = this.start_t;
    

    buttonClick() {
        // this.sec+=1;
        // this.second.string = this.sec.toString();
        
        // console.log(this.second.string)
    }
    
    buttonClick2() {
        // console.log('test event-data2')
        // console.log(this.button.getComponent(Button).clickEvents[1].customEventData);
    }
    
    start() {
        // 計時器
        this.schedule(() => {
            if(this.sec === 59){
                this.sec = 0;
                this.min += 1;
                this.second.string = this.sec.toString();    
                this.minute.string = this.min.toString();    
            }else{
                this.sec += 1;
                this.second.string = this.sec.toString();    
            }

            // 倒計時器
            if(this.reclock){
                
                if(this.cur_t > 1){
                    this.cur_t-=1; 
                    this.timer.string = this.cur_t.toString();
                }else{
                    console.log('alarm!!!')
                    this.cur_t = this.start_t;
                    this.timer.string = this.cur_t.toString();
                    this.reclock = false;
                }
            }else{
                return;
            }


        }, 1);
        
    }
    
    protected onLoad(): void {
        
    }
    
    update(deltaTime: number) {
        // this.label.string = this.sec.toString();
        // console.log(this.label.string)
    }
}

