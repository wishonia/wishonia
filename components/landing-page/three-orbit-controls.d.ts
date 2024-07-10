declare module 'three/examples/jsm/controls/OrbitControls.js' {
    import { Camera, MOUSE, TOUCH } from 'three';

    export class OrbitControls {
        constructor(object: Camera, domElement?: HTMLElement);

        // Add any methods or properties you use from OrbitControls
        update(): boolean;

        // Add other properties as needed
        enabled: boolean;
        enableZoom: boolean;
        zoomSpeed: number;
        enableRotate: boolean;
        rotateSpeed: number;
        enablePan: boolean;
        panSpeed: number;
        minDistance: number;
        maxDistance: number;
        minPolarAngle: number;
        maxPolarAngle: number;
        minAzimuthAngle: number;
        maxAzimuthAngle: number;
        enableDamping: boolean;
        dampingFactor: number;

        // Mouse buttons
        mouseButtons: {
            LEFT?: MOUSE;
            MIDDLE?: MOUSE;
            RIGHT?: MOUSE;
        };

        // Touch fingers
        touches: {
            ONE?: TOUCH;
            TWO?: TOUCH;
        };
    }
}