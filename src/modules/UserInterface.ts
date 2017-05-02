/**
 * Created by slava on 16/04/17.
 */

import * as $ from 'jquery';
import CanvasMap from './CanvasMap';
import Logger from "./Logger";
import GameLoop, {GameState} from "./GameLoop";
import * as Mousetrap from 'mousetrap';
import MathsHelper from "./MathsHelper";
import Unit from "./Unit";

export default class UserInterface {

    currentMap: CanvasMap;
    gameLoop: GameLoop;
    zoomedAt: any;
    zoomedCanvasId: string;

    constructor(){
        this.zoomedAt = {};
        this.zoomedCanvasId = 'zoom_map';
    }

    attachAllUIListeners() {
        UserInterface.attachLogToggleButton();
        UserInterface.attachTabListeners();
        UserInterface.attachSliderListeners();
        this.addGenerateButtonListener();
        this.handlePopulateButtonClicks();
        this.handleButtonRenderFull();
    }

    attachKeyboardShortcuts(){
        let UI = this;

        // Left
        Mousetrap.bind('left', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x - 1, UI.zoomedAt.y);
        });
        Mousetrap.bind('shift+left', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x - 10, UI.zoomedAt.y);
        });

        // Right
        Mousetrap.bind('right', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x + 1, UI.zoomedAt.y);
        });
        Mousetrap.bind('shift+right', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x + 10, UI.zoomedAt.y);
        });

        // UP
        Mousetrap.bind('up', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x, UI.zoomedAt.y - 1);
        });
        Mousetrap.bind('shift+up', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x, UI.zoomedAt.y - 10);
        });

        // DOWN
        Mousetrap.bind('down', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x, UI.zoomedAt.y + 1);
        });
        Mousetrap.bind('shift+down', () => {
            UI.setZoomedInCoordinates(UI.zoomedAt.x, UI.zoomedAt.y + 10);
        });
    }

    attachLoopListeners(){
        this.gameLoop = new GameLoop(this.currentMap, 10);

        let UI = this;

        $('.js-start-game-loop').on('click', () => {
            UI.gameLoop.start();
            UI.setTickUpdates();
        });

        $('.js-pause-game-loop').on('click', () => {
            UI.gameLoop.pause();
        });

        $('.js-increment-tick').on('click', () => {
            UI.gameLoop.update();
        });

    }

    setTickUpdates(){
        let gameLoop = this.gameLoop;
        setInterval(() => {
            $('.js-ticks-passed').html(gameLoop.ticks.toString());
            $('.js-game-ticks-passed').html(gameLoop.gameTicks.toString());
            $('.js-loop-state').html(GameState[gameLoop.state]);
        }, 1000);
    }

    static attachLogToggleButton() {
        let button = document.querySelector('.js-toggle-log');
        button.addEventListener('click', UserInterface.toggleLogButton);
    }

    static toggleLogButton() {
        let panelDisplay = <HTMLElement>document.querySelector('.logWindow');
        if (!panelDisplay.style.display || panelDisplay.style.display === 'block') {
            panelDisplay.style.display = 'none';
        } else {
            panelDisplay.style.display = 'block';
        }
    }

    static attachTabListeners() {
        $('.js-tab-link').on('click', (e: Event) => {
            e.preventDefault();
            // Remove all isActive classes, hide all tabbed content
            $('.js-tab-link').removeClass('is-active');
            $('.tabbed-item').hide();
            // Add active class to the one clicked
            let target:any = e.target;

            $(target.parentNode).addClass('is-active');
            $('.' + $(target.parentNode).attr('data-tab-target')).show();

        });
    }

    static toggleIsActiveClass(item: any) {
        let jItem = $(item);
        if (jItem.hasClass('is-active')) {
            jItem.removeClass('is-active');
        } else {
            jItem.addClass('is-active');
        }
    }

    static attachSliderListeners() {
        // Scale slider
        $('#map_scale').on('input', (e: Event) => {
            let target: any = e.target;
            $('.js-current-scale').html(target.value);
        });
        // Octaves
        $('#map_octaves').on('input', (e: Event) => {
            let target: any = e.target;
            $('.js-current-octaves').html(target.value);
        });
        // Lacunarity
        $('#map_lacunarity').on('input', (e: Event) => {
            let target: any = e.target;
            $('.js-current-lacunarity').html(target.value);
        });
        // Persistance
        $('#map_persistence').on('input', (e: Event) => {
            let target: any = e.target;
            $('.js-current-persistence').html(target.value);
        });
    }

    static createCanvasDiv(parentDivSelector: string, newId: string = null){
        let parent = $(parentDivSelector);
        const width = parent.width();
        const height = 500;

        // Check if a div with such ID exists, delete and re-write if does
        if (document.getElementById(newId)){
            document.getElementById(newId).remove();
        }
        let newCanvas: any = document.createElement('CANVAS');
        parent.append(newCanvas);
        let id = (newId) ? newId : 'canvas-' + (Math.floor(Math.random() * 500)).toString();
        newCanvas.id = id;
        newCanvas.width = width;
        newCanvas.height = height;

        return id;
    }

    addGenerateButtonListener() {
        let UI = this;

        $('.js-generate-map').on('click', (e: Event) => {
            UserInterface.startGenerateButtonLoading();

            // Gather input fields, pass to Generator

            const containerId = 'main-map-container';
            let canvasId = UserInterface.createCanvasDiv('.' + containerId, 'main-canvas');

            // TODO: add fields to change canvas dimensions programmatically

            let seed = $('#map_seed').val();
            let scale = $('#map_scale').val();
            let octaves = $('#map_octaves').val();
            let lacunarity = $('#map_lacunarity').val();
            let persistence = $('#map_persistence').val();

            let map = new CanvasMap(canvasId);
            map.generatePerlinBased(seed, scale, octaves, persistence, lacunarity);
            map.renderOnCanvas();

            // Save map to the object
            UI.currentMap = map;
            UI.handleMapZoom();
            UI.attachLoopListeners();
            UI.attachKeyboardShortcuts();
            $('.js-output-map').on('click', () => {
                console.log(UI.currentMap);
            });
        });
    }

    static stopGenerateButtonLoading() {
        $('.js-generate-map').removeClass('is-loading');
    }

    static startGenerateButtonLoading() {
        $('.js-generate-map').addClass('is-loading');
    }

    handleMapZoom() {
        // Handle zooming area
        let UI = this;
        let canvas = document.getElementById(this.currentMap.canvasId);
        UI.setZoomedInCoordinates(Math.floor(this.currentMap.width) / 2,  Math.floor(this.currentMap.height / 2));

        canvas.addEventListener('click', (event) => {
            let x = event.layerX;
            let y = event.layerY;
            UI.setZoomedInCoordinates(x,y);
            UI.startUpdatingZoomedArea();
        });
    }

    updateZoomedInfo(){
        let x = this.zoomedAt.x;
        let y = this.zoomedAt.y;

        $('.js-clicked-x').html(x);
        $('.js-clicked-y').html(y);

        const tile = this.currentMap.tiles[y][x];

        if (tile) {
            // Find map stuff
            let type: string = tile.type.name;
            let altitude: number = Math.floor(tile.altitude);
            let passable: boolean = tile.type.passable;
            let settlement: boolean = tile.hasSettlement;

            $('.js-clicked-type').html(type);
            $('.js-clicked-altitude').html(altitude.toString());
            $('.js-clicked-passable').html(passable.toString());
            $('.js-clicked-settlement').html(settlement.toString());
        }


    }

    setZoomedInCoordinates(x: number, y: number){

        this.zoomedAt.x = MathsHelper.clampNumber(x, 0, this.currentMap.width - 1);
        this.zoomedAt.y = MathsHelper.clampNumber(y, 0, this.currentMap.height - 1);/*
        console.log(`Max height: ${this.currentMap.height} and max width: ${this.currentMap.width}`);*/

        this.updateZoomedInfo();
    }

    startUpdatingZoomedArea(){

        let UI = this;
        let zoomCanvas: any = document.getElementById(this.zoomedCanvasId);
        const canvas: any = document.getElementById(this.currentMap.canvasId);
        let zoomContext = zoomCanvas.getContext('2d');

        // Disable anti aliasing
        zoomContext.imageSmoothingEnabled = false;
        zoomContext.mozImageSmoothingEnabled = false;
        zoomContext.webkitImageSmoothingEnabled = false;

        // Update at 60fps
        setInterval(() => {
            let x = UI.zoomedAt.x;
            let y = UI.zoomedAt.y;

            zoomContext.drawImage(
                canvas,
                Math.abs(x-18),
                Math.abs(y-18),
                50, 50,
                0, 0,
                400, 400
            );

            zoomContext.fillStyle = 'rgb(195,0,0)';
            zoomContext.fillRect(144,144,8,8);

            $('.cur-x').html(x);
            $('.cur-y').html(y);
        }, 1000/60);
    }

    handlePopulateButtonClicks(){

        // Bind the scope
        let UI = this;

        $('.js-populate-map').on('click', () => {
            if (UI.currentMap){
                UI.currentMap.addRandomColony();
            } else {
                console.log('No map has been generated');
            }
        });

        $('.js-add-random-unit').on('click', () => {
            if (UI.currentMap){
                let unit = Unit.placeNewUnitAt(UI.currentMap, 200, 200);
                let randomTile = UI.currentMap.tiles[300][300];
                unit.setTargetCoordinates(randomTile.xCor, randomTile.yCor);
            } else {
                console.log('No map has been generated');
            }
        });

        $('.js-test-button').on('click', () => {
            if (UI.currentMap){
                let path = Unit.calculatePathFromTo(UI.currentMap, 295,151, 377,147);
                console.log(path);
            } else {
                console.log('No map has been generated');
            }
        });


    }

    handleButtonRenderFull(){
        let UI = this;

        $('.js-render-full').on('click', () => {
            if (UI.currentMap){
                UI.currentMap.renderOnCanvas();
            } else {
                Logger.logError('No map present');
            }
        });
    }
}