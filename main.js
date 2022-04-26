import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
// import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/ShaderPass.js';

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000)
let renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: 'high-performance'})
let controls = new OrbitControls(camera, renderer.domElement)
let raycaster = new THREE.Raycaster()
let gltfLoader = new GLTFLoader()
let textureLoader = new THREE.TextureLoader()
let fontLoader = new THREE.FontLoader()
let model
let pointer_mesh
let sun
let ambient

let interactive_meshes = {
    init() {
        for (let i in interactive_meshes.meshes) {
            interactive_meshes.meshes[i].load?.()
        }

        for (let i in interactive_meshes.mesh_groups) {
            interactive_meshes.mesh_groups[i].load?.()
        }
    },

    meshes: {
        Object_1223: {
            events: { 
                click(mesh) {
                    let cam_tween = new TWEEN.Tween(camera.position)
                        .to({x: -7, y: 3, z: 15.6}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                    let target_tween = new TWEEN.Tween(controls.target)
                        .to({x: -14, y: 3, z: 15.6}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                        .onComplete(()=> {
                            let fog_amnt = {x: 0.007}
                            new TWEEN.Tween(fog_amnt)
                                .to({x: 1}, 1000)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => {  scene.fog = new THREE.FogExp2( 0xffffff, fog_amnt.x) })
                                .onComplete(() => {
                                    controls.target.set(-11, 1, 10)
                                    camera.position.set( 3, 11, 18)
                                    scene.background = new THREE.Color(.1, .3, .4)
                                    scene.fog = new THREE.FogExp2( 0xffffff, .007)
                                    console.log(sun)
                                    sun.intensity == 4 ? sun.intensity = 0 : sun.intensity = 4
                                    ambient.intensity == 1 ? ambient.intensity = 0 : ambient.intensity = 1
                                })
                            let bg_color = new THREE.Color(0.1, 0.3, 0.4)
                            new TWEEN.Tween(bg_color)
                                .to({r: 1, g: 1, b: 1}, 500)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => { scene.background = new THREE.Color(bg_color.r, bg_color.g, bg_color.b) })
                        })
                },

                mousemove() {
                    renderer.domElement.style.cursor = 'pointer'
                },

                mouseout() {
                    renderer.domElement.style.cursor = 'auto'
                }
            },
        }
    },

    mesh_groups: [
        {
            meshes: [],
            names: ['Object_790', 'Object_787', 'Object_789'],
            events: {
                click(meshes) {
                    new TWEEN.Tween(camera.position)
                        .to({x: -15, y: 4.5, z: 11}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                    new TWEEN.Tween(controls.target)
                        .to({x: -15, y: 2, z: 2}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                        .onComplete(()=> {
                            let fog_amnt = {x: 0.007}
                            new TWEEN.Tween(fog_amnt)
                                .to({x: 1}, 1000)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => {  scene.fog = new THREE.FogExp2( 0xffffff, fog_amnt.x) })
                            let bg_color = new THREE.Color(0.1, 0.3, 0.4)
                            new TWEEN.Tween(bg_color)
                                .to({r: 1, g: 1, b: 1}, 500)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => { scene.background = new THREE.Color(bg_color.r, bg_color.g, bg_color.b) })
                                .onComplete(() => { window.location.href = 'https://github.com/Lxdovic' })
                        })
                },
    
                mousemove() {
                    renderer.domElement.style.cursor = 'pointer'
                },
    
                mouseout() {
                    renderer.domElement.style.cursor = 'auto'
                }
            },

            async load() {
                let materials = []
                for (let i in this.meshes) {
                    materials[i] = new THREE.MeshBasicMaterial({ color: this.meshes[i].material.color })

                    new TWEEN.Tween(materials[i].color)
                        .to({r: 1, g: 1, b: 1}, 800)
                        .onUpdate((c) => { this.meshes[i].material = materials[i] })
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .yoyo(true)
                        .repeat(Infinity)
                        .start()
                }

                let font = await fontLoad('./fonts/helvetiker_regular.json')
                let text_geometry = new THREE.TextGeometry( 'GITHUB', { font: font, size: .35, height: .05, curveSegments: 12, bevelEnabled: false, })
                let text = new THREE.Mesh( text_geometry, new THREE.MeshToonMaterial({ color: 0xffffff }))
                text.position.set(-16.35, 4.3, 3.4)

                scene.add(text)
            },
        },

        {
            meshes: [],
            names: ['Object_46', 'Object_45', 'Object_43'],
            events: {
                click(meshes) {
                    new TWEEN.Tween(camera.position)
                        .to({x: -13, y: 4.5, z: 8}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                    new TWEEN.Tween(controls.target)
                        .to({x: -24, y: 2, z: 8}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                        .onComplete(()=> {
                            let fog_amnt = {x: 0.007}
                            new TWEEN.Tween(fog_amnt)
                                .to({x: 1}, 1000)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => {  scene.fog = new THREE.FogExp2( 0xffffff, fog_amnt.x) })
                            let bg_color = new THREE.Color(0.1, 0.3, 0.4)
                            new TWEEN.Tween(bg_color)
                                .to({r: 1, g: 1, b: 1}, 500)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => { scene.background = new THREE.Color(bg_color.r, bg_color.g, bg_color.b) })
                                .onComplete(() => { window.location.href = 'https://www.lxdovic.fr' })
                        })
                },
    
                mousemove() {
                    renderer.domElement.style.cursor = 'pointer'
                },
    
                mouseout() {
                    renderer.domElement.style.cursor = 'auto'
                }
            },

            async load() {
                let materials = []
                for (let i in this.meshes) {
                    materials[i] = new THREE.MeshBasicMaterial({ color: this.meshes[i].material.color })

                    new TWEEN.Tween(materials[i].color)
                        .to({r: 1, g: 1, b: 1}, 800)
                        .onUpdate((c) => { this.meshes[i].material = materials[i] })
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .yoyo(true)
                        .repeat(Infinity)
                        .start()
                }

                let font = await fontLoad('./fonts/helvetiker_regular.json')
                let text_geometry = new THREE.TextGeometry( 'PORTFILIO', { font: font, size: .35, height: .05, curveSegments: 12, bevelEnabled: false, })
                let text = new THREE.Mesh( text_geometry, new THREE.MeshToonMaterial({ color: 0xffffff }))
                text.position.set(-20, 4.3, 9.4)
                text.rotation.y = Math.PI / 2

                scene.add(text)
            },
        },

        {
            meshes: [],
            names: ['Object_66', 'Object_65', 'Object_63'],
            events: {
                click(meshes) {
                    new TWEEN.Tween(camera.position)
                        .to({x: -13, y: 4.5, z: 12}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                    new TWEEN.Tween(controls.target)
                        .to({x: -24, y: 2, z: 12}, 2000)
                        .easing(TWEEN.Easing.Exponential.InOut)
                        .start()
                        .onComplete(()=> {
                            let fog_amnt = {x: 0.007}
                            new TWEEN.Tween(fog_amnt)
                                .to({x: 1}, 1000)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => {  scene.fog = new THREE.FogExp2( 0xffffff, fog_amnt.x) })
                            let bg_color = new THREE.Color(0.1, 0.3, 0.4)
                            new TWEEN.Tween(bg_color)
                                .to({r: 1, g: 1, b: 1}, 500)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .start()
                                .onUpdate(() => { scene.background = new THREE.Color(bg_color.r, bg_color.g, bg_color.b) })
                                // .onComplete(() => { window.location.href = 'https://www.lxdovic.fr' })
                        })
                },
    
                mousemove() {
                    renderer.domElement.style.cursor = 'pointer'
                },
    
                mouseout() {
                    renderer.domElement.style.cursor = 'auto'
                }
            },

            async load() {
                let materials = []
                for (let i in this.meshes) {
                    materials[i] = new THREE.MeshBasicMaterial({ color: this.meshes[i].material.color })

                    new TWEEN.Tween(materials[i].color)
                        .to({r: 1, g: 1, b: 1}, 800)
                        .onUpdate((c) => { this.meshes[i].material = materials[i] })
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .yoyo(true)
                        .repeat(Infinity)
                        .start()
                }

                let font = await fontLoad('./fonts/helvetiker_regular.json')
                let text_geometry = new THREE.TextGeometry( 'LINKEDIN', { font: font, size: .35, height: .05, curveSegments: 12, bevelEnabled: false, })
                let text = new THREE.Mesh( text_geometry, new THREE.MeshToonMaterial({ color: 0xffffff }))
                text.position.set(-20, 4.3, 13.8)
                text.rotation.y = Math.PI / 2

                scene.add(text)
            },
        },
    ]
}

