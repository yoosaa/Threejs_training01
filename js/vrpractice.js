(function () {
    'use strict';

    var width  = window.innerWidth;
    var height = window.innerHeight;

    // カメラ
    var camera = new THREE.PerspectiveCamera(80, width / height, 1, 10000);
    camera.position.set(0,0,10);
    //３次元座標
    camera.lookAt(new THREE.Vector3(0,0,0));

    // シーン
    var scene = new THREE.Scene();

    // ライト
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 2, 1.7);

    scene.add(light);


///////////object
    // 地球
    var earth = new THREE.Object3D;
    var geometry = new THREE.SphereGeometry(50, 200, 128);
    var mesh;
    var meshs = [];
    var Sphere  = new THREE.TextureLoader();
    Sphere.load("texture/earth.jpg",textureLoaded);
    function textureLoaded(texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;


    var material = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        metal:true
    });

    for(var i = 0; i<300; i++){
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random()*7000 - 3000;
    mesh.position.y = Math.random()*8000 - 3000;
    mesh.position.z = Math.random()*6000 - 3000;
    mesh.rotation.x = 0.01;
    meshs.push(mesh);
    earth.add(mesh);
}
    scene.add(earth);
}

    // Sky
    var video = document.createElement("video");
    video.width = width;
    video.height = height;
    video.src = "texture/cloud_movie.mp4";
    video.autoplay = true;
    video.loop = true;
    video.load();
    video.play();
        
    var videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

        var worldboxGeometry = new THREE.CubeGeometry(10000,10000,10000);
        var worldboxMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            color: 0xffffff,
            side: THREE.BackSide
        });
    var worldbox = new THREE.Mesh(worldboxGeometry,worldboxMaterial);
    worldbox.position.z = 0;
    scene.add(worldbox);

    // レンダラ
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    document.body.appendChild(renderer.domElement);

    //オブジェクトをクリックでイベント
    window.addEventListener("mousedown",onMouseDown,false); 
    function onMouseDown(e){

        var rect = e.target.getBoundingClientRect();

        //マウスの座標（2d）
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        //マウスの座標（3d）
        mouseX = (mouseX/window.innerWidth)*2-1;
        mouseY = -(mouseY/window.innerHeight)*2+1;

        //マウスベクトル
        var pos = new THREE.Vector3(mouseX,mouseY,1);
        pos.unproject(camera);

        //始点、向きベクトルを渡してレイを作成
        var ray = new THREE.Raycaster(camera.position,pos.sub(camera.position).normalize());
        //交差判定
        var obj = ray.intersectObjects(meshs);
        if(obj.length > 0){
            function xmove(){
            obj[0].object.position.x += -0.01;
        }
            requestAnimationFrame(xmove);
        }
    }

    // vrmanager
    //var manager = new WebVRManager(renderer,effect);

    // OrbitControls
    var orbitControls = new THREE.OrbitControls(camera);

    // DeviceOrientationControls
    //var orientationControls = new THREE.DeviceOrientationControls(camera);

    // VRControls
    var vrControls = new THREE.VRControls(camera);

    // VREffect
    var effect   = new THREE.VREffect(renderer);
    effect.setSize(width, height);

    // アニメーションループ
    (function loop() {
        vrControls.update();
        orbitControls.update();
        effect.render(scene, camera);
        requestAnimationFrame(loop);
    }());
    
    // リサイズ
    window.addEventListener("resize", function () {
        width  = window.innerWidth;
        height = window.innerHeight;
        effect.setSize(width, height);
        renderer.setSize(width, height);
        renderer.setViewport(0, 0, width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }, false);

    //ボタン
    document.getElementById("btn").addEventListener("click",function(){
        effect.setFullScreen(true);
    },false);
    
}());