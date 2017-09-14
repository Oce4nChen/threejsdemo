function init() {
		var a = 0
		var isBig = true
        var stats = initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0x000000, 0));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);

        // position and point the camera to the center of the scene
        camera.position.x = 20;
        camera.position.y = 0;
        camera.position.z = 150;

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

        var cloud;

        var controls = new function () {
            this.size = 4;
            this.transparent = true;
            this.opacity = 0.6;
            this.vertexColors = true;
            this.color = 0xffffff;
            this.sizeAttenuation = true;
            this.rotateSystem = true;

            this.redraw = function () {
                if (scene.getObjectByName("particles")) {
                    scene.remove(scene.getObjectByName("particles"));
                }
                createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);
            };
        };

        var gui = new dat.GUI();
        gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
        gui.add(controls, 'transparent').onChange(controls.redraw);
        gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
        gui.add(controls, 'vertexColors').onChange(controls.redraw);
        gui.addColor(controls, 'color').onChange(controls.redraw);
        gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
        gui.add(controls, 'rotateSystem');

        controls.redraw();
        render();

        function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {


            var geom = new THREE.Geometry();
            //设置粒子材质的属性
            var material = new THREE.PointCloudMaterial({
                size: size,//粒子的大小
                transparent: transparent,//是否透明
                opacity: opacity,//透明度是多少
                vertexColors: vertexColors,
                /*通常情况下，所有的粒子应用同一种颜色，但是若该值设置为true，
                且几何体的colors数组也有值，则会使用colors数组的颜色*/
                sizeAttenuation: sizeAttenuation,
                /*false:不管粒子距离相机的远近，它们都拥有相同的尺寸
                    true:粒子的大小取决于它们距离相机的远近
                */
                
                color: color//粒子系统中所有粒子的颜色
            });


            var range = 500;
            for (var i = 0; i < 15000; i++) {
                var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
                geom.vertices.push(particle);
                var color = new THREE.Color(0x00ff00);
                color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
                geom.colors.push(color);

            }
            //粒子系统PointCloud与网格Mesh相同，只接受几何体和材质两个参数
            cloud = new THREE.PointCloud(geom, material);
            cloud.name = "particles";
            scene.add(cloud);
        }


        var step = 0;

        function render() {

            stats.update();

            if (controls.rotateSystem) {
                step += 0.01;

                cloud.rotation.x = step;
                cloud.rotation.z = step;
            }
			if(a==0){
				isBig = true
			}
			if (a==888){
				isBig = false
			}
//			console.log(a)
			if (isBig){
				camera.position.set(0, 0, a+=1);
			}
			if(!isBig){
				camera.position.set(0, 0, a-=1);
			}
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);
        }

        function initStats() {

            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            document.getElementById("Stats-output").appendChild(stats.domElement);

            return stats;
        }
    }
    window.onload = init;