document.body.onload = async () => {
    // RENDERER SETUP
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.LinearToneMapping
    renderer.toneMappingExposure = 1
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.shadowMap.enabled = true
    
    document.getElementById('screen').appendChild(renderer.domElement)

    // SCENE SETUP
    scene.background = new THREE.Color(.1, .3, .4)
    scene.fog = new THREE.FogExp2( 0xffffff, .007)

    // LIGHT & SHADOWS SETUP

    ambient = new THREE.AmbientLight(0xffffff, 1)

    scene.add(ambient)

    sun = new THREE.DirectionalLight(0xffaacc, 4)

    sun.position.set(13, 15, -18)
    sun.target.position.set(-11, 1, 10)

    scene.add(sun.target)
    scene.add(sun)

    let blue_light = new THREE.PointLight( 0x0010ff, 1)
    blue_light.castShadow = true
    blue_light.position.set(-20, 10, 20)
    scene.add(blue_light)

    let pink_light = new THREE.PointLight( 0xff00ff, 1)
    pink_light.position.set(0, 10, 0)
    scene.add(pink_light)

    // scene.add(new THREE.PointLightHelper(blue_light))
    // scene.add(new THREE.PointLightHelper(pink_light))

    model = await gltfLoad(
        'models/office/scene.gltf',
        new THREE.Vector3(2, 2, 2)
    )

    model.mesh_list = []

    model.traverse(async child => {
        if (!child.isMesh) { return }

        child.castShadow = true
        child.receiveShadow = true

        model.mesh_list.push(child)

        if (interactive_meshes.meshes[child.name]) {
            interactive_meshes.meshes[child.name].mesh = child
        }

        for (let i in interactive_meshes.mesh_groups) {
            if (!interactive_meshes.mesh_groups[i].names.includes(child.name)) { continue }

            interactive_meshes.mesh_groups[i].meshes.push(child)
        }
    })

    scene.add(model)

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    }

    // controls.maxPolarAngle = Math.PI/2
    // controls.minAzimuthAngle = -Math.PI / 2
    // controls.maxAzimuthAngle = Math.PI
    // controls.maxDistance = 30
    // controls.minDistance = 0
    controls.target.set(-11, 1, 10)
    camera.position.set( 3, 11, 18)

    animate()

    interactive_meshes.init()
}

