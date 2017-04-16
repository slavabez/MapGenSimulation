/**
 * Created by slava on 16/04/17.
 */

import $ from 'jquery';
import CanvasMap from './CanvasMap';

export default class UserInterface {


    static attachAllUIListeners() {
        UserInterface.attachLogToggleButton();
        UserInterface.attachTabListeners();
        UserInterface.attachSliderListeners();
        UserInterface.addGenerateButtonListener();
        UserInterface.handleMapZoom();
    }

    static attachLogToggleButton() {
        let button = document.querySelector('.js-toggle-log');
        button.addEventListener('click', UserInterface.toggleLogButton);
    }

    static toggleLogButton() {
        let panelDisplay = document.querySelector('.logWindow');
        if (!panelDisplay.style.display || panelDisplay.style.display === 'block') {
            panelDisplay.style.display = 'none';
        } else {
            panelDisplay.style.display = 'block';
        }
    }

    static attachTabListeners() {
        $('.js-tab-link').on('click', (e) => {
            e.preventDefault();
            UserInterface.toggleIsActiveClass(e.target.parentNode);
            console.log('Clicked on ', e.target)
        });
    }

    static toggleIsActiveClass(item) {
        let jItem = $(item);
        if (jItem.hasClass('is-active')) {
            jItem.removeClass('is-active');
        } else {
            jItem.addClass('is-active');
        }
    }

    static attachSliderListeners() {
        // Scale slider
        $('#map_scale').on('input', (e) => {
            $('.js-current-scale').html(e.target.value);
        });
        // Octaves
        $('#map_octaves').on('input', (e) => {
            $('.js-current-octaves').html(e.target.value);
        });
        // Lacunarity
        $('#map_lacunarity').on('input', (e) => {
            $('.js-current-lacunarity').html(e.target.value);
        });
        // Persistance
        $('#map_persistence').on('input', (e) => {
            $('.js-current-persistence').html(e.target.value);
        });
    }

    static addGenerateButtonListener() {
        $('.js-generate-map').on('click', (e) => {
            $('.js-generate-map').addClass('is-loading');

            // Gather input fields, pass to Generator

            const canvasId = 'main_map';
            // TODO: add fields to change canvas dimensions programmatically
            let width = 750;
            let height = 400;

            let seed = $('#map_seed').val();
            let scale = $('#map_scale').val();
            let octaves = $('#map_octaves').val();
            let lacunarity = $('#map_lacunarity').val();
            let persistence = $('#map_persistence').val();

            let map = new CanvasMap(canvasId);
            map.generatePerlinBased(seed, scale, octaves, persistence, lacunarity);
            map.renderOnCanvas();


        });
    }

    static stopGenerateButtonLoading() {
        $('.js-generate-map').removeClass('is-loading');
    }

    static handleMapZoom() {
        // Handle zooming area
        let zoomContext = document.getElementById('zoom_map').getContext('2d');

        const canvas = document.getElementById('main_map');

        // Disable anti aliasing
        zoomContext.imageSmoothingEnabled = false;
        zoomContext.mozImageSmoothingEnabled = false;
        zoomContext.webkitImageSmoothingEnabled = false;
        zoomContext.msImageSmoothingEnabled = false;

        const zoom = function (event) {
            let x = event.layerX;
            let y = event.layerY;

            zoomContext.drawImage(
                canvas,
                Math.abs(x - 10),
                Math.abs(y - 10),
                20, 20,
                0, 0,
                500, 500
            );

        };
        const updateZoomInfo = function(map,x,y){

        };

        canvas.addEventListener('mousemove', zoom);
    }

}