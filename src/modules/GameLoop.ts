import CanvasMap from "./CanvasMap";

export default class GameLoop {
    map: CanvasMap;
    state: GameState;
    ticks: number;
    gameTicks: number;
    fps: number;


    constructor(map: CanvasMap, fps: number){
        this.map = map;
        this.state = GameState.STOPPED;
        this.ticks = 0;
        this.gameTicks = 0;
        this.fps = fps;
    }

    start(){
        // Scope
        this.state = GameState.RUNNING;
        let loop = this;
        setInterval(() => {
            loop.update();
            if (loop.map){
                loop.map.renderOnCanvas();
            }
            loop.ticks++;
            if (loop.state == GameState.RUNNING){
                loop.gameTicks++;
            }
        }, 1000/loop.fps);
    }

    /**
     * A single 'tick'
     */
    update(){
        if (this.state == GameState.RUNNING){
            // Each colony should spread
            if (this.map && this.map.colonies){
                this.map.colonies.forEach((colony) => {
                    colony.takeAction();
                });
            } else {
                console.log('No map to update', this);
            }
        }
        // Else do nothing
    }

    pause(){
        this.state = GameState.PAUSED;
    }

    stop(){
        this.state = GameState.STOPPED;
        // Reset everything
    }


}

export enum GameState {
    // Not initialised yet
    STOPPED = 0,
    RUNNING = 1,
    // Initialised but stopped (paused)
    PAUSED = 2,
    // Something messed up
    ERROR = 3
}