renderer.domElement.addEventListener('click', event => {
    let mouse = {
        x: ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1,
        y: - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1
    }

    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(model.mesh_list)

    if ( intersects.length == 0 ) { return }

    let mesh = intersects[0].object

    for (let i in interactive_meshes.meshes) {
        if (i != mesh.name) { continue }

        interactive_meshes.meshes[i].events.click?.(mesh)
    }

    for (let i in interactive_meshes.mesh_groups) {
        if (!interactive_meshes.mesh_groups[i].names.includes(mesh.name)) { continue }

        interactive_meshes.mesh_groups[i].events.click?.(interactive_meshes.mesh_groups[i].meshes)
    }
})

renderer.domElement.addEventListener('mousemove', event => {
    if (!model) { return }

    let mouse = {
        x: ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1,
        y: - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1
    }

    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(model.mesh_list)

    if ( intersects.length == 0 ) { return }

    let mesh = intersects[0].object

    for (let i in interactive_meshes.meshes) {
        if (i != mesh.name) { continue }

        interactive_meshes.meshes[i].events.mousemove?.(mesh)
    }

    for (let i in interactive_meshes.mesh_groups) {
        if (!interactive_meshes.mesh_groups[i].names.includes(mesh.name)) { continue }

        interactive_meshes.mesh_groups[i].events.mousemove?.(mesh)
    }

    if (pointer_mesh == undefined) { return pointer_mesh = intersects[0].object }
    
    if (pointer_mesh.name != intersects[0].object.name) {
        interactive_meshes.meshes[pointer_mesh.name]?.events?.mouseout?.(interactive_meshes.meshes[pointer_mesh.name].mesh)
        
        for (let i in interactive_meshes.mesh_groups) {
            if (!interactive_meshes.mesh_groups[i].names.includes(pointer_mesh.name)) { continue }
            
            interactive_meshes.mesh_groups[i].events?.mouseout?.()
        }

        pointer_mesh = intersects[0].object
    }
})



function gltfLoad(path, scale, position) {
    return new Promise((resolve, reject) => { 
        gltfLoader.load(path, gltf => {
            if (scale) { 
                gltf.scene.scale.set(
                    scale.x,
                    scale.y,
                    scale.z
                ) 
            }

            if (position) { 
                gltf.scene.position.set(
                    position.x,
                    position.y,
                    position.z
                ) 
            }

            resolve(gltf.scene)
        }, undefined, err => { reject(err) })
    })
}

function textureLoad(path) {
    return new Promise((resolve, reject) => { 
        textureLoader.load(path, texture => {
            resolve(texture)

        }, undefined, err => { reject(err) })
    })
}

function fontLoad(path) {
    return new Promise((resolve, reject) => { 
        fontLoader.load(path, font => {
            resolve(font)

        }, undefined, err => { reject(err) })
    })
}

function animate(time) {
    requestAnimationFrame(animate)
    
    TWEEN.update(time)

    controls.update()

    renderer.render(scene, camera)
}
