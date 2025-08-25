import { _decorator, Button, Color, color, Component, Label, Node, random, Sprite, SpriteFrame, tween, TweenEasing, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum Dir {
    Up = 1,
    Down = -1,
    Top = 210,
    Bottom = -130
}

@ccclass('SlotManerger')
export class SlotManerger extends Component {

    @property({ group: { name: 'Main' }, type: Node, tooltip: "" })
    allRolls: Node[] = [];
    @property({ group: { name: 'Main' }, type: Node, tooltip: "" })
    button: Node = null;
    @property({ group: { name: 'Sprite' }, type: SpriteFrame, tooltip: "" })
    spinSprites: SpriteFrame[] = [];


    _spinArr = [Math.floor(random() * 18), 14, 12, 16]; // 目標





    clickButton() {

        if (this._spinning && this._stopSpinning) {
            console.log('wait this round end');
        }

        if (this._spinning && !this._stopSpinning) {
            console.log('stop');
            this._stopSpinning = true;
            this.button.children[0].getComponent(Label).string = 'SPIN';
        }

        if (!this._spinning && !this._stopSpinning) {
            console.log('start');
            this._spinning = true;
            this.doSpin();
            this.button.children[0].getComponent(Label).string = 'STOP';
        }
    }

    start() {
        this.setTilePos();
    }
    update(dt: number) {
    }

    _iconDone = 0; // 個別icon
    _roundCount = 0; // spin完成回合數即停止
    _stopCount = 0; // stop回和數
    _speed = 0.05;
    _slowSpeed: number = 0.2; // 減速
    _targetRound = 10; // 目標回合數
    _spinning = false; // spin狀態
    _stopSpinning = false; // stop狀態 (spin開始才可以控制)
    _dirArr = [-1, 1, -1, 1, -1]; // donw:-1 up:1
    _tileBasePos = 40; // 基準位置
    _tileBaseIndex = 2; // 基準位置
    _iconHeight: number = 80; // 物體高度
    _space: number = 5; // 物體間隔
    _iconsPerRound = 0; // 保存每回合的總 icon 數



    setTilePos() {
        this.allRolls.forEach((roll, rollX) => {
            let dir = this._dirArr[rollX];
            roll.children.forEach((icon, iconX) => {
                // up: [0][1] 為正 [3]為負   down: [0][1]為負 [3]為正
                let gapIndex = dir < 0 ? this._tileBaseIndex - iconX : iconX - this._tileBaseIndex;
                let gapSpace = this._iconHeight + this._space;
                let setPos = this._tileBasePos + (gapIndex * gapSpace);
                icon.setPosition(icon.position.x, setPos);
            });
        });

    }

    doSpin() { // 控制所有icon
        // 進入一輪 spin 前先計算總 icon 數（全部 roll 的 children 總和）
        this._iconsPerRound = this.allRolls.reduce((sum, roll) => sum + roll.children.length, 0);
        this.allRolls.forEach((roll, rollX) => {
            roll.children.forEach(el => this.doSpinning(el, this._dirArr[rollX]));
        });
    }
    doSpinning(el: Node, dir: number) { // 控制個別icon
        const move = tween(el).by(this._speed, { position: new Vec3(0, dir * (this._iconHeight + this._space)) });

        // 判斷是否超出界線
        const comparator = dir > 0
            ? a => a >= Dir.Top - this._space
            : a => a <= Dir.Bottom + this._space;

        // 要重設的位置
        const resetPos = dir > 0 ? Dir.Bottom : Dir.Top;

        const checkPos = tween(el).call(() => {
            if (comparator(el.position.y)) {
                el.setPosition(el.position.x, resetPos);
                this.changeSprite(el);
            }
        });
        const repeat = tween(el).repeat(4, move.then(checkPos));

        const checkStop = tween().call(() => { // 完成一個icon移動
            this._iconDone++;

            // 一回合 = 所有 roll 的所有 icon 都完成一次
            if (this._iconDone >= this._iconsPerRound && this._iconDone % this._iconsPerRound === 0) {
                this._iconDone = 0;           // 重置，準備下一回合
                this._roundCount++;           // 正確 +1 回合

                if (this._roundCount >= this._targetRound || this._stopSpinning) {
                    this.doStop();
                }
                else {
                    this.doSpin();
                }
            }
        });

        repeat
            .then(checkStop)
            .start();
    }
    doStop() { // 控制所有icon
        this.allRolls.forEach((roll, rollX) => {
            roll.children.forEach((el, elX) => {
                this.doStopping(rollX, el, elX, this._dirArr[rollX]);
            });
        });
    }
    doStopping(rollX: number, el: Node, elX: number, dir: number) { // 控制個別icon
        let resArr = dir > 0 ? this._spinArr.reverse() : this._spinArr;
        // 判斷是否超出界線
        const comparator = dir > 0
            ? a => a >= Dir.Top - this._space
            : a => a <= Dir.Bottom + this._space;

        // 要重設的位置
        const resetPos = dir > 0 ? Dir.Bottom : Dir.Top;

        const move = tween(el).by(this._speed, { position: new Vec3(0, dir * (this._iconHeight + this._space)) });

        const slowMove = tween(el).by(this._slowSpeed, { position: new Vec3(0, dir * (this._iconHeight + this._space)) }, { easing: 'bounceOut' });

        const checkPos = tween().call(() => {
            if (comparator(el.position.y)) {
                el.setPosition(el.position.x, resetPos);
                this.changeSprite(el, resArr[elX]);
            }
        });
        const repeat = tween(el).repeat(rollX * 4 + 3, move.then(checkPos));

        const checkEnd = tween().call(() => {
            this._stopCount++;
            // stopCount++;
            if (this._stopCount >= 4 && this._stopCount % 4 == 0) { // 完成一回合
                this.resetButton();
            }
        });
        // const round=tween(el).repeat(rollX,repeat.then)

        repeat
            .then(slowMove)
            .then(checkPos)
            .then(checkEnd)
            .start();

    }
    creatRandomSpin() { // 隨機生成數組(圖)
        for (let i = 0; i < 4; i++) {
            // this.changeSprite(this.allRolls[i]);
        }
    }
    changeSprite(target, spinX?) { // 換圖
        target.getComponent(Sprite).spriteFrame = spinX ? this.spinSprites[spinX] : this.spinSprites[Math.floor(random() * 18)];
    }
    resetButton() { // end
        console.log('end');
        this._roundCount = 0;
        this._stopSpinning = false;
        this._spinning = false;
        this.button.children[0].getComponent(Label).string = 'SPIN';
    }





}

