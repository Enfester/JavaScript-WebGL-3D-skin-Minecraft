var scene, camera, renderer;
var geometry, material, mesh;

var rightLeg2Box, leftLeg2Box;

var radius = 32;
var alpha = 0;

var sidebarWidth = 0;

var gW = document.getElementById('canvas').parentElement.offsetWidth;
var gH = 250;

camera = new THREE.PerspectiveCamera(60, (gW - sidebarWidth) / gH, 1, 10000);
camera.position.y = -12;

scene = new THREE.Scene();

canvas = document.getElementById('canvas');
canvas.width = 64;
canvas.height = 64;
var context = canvas.getContext("2d");

var skinTexture = new THREE.Texture(canvas);


skinTexture.magFilter = THREE.NearestFilter;
skinTexture.minFilter = THREE.NearestMipMapNearestFilter;

// Get the texture for the skin
material = new THREE.MeshBasicMaterial({map: skinTexture, side: THREE.FrontSide});
material2 = new THREE.MeshBasicMaterial({map: skinTexture, transparent: true, opacity: 1, alphaTest: 0.5, side: THREE.DoubleSide});

var img = new Image();
img.crossOrigin = '';
var hasAnimate = false;
img.onload = function () {
    console.log("Loaded Image");

    // Erase what was on the canvas before
    context.clearRect(0, 0, 64, 64);

    // Draw the image to the canvas
    context.drawImage(img, 0, 0);

    // Convert the image if need be
    if (img.height == 32)
        Convert6432To6464(context);
    FixNonVisible(context);
    FixOverlay(context);

    skinTexture.needsUpdate = true;

    material.needsUpdate = true;
    material2.needsUpdate = true;

    if (!hasAnimate)
    {
        RenderSkin();
        hasAnimate = true;
        Animate();
    }
}
img.onerror = function () {
    console.log("Failed loading " + img.src);
}

// I use crafatar because it allows CORS requests.
// Minotar stopped working.
img.src = 'http://crafatar.com/skins/Samar';

function RenderSkin() {
    // Head Parts
    var headTop = [
        new THREE.Vector2(0.125, 0.875),
        new THREE.Vector2(0.25, 0.875),
        new THREE.Vector2(0.25, 1),
        new THREE.Vector2(0.125, 1)
    ];
    var headBottom = [
        new THREE.Vector2(0.25, 0.875),
        new THREE.Vector2(0.375, 0.875),
        new THREE.Vector2(0.375, 1),
        new THREE.Vector2(0.25, 1)
    ];
    var headLeft = [
        new THREE.Vector2(0, 0.75),
        new THREE.Vector2(0.125, 0.75),
        new THREE.Vector2(0.125, 0.875),
        new THREE.Vector2(0, 0.875)
    ];
    var headFront = [
        new THREE.Vector2(0.125, 0.75),
        new THREE.Vector2(0.25, 0.75),
        new THREE.Vector2(0.25, 0.875),
        new THREE.Vector2(0.125, 0.875)
    ];
    var headRight = [
        new THREE.Vector2(0.25, 0.75),
        new THREE.Vector2(0.375, 0.75),
        new THREE.Vector2(0.375, 0.875),
        new THREE.Vector2(0.25, 0.875)
    ];
    var headBack = [
        new THREE.Vector2(0.375, 0.75),
        new THREE.Vector2(0.5, 0.75),
        new THREE.Vector2(0.5, 0.875),
        new THREE.Vector2(0.375, 0.875)
    ];
    headBox = new THREE.BoxGeometry(8, 8, 8, 0, 0, 0);
    headBox.faceVertexUvs[0] = [];
    headBox.faceVertexUvs[0][0] = [headRight[3], headRight[0], headRight[2]];
    headBox.faceVertexUvs[0][1] = [headRight[0], headRight[1], headRight[2]];
    headBox.faceVertexUvs[0][2] = [headLeft[3], headLeft[0], headLeft[2]];
    headBox.faceVertexUvs[0][3] = [headLeft[0], headLeft[1], headLeft[2]];
    headBox.faceVertexUvs[0][4] = [headTop[3], headTop[0], headTop[2]];
    headBox.faceVertexUvs[0][5] = [headTop[0], headTop[1], headTop[2]];
    headBox.faceVertexUvs[0][6] = [headBottom[0], headBottom[3], headBottom[1]];
    headBox.faceVertexUvs[0][7] = [headBottom[3], headBottom[2], headBottom[1]];
    headBox.faceVertexUvs[0][8] = [headFront[3], headFront[0], headFront[2]];
    headBox.faceVertexUvs[0][9] = [headFront[0], headFront[1], headFront[2]];
    headBox.faceVertexUvs[0][10] = [headBack[3], headBack[0], headBack[2]];
    headBox.faceVertexUvs[0][11] = [headBack[0], headBack[1], headBack[2]];
    headMesh = new THREE.Mesh(headBox, material);
    headMesh.name = "head";
    scene.add(headMesh);

    // Body Parts
    var bodyTop = [
        new THREE.Vector2(0.3125, 0.6875),
        new THREE.Vector2(0.4375, 0.6875),
        new THREE.Vector2(0.4375, 0.75),
        new THREE.Vector2(0.3125, 0.75)
    ];
    var bodyBottom = [
        new THREE.Vector2(0.4375, 0.6875),
        new THREE.Vector2(0.5625, 0.6875),
        new THREE.Vector2(0.5625, 0.75),
        new THREE.Vector2(0.4375, 0.75)
    ];
    var bodyLeft = [
        new THREE.Vector2(0.25, 0.5),
        new THREE.Vector2(0.3125, 0.5),
        new THREE.Vector2(0.3125, 0.6875),
        new THREE.Vector2(0.25, 0.6875)
    ];
    var bodyFront = [
        new THREE.Vector2(0.3125, 0.5),
        new THREE.Vector2(0.4375, 0.5),
        new THREE.Vector2(0.4375, 0.6875),
        new THREE.Vector2(0.3125, 0.6875)
    ];
    var bodyRight = [
        new THREE.Vector2(0.4375, 0.5),
        new THREE.Vector2(0.5, 0.5),
        new THREE.Vector2(0.5, 0.6875),
        new THREE.Vector2(0.4375, 0.6875)
    ];
    var bodyBack = [
        new THREE.Vector2(0.5, 0.5),
        new THREE.Vector2(0.625, 0.5),
        new THREE.Vector2(0.625, 0.6875),
        new THREE.Vector2(0.5, 0.6875)
    ];
    bodyBox = new THREE.BoxGeometry(8, 12, 4, 0, 0, 0);
    bodyBox.faceVertexUvs[0] = [];
    bodyBox.faceVertexUvs[0][0] = [bodyRight[3], bodyRight[0], bodyRight[2]];
    bodyBox.faceVertexUvs[0][1] = [bodyRight[0], bodyRight[1], bodyRight[2]];
    bodyBox.faceVertexUvs[0][2] = [bodyLeft[3], bodyLeft[0], bodyLeft[2]];
    bodyBox.faceVertexUvs[0][3] = [bodyLeft[0], bodyLeft[1], bodyLeft[2]];
    bodyBox.faceVertexUvs[0][4] = [bodyTop[3], bodyTop[0], bodyTop[2]];
    bodyBox.faceVertexUvs[0][5] = [bodyTop[0], bodyTop[1], bodyTop[2]];
    bodyBox.faceVertexUvs[0][6] = [bodyBottom[0], bodyBottom[3], bodyBottom[1]];
    bodyBox.faceVertexUvs[0][7] = [bodyBottom[3], bodyBottom[2], bodyBottom[1]];
    bodyBox.faceVertexUvs[0][8] = [bodyFront[3], bodyFront[0], bodyFront[2]];
    bodyBox.faceVertexUvs[0][9] = [bodyFront[0], bodyFront[1], bodyFront[2]];
    bodyBox.faceVertexUvs[0][10] = [bodyBack[3], bodyBack[0], bodyBack[2]];
    bodyBox.faceVertexUvs[0][11] = [bodyBack[0], bodyBack[1], bodyBack[2]];
    bodyMesh = new THREE.Mesh(bodyBox, material);
    bodyMesh.name = "body";
    bodyMesh.position.y = -10;
    scene.add(bodyMesh);

    // Right Arm Parts
    var rightArmTop = [
        new THREE.Vector2(0.6875, 0.6875),
        new THREE.Vector2(0.75, 0.6875),
        new THREE.Vector2(0.75, 0.75),
        new THREE.Vector2(0.6875, 0.75),
    ];
    var rightArmBottom = [
        new THREE.Vector2(0.75, 0.6875),
        new THREE.Vector2(0.8125, 0.6875),
        new THREE.Vector2(0.8125, 0.75),
        new THREE.Vector2(0.75, 0.75)
    ];
    var rightArmLeft = [
        new THREE.Vector2(0.625, 0.5),
        new THREE.Vector2(0.6875, 0.5),
        new THREE.Vector2(0.6875, 0.6875),
        new THREE.Vector2(0.625, 0.6875)
    ];
    var rightArmFront = [
        new THREE.Vector2(0.6875, 0.5),
        new THREE.Vector2(0.75, 0.5),
        new THREE.Vector2(0.75, 0.6875),
        new THREE.Vector2(0.6875, 0.6875)
    ];
    var rightArmRight = [
        new THREE.Vector2(0.75, 0.5),
        new THREE.Vector2(0.8125, 0.5),
        new THREE.Vector2(0.8125, 0.6875),
        new THREE.Vector2(0.75, 0.6875)
    ];
    var rightArmBack = [
        new THREE.Vector2(0.8125, 0.5),
        new THREE.Vector2(0.875, 0.5),
        new THREE.Vector2(0.875, 0.6875),
        new THREE.Vector2(0.8125, 0.6875)
    ];
    rightArmBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
    rightArmBox.faceVertexUvs[0] = [];
    rightArmBox.faceVertexUvs[0][0] = [rightArmRight[3], rightArmRight[0], rightArmRight[2]];
    rightArmBox.faceVertexUvs[0][1] = [rightArmRight[0], rightArmRight[1], rightArmRight[2]];
    rightArmBox.faceVertexUvs[0][2] = [rightArmLeft[3], rightArmLeft[0], rightArmLeft[2]];
    rightArmBox.faceVertexUvs[0][3] = [rightArmLeft[0], rightArmLeft[1], rightArmLeft[2]];
    rightArmBox.faceVertexUvs[0][4] = [rightArmTop[3], rightArmTop[0], rightArmTop[2]];
    rightArmBox.faceVertexUvs[0][5] = [rightArmTop[0], rightArmTop[1], rightArmTop[2]];
    rightArmBox.faceVertexUvs[0][6] = [rightArmBottom[0], rightArmBottom[3], rightArmBottom[1]];
    rightArmBox.faceVertexUvs[0][7] = [rightArmBottom[3], rightArmBottom[2], rightArmBottom[1]];
    rightArmBox.faceVertexUvs[0][8] = [rightArmFront[3], rightArmFront[0], rightArmFront[2]];
    rightArmBox.faceVertexUvs[0][9] = [rightArmFront[0], rightArmFront[1], rightArmFront[2]];
    rightArmBox.faceVertexUvs[0][10] = [rightArmBack[3], rightArmBack[0], rightArmBack[2]];
    rightArmBox.faceVertexUvs[0][11] = [rightArmBack[0], rightArmBack[1], rightArmBack[2]];
    rightArmMesh = new THREE.Mesh(rightArmBox, material);
    rightArmMesh.name = "rightArm";
    rightArmMesh.position.y = -10;
    rightArmMesh.position.x = -6;
    scene.add(rightArmMesh);

    // Left Arm Parts
    var leftArmTop = [
        new THREE.Vector2(0.5625, 0.1875),
        new THREE.Vector2(0.625, 0.1875),
        new THREE.Vector2(0.625, 0.25),
        new THREE.Vector2(0.5625, 0.25),
    ];
    var leftArmBottom = [
        new THREE.Vector2(0.625, 0.1875),
        new THREE.Vector2(0.6875, 0.1875),
        new THREE.Vector2(0.6875, 0.25),
        new THREE.Vector2(0.625, 0.25)
    ];
    var leftArmLeft = [
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.5625, 0),
        new THREE.Vector2(0.5625, 0.1875),
        new THREE.Vector2(0.5, 0.1875)
    ];
    var leftArmFront = [
        new THREE.Vector2(0.5625, 0),
        new THREE.Vector2(0.625, 0),
        new THREE.Vector2(0.625, 0.1875),
        new THREE.Vector2(0.5625, 0.1875)
    ];
    var leftArmRight = [
        new THREE.Vector2(0.625, 0),
        new THREE.Vector2(0.6875, 0),
        new THREE.Vector2(0.6875, 0.1875),
        new THREE.Vector2(0.625, 0.1875)
    ];
    var leftArmBack = [
        new THREE.Vector2(0.6875, 0),
        new THREE.Vector2(0.75, 0),
        new THREE.Vector2(0.75, 0.1875),
        new THREE.Vector2(0.6875, 0.1875)
    ];
    leftArmBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
    leftArmBox.faceVertexUvs[0] = [];
    leftArmBox.faceVertexUvs[0][0] = [leftArmRight[3], leftArmRight[0], leftArmRight[2]];
    leftArmBox.faceVertexUvs[0][1] = [leftArmRight[0], leftArmRight[1], leftArmRight[2]];
    leftArmBox.faceVertexUvs[0][2] = [leftArmLeft[3], leftArmLeft[0], leftArmLeft[2]];
    leftArmBox.faceVertexUvs[0][3] = [leftArmLeft[0], leftArmLeft[1], leftArmLeft[2]];
    leftArmBox.faceVertexUvs[0][4] = [leftArmTop[3], leftArmTop[0], leftArmTop[2]];
    leftArmBox.faceVertexUvs[0][5] = [leftArmTop[0], leftArmTop[1], leftArmTop[2]];
    leftArmBox.faceVertexUvs[0][6] = [leftArmBottom[0], leftArmBottom[3], leftArmBottom[1]];
    leftArmBox.faceVertexUvs[0][7] = [leftArmBottom[3], leftArmBottom[2], leftArmBottom[1]];
    leftArmBox.faceVertexUvs[0][8] = [leftArmFront[3], leftArmFront[0], leftArmFront[2]];
    leftArmBox.faceVertexUvs[0][9] = [leftArmFront[0], leftArmFront[1], leftArmFront[2]];
    leftArmBox.faceVertexUvs[0][10] = [leftArmBack[3], leftArmBack[0], leftArmBack[2]];
    leftArmBox.faceVertexUvs[0][11] = [leftArmBack[0], leftArmBack[1], leftArmBack[2]];
    leftArmMesh = new THREE.Mesh(leftArmBox, material);
    leftArmMesh.name = "leftArm";
    leftArmMesh.position.y = -10;
    leftArmMesh.position.x = 6;
    scene.add(leftArmMesh);

    // Right Leg Parts
    var rightLegTop = [
        new THREE.Vector2(0.0625, 0.6875),
        new THREE.Vector2(0.125, 0.6875),
        new THREE.Vector2(0.125, 0.75),
        new THREE.Vector2(0.0625, 0.75),
    ];
    var rightLegBottom = [
        new THREE.Vector2(0.125, 0.6875),
        new THREE.Vector2(0.1875, 0.6875),
        new THREE.Vector2(0.1875, 0.75),
        new THREE.Vector2(0.125, 0.75)
    ];
    var rightLegLeft = [
        new THREE.Vector2(0, 0.5),
        new THREE.Vector2(0.0625, 0.5),
        new THREE.Vector2(0.0625, 0.6875),
        new THREE.Vector2(0, 0.6875)
    ];
    var rightLegFront = [
        new THREE.Vector2(0.0625, 0.5),
        new THREE.Vector2(0.125, 0.5),
        new THREE.Vector2(0.125, 0.6875),
        new THREE.Vector2(0.0625, 0.6875)
    ];
    var rightLegRight = [
        new THREE.Vector2(0.125, 0.5),
        new THREE.Vector2(0.1875, 0.5),
        new THREE.Vector2(0.1875, 0.6875),
        new THREE.Vector2(0.125, 0.6875)
    ];
    var rightLegBack = [
        new THREE.Vector2(0.1875, 0.5),
        new THREE.Vector2(0.25, 0.5),
        new THREE.Vector2(0.25, 0.6875),
        new THREE.Vector2(0.1875, 0.6875)
    ];
    rightLegBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
    rightLegBox.faceVertexUvs[0] = [];
    rightLegBox.faceVertexUvs[0][0] = [rightLegRight[3], rightLegRight[0], rightLegRight[2]];
    rightLegBox.faceVertexUvs[0][1] = [rightLegRight[0], rightLegRight[1], rightLegRight[2]];
    rightLegBox.faceVertexUvs[0][2] = [rightLegLeft[3], rightLegLeft[0], rightLegLeft[2]];
    rightLegBox.faceVertexUvs[0][3] = [rightLegLeft[0], rightLegLeft[1], rightLegLeft[2]];
    rightLegBox.faceVertexUvs[0][4] = [rightLegTop[3], rightLegTop[0], rightLegTop[2]];
    rightLegBox.faceVertexUvs[0][5] = [rightLegTop[0], rightLegTop[1], rightLegTop[2]];
    rightLegBox.faceVertexUvs[0][6] = [rightLegBottom[0], rightLegBottom[3], rightLegBottom[1]];
    rightLegBox.faceVertexUvs[0][7] = [rightLegBottom[3], rightLegBottom[2], rightLegBottom[1]];
    rightLegBox.faceVertexUvs[0][8] = [rightLegFront[3], rightLegFront[0], rightLegFront[2]];
    rightLegBox.faceVertexUvs[0][9] = [rightLegFront[0], rightLegFront[1], rightLegFront[2]];
    rightLegBox.faceVertexUvs[0][10] = [rightLegBack[3], rightLegBack[0], rightLegBack[2]];
    rightLegBox.faceVertexUvs[0][11] = [rightLegBack[0], rightLegBack[1], rightLegBack[2]];
    rightLegMesh = new THREE.Mesh(rightLegBox, material);
    rightLegMesh.name = "rightLeg"
    rightLegMesh.position.y = -22;
    rightLegMesh.position.x = -2;
    scene.add(rightLegMesh);

    // Left Leg Parts
    var leftLegTop = [
        new THREE.Vector2(0.3125, 0.1875),
        new THREE.Vector2(0.375, 0.1875),
        new THREE.Vector2(0.375, 0.25),
        new THREE.Vector2(0.3125, 0.25),
    ];
    var leftLegBottom = [
        new THREE.Vector2(0.375, 0.1875),
        new THREE.Vector2(0.4375, 0.1875),
        new THREE.Vector2(0.4375, 0.25),
        new THREE.Vector2(0.375, 0.25)
    ];
    var leftLegLeft = [
        new THREE.Vector2(0.25, 0),
        new THREE.Vector2(0.3125, 0),
        new THREE.Vector2(0.3125, 0.1875),
        new THREE.Vector2(0.25, 0.1875)
    ];
    var leftLegFront = [
        new THREE.Vector2(0.3125, 0),
        new THREE.Vector2(0.375, 0),
        new THREE.Vector2(0.375, 0.1875),
        new THREE.Vector2(0.3125, 0.1875)
    ];
    var leftLegRight = [
        new THREE.Vector2(0.375, 0),
        new THREE.Vector2(0.4375, 0),
        new THREE.Vector2(0.4375, 0.1875),
        new THREE.Vector2(0.375, 0.1875)
    ];
    var leftLegBack = [
        new THREE.Vector2(0.4375, 0),
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.5, 0.1875),
        new THREE.Vector2(0.4375, 0.1875)
    ];
    leftLegBox = new THREE.BoxGeometry(4, 12, 4, 0, 0, 0);
    leftLegBox.faceVertexUvs[0] = [];
    leftLegBox.faceVertexUvs[0][0] = [leftLegRight[3], leftLegRight[0], leftLegRight[2]];
    leftLegBox.faceVertexUvs[0][1] = [leftLegRight[0], leftLegRight[1], leftLegRight[2]];
    leftLegBox.faceVertexUvs[0][2] = [leftLegLeft[3], leftLegLeft[0], leftLegLeft[2]];
    leftLegBox.faceVertexUvs[0][3] = [leftLegLeft[0], leftLegLeft[1], leftLegLeft[2]];
    leftLegBox.faceVertexUvs[0][4] = [leftLegTop[3], leftLegTop[0], leftLegTop[2]];
    leftLegBox.faceVertexUvs[0][5] = [leftLegTop[0], leftLegTop[1], leftLegTop[2]];
    leftLegBox.faceVertexUvs[0][6] = [leftLegBottom[0], leftLegBottom[3], leftLegBottom[1]];
    leftLegBox.faceVertexUvs[0][7] = [leftLegBottom[3], leftLegBottom[2], leftLegBottom[1]];
    leftLegBox.faceVertexUvs[0][8] = [leftLegFront[3], leftLegFront[0], leftLegFront[2]];
    leftLegBox.faceVertexUvs[0][9] = [leftLegFront[0], leftLegFront[1], leftLegFront[2]];
    leftLegBox.faceVertexUvs[0][10] = [leftLegBack[3], leftLegBack[0], leftLegBack[2]];
    leftLegBox.faceVertexUvs[0][11] = [leftLegBack[0], leftLegBack[1], leftLegBack[2]];
    leftLegMesh = new THREE.Mesh(leftLegBox, material);
    leftLegMesh.name = "leftLeg";
    leftLegMesh.position.y = -22;
    leftLegMesh.position.x = 2;
    scene.add(leftLegMesh);

    // Head Overlay Parts
    var head2Top = [
        new THREE.Vector2(0.625, 0.875),
        new THREE.Vector2(0.75, 0.875),
        new THREE.Vector2(0.75, 1),
        new THREE.Vector2(0.625, 1)
    ];
    var head2Bottom = [
        new THREE.Vector2(0.75, 0.875),
        new THREE.Vector2(0.875, 0.875),
        new THREE.Vector2(0.875, 1),
        new THREE.Vector2(0.75, 1)
    ];
    var head2Left = [
        new THREE.Vector2(0.5, 0.75),
        new THREE.Vector2(0.625, 0.75),
        new THREE.Vector2(0.625, 0.875),
        new THREE.Vector2(0.5, 0.875)
    ];
    var head2Front = [
        new THREE.Vector2(0.625, 0.75),
        new THREE.Vector2(0.75, 0.75),
        new THREE.Vector2(0.75, 0.875),
        new THREE.Vector2(0.625, 0.875)
    ];
    var head2Right = [
        new THREE.Vector2(0.75, 0.75),
        new THREE.Vector2(0.875, 0.75),
        new THREE.Vector2(0.875, 0.875),
        new THREE.Vector2(0.75, 0.875)
    ];
    var head2Back = [
        new THREE.Vector2(0.875, 0.75),
        new THREE.Vector2(1, 0.75),
        new THREE.Vector2(1, 0.875),
        new THREE.Vector2(0.875, 0.875)
    ];
    head2Box = new THREE.BoxGeometry(9, 9, 9, 0, 0, 0);
    head2Box.faceVertexUvs[0] = [];
    head2Box.faceVertexUvs[0][0] = [head2Right[3], head2Right[0], head2Right[2]];
    head2Box.faceVertexUvs[0][1] = [head2Right[0], head2Right[1], head2Right[2]];
    head2Box.faceVertexUvs[0][2] = [head2Left[3], head2Left[0], head2Left[2]];
    head2Box.faceVertexUvs[0][3] = [head2Left[0], head2Left[1], head2Left[2]];
    head2Box.faceVertexUvs[0][4] = [head2Top[3], head2Top[0], head2Top[2]];
    head2Box.faceVertexUvs[0][5] = [head2Top[0], head2Top[1], head2Top[2]];
    head2Box.faceVertexUvs[0][6] = [head2Bottom[0], head2Bottom[3], head2Bottom[1]];
    head2Box.faceVertexUvs[0][7] = [head2Bottom[3], head2Bottom[2], head2Bottom[1]];
    head2Box.faceVertexUvs[0][8] = [head2Front[3], head2Front[0], head2Front[2]];
    head2Box.faceVertexUvs[0][9] = [head2Front[0], head2Front[1], head2Front[2]];
    head2Box.faceVertexUvs[0][10] = [head2Back[3], head2Back[0], head2Back[2]];
    head2Box.faceVertexUvs[0][11] = [head2Back[0], head2Back[1], head2Back[2]];
    head2Mesh = new THREE.Mesh(head2Box, material2);
    head2Mesh.name = "head2"
    scene.add(head2Mesh);

    // Body Overlay Parts
    var body2Top = [
        new THREE.Vector2(0.3125, 0.4375),
        new THREE.Vector2(0.4375, 0.4375),
        new THREE.Vector2(0.4375, 0.5),
        new THREE.Vector2(0.3125, 0.5)
    ];
    var body2Bottom = [
        new THREE.Vector2(0.4375, 0.4375),
        new THREE.Vector2(0.5625, 0.4375),
        new THREE.Vector2(0.5625, 0.5),
        new THREE.Vector2(0.4375, 0.5)
    ];
    var body2Left = [
        new THREE.Vector2(0.25, 0.25),
        new THREE.Vector2(0.3125, 0.25),
        new THREE.Vector2(0.3125, 0.4375),
        new THREE.Vector2(0.25, 0.4375)
    ];
    var body2Front = [
        new THREE.Vector2(0.3125, 0.25),
        new THREE.Vector2(0.4375, 0.25),
        new THREE.Vector2(0.4375, 0.4375),
        new THREE.Vector2(0.3125, 0.4375)
    ];
    var body2Right = [
        new THREE.Vector2(0.4375, 0.25),
        new THREE.Vector2(0.5, 0.25),
        new THREE.Vector2(0.5, 0.4375),
        new THREE.Vector2(0.4375, 0.4375)
    ];
    var body2Back = [
        new THREE.Vector2(0.5, 0.25),
        new THREE.Vector2(0.625, 0.25),
        new THREE.Vector2(0.625, 0.4375),
        new THREE.Vector2(0.5, 0.4375)
    ];
    body2Box = new THREE.BoxGeometry(9, 13.5, 4.5, 0, 0, 0);
    body2Box.faceVertexUvs[0] = [];
    body2Box.faceVertexUvs[0][0] = [body2Right[3], body2Right[0], body2Right[2]];
    body2Box.faceVertexUvs[0][1] = [body2Right[0], body2Right[1], body2Right[2]];
    body2Box.faceVertexUvs[0][2] = [body2Left[3], body2Left[0], body2Left[2]];
    body2Box.faceVertexUvs[0][3] = [body2Left[0], body2Left[1], body2Left[2]];
    body2Box.faceVertexUvs[0][4] = [body2Top[3], body2Top[0], body2Top[2]];
    body2Box.faceVertexUvs[0][5] = [body2Top[0], body2Top[1], body2Top[2]];
    body2Box.faceVertexUvs[0][6] = [body2Bottom[0], body2Bottom[3], body2Bottom[1]];
    body2Box.faceVertexUvs[0][7] = [body2Bottom[3], body2Bottom[2], body2Bottom[1]];
    body2Box.faceVertexUvs[0][8] = [body2Front[3], body2Front[0], body2Front[2]];
    body2Box.faceVertexUvs[0][9] = [body2Front[0], body2Front[1], body2Front[2]];
    body2Box.faceVertexUvs[0][10] = [body2Back[3], body2Back[0], body2Back[2]];
    body2Box.faceVertexUvs[0][11] = [body2Back[0], body2Back[1], body2Back[2]];
    body2Mesh = new THREE.Mesh(body2Box, material2);
    body2Mesh.name = "body2";
    body2Mesh.position.y = -10;
    scene.add(body2Mesh);

    // Right Arm Overlay Parts
    var rightArm2Top = [
        new THREE.Vector2(0.6875, 0.4375),
        new THREE.Vector2(0.75, 0.4375),
        new THREE.Vector2(0.75, 0.5),
        new THREE.Vector2(0.6875, 0.5),
    ];
    var rightArm2Bottom = [
        new THREE.Vector2(0.75, 0.4375),
        new THREE.Vector2(0.8125, 0.4375),
        new THREE.Vector2(0.8125, 0.5),
        new THREE.Vector2(0.75, 0.5)
    ];
    var rightArm2Left = [
        new THREE.Vector2(0.625, 0.25),
        new THREE.Vector2(0.6875, 0.25),
        new THREE.Vector2(0.6875, 0.4375),
        new THREE.Vector2(0.625, 0.4375)
    ];
    var rightArm2Front = [
        new THREE.Vector2(0.6875, 0.25),
        new THREE.Vector2(0.75, 0.25),
        new THREE.Vector2(0.75, 0.4375),
        new THREE.Vector2(0.6875, 0.4375)
    ];
    var rightArm2Right = [
        new THREE.Vector2(0.75, 0.25),
        new THREE.Vector2(0.8125, 0.25),
        new THREE.Vector2(0.8125, 0.4375),
        new THREE.Vector2(0.75, 0.4375)
    ];
    var rightArm2Back = [
        new THREE.Vector2(0.8125, 0.25),
        new THREE.Vector2(0.875, 0.25),
        new THREE.Vector2(0.875, 0.4375),
        new THREE.Vector2(0.8125, 0.4375)
    ];
    rightArm2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
    rightArm2Box.faceVertexUvs[0] = [];
    rightArm2Box.faceVertexUvs[0][0] = [rightArm2Right[3], rightArm2Right[0], rightArm2Right[2]];
    rightArm2Box.faceVertexUvs[0][1] = [rightArm2Right[0], rightArm2Right[1], rightArm2Right[2]];
    rightArm2Box.faceVertexUvs[0][2] = [rightArm2Left[3], rightArm2Left[0], rightArm2Left[2]];
    rightArm2Box.faceVertexUvs[0][3] = [rightArm2Left[0], rightArm2Left[1], rightArm2Left[2]];
    rightArm2Box.faceVertexUvs[0][4] = [rightArm2Top[3], rightArm2Top[0], rightArm2Top[2]];
    rightArm2Box.faceVertexUvs[0][5] = [rightArm2Top[0], rightArm2Top[1], rightArm2Top[2]];
    rightArm2Box.faceVertexUvs[0][6] = [rightArm2Bottom[0], rightArm2Bottom[3], rightArm2Bottom[1]];
    rightArm2Box.faceVertexUvs[0][7] = [rightArm2Bottom[3], rightArm2Bottom[2], rightArm2Bottom[1]];
    rightArm2Box.faceVertexUvs[0][8] = [rightArm2Front[3], rightArm2Front[0], rightArm2Front[2]];
    rightArm2Box.faceVertexUvs[0][9] = [rightArm2Front[0], rightArm2Front[1], rightArm2Front[2]];
    rightArm2Box.faceVertexUvs[0][10] = [rightArm2Back[3], rightArm2Back[0], rightArm2Back[2]];
    rightArm2Box.faceVertexUvs[0][11] = [rightArm2Back[0], rightArm2Back[1], rightArm2Back[2]];
    rightArm2Mesh = new THREE.Mesh(rightArm2Box, material2);
    rightArm2Mesh.name = "rightArm2";
    rightArm2Mesh.position.y = -10;
    rightArm2Mesh.position.x = -6;
    scene.add(rightArm2Mesh);

    // Left Arm Overlay Parts
    var leftArm2Top = [
        new THREE.Vector2(0.8125, 0.1875),
        new THREE.Vector2(0.875, 0.1875),
        new THREE.Vector2(0.875, 0.25),
        new THREE.Vector2(0.8125, 0.25),
    ];
    var leftArm2Bottom = [
        new THREE.Vector2(0.875, 0.1875),
        new THREE.Vector2(0.9375, 0.1875),
        new THREE.Vector2(0.9375, 0.25),
        new THREE.Vector2(0.875, 0.25)
    ];
    var leftArm2Left = [
        new THREE.Vector2(0.75, 0),
        new THREE.Vector2(0.8125, 0),
        new THREE.Vector2(0.8125, 0.1875),
        new THREE.Vector2(0.75, 0.1875)
    ];
    var leftArm2Front = [
        new THREE.Vector2(0.8125, 0),
        new THREE.Vector2(0.875, 0),
        new THREE.Vector2(0.875, 0.1875),
        new THREE.Vector2(0.8125, 0.1875)
    ];
    var leftArm2Right = [
        new THREE.Vector2(0.875, 0),
        new THREE.Vector2(0.9375, 0),
        new THREE.Vector2(0.9375, 0.1875),
        new THREE.Vector2(0.875, 0.1875)
    ];
    var leftArm2Back = [
        new THREE.Vector2(0.9375, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 0.1875),
        new THREE.Vector2(0.9375, 0.1875)
    ];
    leftArm2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
    leftArm2Box.faceVertexUvs[0] = [];
    leftArm2Box.faceVertexUvs[0][0] = [leftArm2Right[3], leftArm2Right[0], leftArm2Right[2]];
    leftArm2Box.faceVertexUvs[0][1] = [leftArm2Right[0], leftArm2Right[1], leftArm2Right[2]];
    leftArm2Box.faceVertexUvs[0][2] = [leftArm2Left[3], leftArm2Left[0], leftArm2Left[2]];
    leftArm2Box.faceVertexUvs[0][3] = [leftArm2Left[0], leftArm2Left[1], leftArm2Left[2]];
    leftArm2Box.faceVertexUvs[0][4] = [leftArm2Top[3], leftArm2Top[0], leftArm2Top[2]];
    leftArm2Box.faceVertexUvs[0][5] = [leftArm2Top[0], leftArm2Top[1], leftArm2Top[2]];
    leftArm2Box.faceVertexUvs[0][6] = [leftArm2Bottom[0], leftArm2Bottom[3], leftArm2Bottom[1]];
    leftArm2Box.faceVertexUvs[0][7] = [leftArm2Bottom[3], leftArm2Bottom[2], leftArm2Bottom[1]];
    leftArm2Box.faceVertexUvs[0][8] = [leftArm2Front[3], leftArm2Front[0], leftArm2Front[2]];
    leftArm2Box.faceVertexUvs[0][9] = [leftArm2Front[0], leftArm2Front[1], leftArm2Front[2]];
    leftArm2Box.faceVertexUvs[0][10] = [leftArm2Back[3], leftArm2Back[0], leftArm2Back[2]];
    leftArm2Box.faceVertexUvs[0][11] = [leftArm2Back[0], leftArm2Back[1], leftArm2Back[2]];
    leftArm2Mesh = new THREE.Mesh(leftArm2Box, material2);
    leftArm2Mesh.name = "leftArm2";
    leftArm2Mesh.position.y = -10;
    leftArm2Mesh.position.x = 6;
    scene.add(leftArm2Mesh);

    // Right Leg Overlay Parts
    var rightLeg2Top = [
        new THREE.Vector2(0.0625, 0.4375),
        new THREE.Vector2(0.125, 0.4375),
        new THREE.Vector2(0.125, 0.5),
        new THREE.Vector2(0.0625, 0.5),
    ];
    var rightLeg2Bottom = [
        new THREE.Vector2(0.125, 0.4375),
        new THREE.Vector2(0.1875, 0.4375),
        new THREE.Vector2(0.1875, 0.5),
        new THREE.Vector2(0.125, 0.5)
    ];
    var rightLeg2Left = [
        new THREE.Vector2(0, 0.25),
        new THREE.Vector2(0.0625, 0.25),
        new THREE.Vector2(0.0625, 0.4375),
        new THREE.Vector2(0, 0.4375)
    ];
    var rightLeg2Front = [
        new THREE.Vector2(0.0625, 0.25),
        new THREE.Vector2(0.125, 0.25),
        new THREE.Vector2(0.125, 0.4375),
        new THREE.Vector2(0.0625, 0.4375)
    ];
    var rightLeg2Right = [
        new THREE.Vector2(0.125, 0.25),
        new THREE.Vector2(0.1875, 0.25),
        new THREE.Vector2(0.1875, 0.4375),
        new THREE.Vector2(0.125, 0.4375)
    ];
    var rightLeg2Back = [
        new THREE.Vector2(0.1875, 0.25),
        new THREE.Vector2(0.25, 0.25),
        new THREE.Vector2(0.25, 0.4375),
        new THREE.Vector2(0.1875, 0.4375)
    ];
    rightLeg2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
    rightLeg2Box.faceVertexUvs[0] = [];
    rightLeg2Box.faceVertexUvs[0][0] = [rightLeg2Right[3], rightLeg2Right[0], rightLeg2Right[2]];
    rightLeg2Box.faceVertexUvs[0][1] = [rightLeg2Right[0], rightLeg2Right[1], rightLeg2Right[2]];
    rightLeg2Box.faceVertexUvs[0][2] = [rightLeg2Left[3], rightLeg2Left[0], rightLeg2Left[2]];
    rightLeg2Box.faceVertexUvs[0][3] = [rightLeg2Left[0], rightLeg2Left[1], rightLeg2Left[2]];
    rightLeg2Box.faceVertexUvs[0][4] = [rightLeg2Top[3], rightLeg2Top[0], rightLeg2Top[2]];
    rightLeg2Box.faceVertexUvs[0][5] = [rightLeg2Top[0], rightLeg2Top[1], rightLeg2Top[2]];
    rightLeg2Box.faceVertexUvs[0][6] = [rightLeg2Bottom[0], rightLeg2Bottom[3], rightLeg2Bottom[1]];
    rightLeg2Box.faceVertexUvs[0][7] = [rightLeg2Bottom[3], rightLeg2Bottom[2], rightLeg2Bottom[1]];
    rightLeg2Box.faceVertexUvs[0][8] = [rightLeg2Front[3], rightLeg2Front[0], rightLeg2Front[2]];
    rightLeg2Box.faceVertexUvs[0][9] = [rightLeg2Front[0], rightLeg2Front[1], rightLeg2Front[2]];
    rightLeg2Box.faceVertexUvs[0][10] = [rightLeg2Back[3], rightLeg2Back[0], rightLeg2Back[2]];
    rightLeg2Box.faceVertexUvs[0][11] = [rightLeg2Back[0], rightLeg2Back[1], rightLeg2Back[2]];
    rightLeg2Mesh = new THREE.Mesh(rightLeg2Box, material2);
    rightLeg2Mesh.name = "rightLeg2"
    rightLeg2Mesh.position.y = -22;
    rightLeg2Mesh.position.x = -2;
    scene.add(rightLeg2Mesh);


//    var kirk = THREE.BoxGeometry(7, 7, 7, 0, 0, 0);
//    var kirkMesh = new THREE.Mesh(kirk, material2);
//    kirkMesh.position.y = 5;
//    kirkMesh.position.x = 5;
//    scene.add(kirkMesh);


    // Left Leg Overlay Parts
    var leftLeg2Top = [
        new THREE.Vector2(0.0625, 0.1875),
        new THREE.Vector2(0.125, 0.1875),
        new THREE.Vector2(0.125, 0.25),
        new THREE.Vector2(0.0625, 0.25),
    ];
    var leftLeg2Bottom = [
        new THREE.Vector2(0.125, 0.1875),
        new THREE.Vector2(0.1875, 0.1875),
        new THREE.Vector2(0.1875, 0.25),
        new THREE.Vector2(0.125, 0.25)
    ];
    var leftLeg2Left = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.0625, 0),
        new THREE.Vector2(0.0625, 0.1875),
        new THREE.Vector2(0, 0.1875)
    ];
    var leftLeg2Front = [
        new THREE.Vector2(0.0625, 0),
        new THREE.Vector2(0.125, 0),
        new THREE.Vector2(0.125, 0.1875),
        new THREE.Vector2(0.0625, 0.1875)
    ];
    var leftLeg2Right = [
        new THREE.Vector2(0.125, 0),
        new THREE.Vector2(0.1875, 0),
        new THREE.Vector2(0.1875, 0.1875),
        new THREE.Vector2(0.125, 0.1875)
    ];
    var leftLeg2Back = [
        new THREE.Vector2(0.1875, 0),
        new THREE.Vector2(0.25, 0),
        new THREE.Vector2(0.25, 0.1875),
        new THREE.Vector2(0.1875, 0.1875)
    ];
    var leftLeg2Box = new THREE.BoxGeometry(4.5, 13.5, 4.5, 0, 0, 0);
    leftLeg2Box.faceVertexUvs[0] = [];
    leftLeg2Box.faceVertexUvs[0][0] = [leftLeg2Right[3], leftLeg2Right[0], leftLeg2Right[2]];
    leftLeg2Box.faceVertexUvs[0][1] = [leftLeg2Right[0], leftLeg2Right[1], leftLeg2Right[2]];
    leftLeg2Box.faceVertexUvs[0][2] = [leftLeg2Left[3], leftLeg2Left[0], leftLeg2Left[2]];
    leftLeg2Box.faceVertexUvs[0][3] = [leftLeg2Left[0], leftLeg2Left[1], leftLeg2Left[2]];
    leftLeg2Box.faceVertexUvs[0][4] = [leftLeg2Top[3], leftLeg2Top[0], leftLeg2Top[2]];
    leftLeg2Box.faceVertexUvs[0][5] = [leftLeg2Top[0], leftLeg2Top[1], leftLeg2Top[2]];
    leftLeg2Box.faceVertexUvs[0][6] = [leftLeg2Bottom[0], leftLeg2Bottom[3], leftLeg2Bottom[1]];
    leftLeg2Box.faceVertexUvs[0][7] = [leftLeg2Bottom[3], leftLeg2Bottom[2], leftLeg2Bottom[1]];
    leftLeg2Box.faceVertexUvs[0][8] = [leftLeg2Front[3], leftLeg2Front[0], leftLeg2Front[2]];
    leftLeg2Box.faceVertexUvs[0][9] = [leftLeg2Front[0], leftLeg2Front[1], leftLeg2Front[2]];
    leftLeg2Box.faceVertexUvs[0][10] = [leftLeg2Back[3], leftLeg2Back[0], leftLeg2Back[2]];
    leftLeg2Box.faceVertexUvs[0][11] = [leftLeg2Back[0], leftLeg2Back[1], leftLeg2Back[2]];
    leftLeg2Mesh = new THREE.Mesh(leftLeg2Box, material2);
    leftLeg2Mesh.name = "leftLeg2";
    leftLeg2Mesh.position.y = -22;
    leftLeg2Mesh.position.x = 2;
    scene.add(leftLeg2Mesh);

    // Add to page
    container = document.getElementById('model');

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.setSize(gW - sidebarWidth, gH);

    window.addEventListener('resize', onWindowResize, false);

    model.appendChild(renderer.domElement);
}

function onWindowResize() {
    camera.aspect = (gW - sidebarWidth);
    camera.updateProjectionMatrix();

    renderer.setSize(gW - sidebarWidth, gH);
}

function Animate() {
    requestAnimationFrame(Animate);



    //alpha = /*(Math.PI / 2)*/ + (Math.PI / 16);
    alpha += Math.PI / 500;
    camera.position.z = 30;

    camera.position.y = mouseY * 3;
    camera.position.x = -mouseX * 3;

    headMesh.rotation.x = mouseY / 16;
    headMesh.rotation.y = mouseX / 16;
    head2Mesh.rotation.x = mouseY / 16;
    head2Mesh.rotation.y = mouseX / 16;

    camera.lookAt(bodyMesh.position);

    var delta = 12;
    //Leg Swing
    leftLeg2Mesh.rotation.x = leftLegMesh.rotation.x = Math.cos(alpha * 4) / delta;
    leftLeg2Mesh.position.z = leftLegMesh.position.z = 0 - 6 * Math.sin(leftLegMesh.rotation.x);
    leftLeg2Mesh.position.y = leftLegMesh.position.y = -16 - 6 * Math.abs(Math.cos(leftLegMesh.rotation.x));
    rightLeg2Mesh.rotation.x = rightLegMesh.rotation.x = Math.cos(alpha * 4 + (Math.PI)) / delta;
    rightLeg2Mesh.position.z = rightLegMesh.position.z = 0 - 6 * Math.sin(rightLegMesh.rotation.x);
    rightLeg2Mesh.position.y = rightLegMesh.position.y = -16 - 6 * Math.abs(Math.cos(rightLegMesh.rotation.x));

    //Arm Swing
    leftArm2Mesh.rotation.x = leftArmMesh.rotation.x = Math.cos(alpha * 4 + (Math.PI)) / delta;
    leftArm2Mesh.position.z = leftArmMesh.position.z = 0 - 6 * Math.sin(leftArmMesh.rotation.x);
    leftArm2Mesh.position.y = leftArmMesh.position.y = -4 - 6 * Math.abs(Math.cos(leftArmMesh.rotation.x));
    rightArm2Mesh.rotation.x = rightArmMesh.rotation.x = Math.cos(alpha * 4) / delta;
    rightArm2Mesh.position.z = rightArmMesh.position.z = 0 - 6 * Math.sin(rightArmMesh.rotation.x);
    rightArm2Mesh.position.y = rightArmMesh.position.y = -4 - 6 * Math.abs(Math.cos(rightArmMesh.rotation.x));

    renderer.render(scene, camera);




}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var mouseX = 0, mouseY = 0;

function onDocumentMouseMove(event) {
    event.preventDefault();

    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;



//	mouseX = ( ( event.clientX - canvas.offsetLeft  ) / canvas.clientWidth );
    mouseX = ((event.clientX - w / 2 - canvas.offsetLeft + document.getElementById('canvas').parentElement.offsetWidth) / canvas.clientWidth);

    mouseY = ((event.clientY - h / 2 - canvas.offsetTop + 120) / canvas.clientHeight);
//	console.log("x: " + mouseX + ", y: " +mouseY);
}



// Change the username
//	document.getElementById('username').onkeypress = function(e){
//		if (!e) e = window.event;
//		var keyCode = e.keyCode || e.which;
//		if (keyCode == '13'){
//			// Enter pressed, set new image
//			img.src = 'https://crafatar.com/skins/' + document.getElementById('username').value;
//		}
//	}

/*
 A hodgepodge of random scripts to aid in rendering Minecraft skins
 Copyright (C) 2014 Kent Rasmussen
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// Latest code should be available at https://github.com/earthiverse

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the overlays transparent if they have no transparent pixels (how Minecraft does it)
function FixOverlay(context) {
    FixHead2(context);
    FixBody2(context);
    FixRightArm2(context);
    FixLeftArm2(context);
    FixRightLeg2(context);
    FixLeftLeg2(context);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the head overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixHead2(context) {
    // Front
    if (HasTransparency(context, 40, 8, 8, 8))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 40, 0, 8, 8))
        return;
    if (HasTransparency(context, 48, 0, 8, 8))
        return;
    if (HasTransparency(context, 32, 8, 8, 8))
        return;
    if (HasTransparency(context, 48, 8, 8, 8))
        return;
    if (HasTransparency(context, 56, 8, 8, 8))
        return;

    // Didn't have transparency, clearing the head overlay area.
    context.clearRect(40, 0, 8, 8);
    context.clearRect(48, 0, 8, 8);
    context.clearRect(32, 8, 8, 8);
    context.clearRect(40, 8, 8, 8);
    context.clearRect(48, 8, 8, 8);
    context.clearRect(56, 8, 8, 8);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the body overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixBody2(context) {
    // Front
    if (HasTransparency(context, 20, 36, 8, 12))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 20, 32, 8, 4))
        return;
    if (HasTransparency(context, 28, 32, 8, 4))
        return;
    if (HasTransparency(context, 16, 36, 4, 12))
        return;
    if (HasTransparency(context, 28, 36, 4, 12))
        return;
    if (HasTransparency(context, 32, 36, 8, 12))
        return;

    // Didn't have transparency, clearing the body overlay area.
    context.clearRect(20, 32, 8, 4);
    context.clearRect(28, 32, 8, 4);
    context.clearRect(16, 36, 4, 12);
    context.clearRect(20, 36, 8, 12);
    context.clearRect(28, 36, 4, 12);
    context.clearRect(32, 36, 8, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the right arm overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixRightArm2(context) {
    // Front
    if (HasTransparency(context, 44, 36, 4, 12))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 44, 32, 4, 4))
        return;
    if (HasTransparency(context, 48, 32, 4, 4))
        return;
    if (HasTransparency(context, 40, 36, 4, 12))
        return;
    if (HasTransparency(context, 48, 36, 4, 12))
        return;
    if (HasTransparency(context, 52, 36, 4, 12))
        return;

    // Didn't have transparency, clearing the right arm overlay area.
    context.clearRect(44, 32, 4, 4);
    context.clearRect(48, 32, 4, 4);
    context.clearRect(40, 36, 4, 12);
    context.clearRect(44, 36, 4, 12);
    context.clearRect(48, 36, 4, 12);
    context.clearRect(52, 36, 4, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the left arm overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixLeftArm2(context) {
    // Front
    if (HasTransparency(context, 52, 52, 4, 12))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 52, 48, 4, 4))
        return;
    if (HasTransparency(context, 56, 48, 4, 4))
        return;
    if (HasTransparency(context, 48, 52, 4, 12))
        return;
    if (HasTransparency(context, 56, 52, 4, 12))
        return;
    if (HasTransparency(context, 60, 52, 4, 12))
        return;

    // Didn't have transparency, clearing the left arm overlay area.
    context.clearRect(52, 48, 4, 4);
    context.clearRect(56, 48, 4, 4);
    context.clearRect(48, 52, 4, 12);
    context.clearRect(52, 52, 4, 12);
    context.clearRect(56, 52, 4, 12);
    context.clearRect(60, 52, 4, 12);
}
// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the right overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixRightLeg2(context) {
    // Front
    if (HasTransparency(context, 4, 36, 4, 12))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 4, 32, 4, 4))
        return;
    if (HasTransparency(context, 8, 32, 4, 4))
        return;
    if (HasTransparency(context, 0, 36, 4, 12))
        return;
    if (HasTransparency(context, 8, 36, 4, 12))
        return;
    if (HasTransparency(context, 12, 36, 4, 12))
        return;

    // Didn't have transparency, clearing the right leg overlay area.
    context.clearRect(4, 32, 4, 4);
    context.clearRect(8, 32, 4, 4);
    context.clearRect(0, 36, 4, 12);
    context.clearRect(4, 36, 4, 12);
    context.clearRect(8, 36, 4, 12);
    context.clearRect(12, 36, 4, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the left overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixLeftLeg2(context) {
    // Front
    if (HasTransparency(context, 4, 52, 4, 12))
        return;

    // Top, Bottom, Right, Left, Back
    if (HasTransparency(context, 4, 48, 4, 4))
        return;
    if (HasTransparency(context, 8, 48, 4, 4))
        return;
    if (HasTransparency(context, 0, 52, 4, 12))
        return;
    if (HasTransparency(context, 8, 52, 4, 12))
        return;
    if (HasTransparency(context, 12, 52, 4, 12))
        return;

    // Didn't have transparency, clearing the left leg overlay area.
    context.clearRect(4, 48, 4, 4);
    context.clearRect(8, 48, 4, 4);
    context.clearRect(0, 52, 4, 12);
    context.clearRect(4, 52, 4, 12);
    context.clearRect(8, 52, 4, 12);
    context.clearRect(12, 52, 4, 12);
}

// Expects a canvas with a 64x32 Minecraft skin drawn in the very top left corner (0,0)
// Your canvas should be 64x64 in size to show the skin parts that were converted
function Convert6432To6464(context) {
    // Convert old format to new format
    Copy(context, 4, 16, 4, 4, 20, 48, true);	// Top Leg
    Copy(context, 8, 16, 4, 4, 24, 48, true);	// Bottom Leg
    Copy(context, 0, 20, 4, 12, 24, 52, true);	// Outer Leg
    Copy(context, 4, 20, 4, 12, 20, 52, true);	// Front Leg
    Copy(context, 8, 20, 4, 12, 16, 52, true);	// Inner Leg
    Copy(context, 12, 20, 4, 12, 28, 52, true);	// Back Leg

    Copy(context, 44, 16, 4, 4, 36, 48, true);	// Top Arm
    Copy(context, 48, 16, 4, 4, 40, 48, true);	// Bottom Arm
    Copy(context, 40, 20, 4, 12, 40, 52, true);	// Outer Arm
    Copy(context, 44, 20, 4, 12, 36, 52, true);	// Front Arm
    Copy(context, 48, 20, 4, 12, 32, 52, true);	// Inner Arm
    Copy(context, 52, 20, 4, 12, 44, 52, true);	// Back Arm
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the non-visible parts of the Minecraft skin transparent
function FixNonVisible(context) {
    // 64x32 and 64x64 skin parts
    context.clearRect(0, 0, 8, 8);
    context.clearRect(24, 0, 16, 8);
    context.clearRect(56, 0, 8, 8);
    context.clearRect(0, 16, 4, 4);
    context.clearRect(12, 16, 8, 4);
    context.clearRect(36, 16, 8, 4);
    context.clearRect(52, 16, 4, 4);
    context.clearRect(56, 16, 8, 32);

    // 64x64 skin parts
    context.clearRect(0, 32, 4, 4);
    context.clearRect(12, 32, 8, 4);
    context.clearRect(36, 32, 8, 4);
    context.clearRect(52, 32, 4, 4);
    context.clearRect(0, 48, 4, 4);
    context.clearRect(12, 48, 8, 4);
    context.clearRect(28, 48, 8, 4);
    context.clearRect(44, 48, 8, 4);
    context.clearRect(60, 48, 8, 4);
}

// Checks if the given part of the canvas contains a pixel with 0 alpha value (transparent)
function HasTransparency(context, x, y, w, h) {
    var imgData = context.getImageData(x, y, w, h);

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            var index = (x + y * w) * 4;
            if (imgData.data[index + 3] == 0)
                return true;	// Has transparency
        }
    }

    return false;
}

// Copies one part of the canvas to another, with the option of flipping it horizontally
function Copy(context, sX, sY, w, h, dX, dY, flipHorizontal) {
    var imgData = context.getImageData(sX, sY, w, h);

    if (flipHorizontal)
    {
        // Flip horizontal
        for (y = 0; y < h; y++) {
            for (x = 0; x < (w / 2); x++) {
                index = (x + y * w) * 4;
                index2 = ((w - x - 1) + y * w) * 4;
                var pA1 = imgData.data[index];
                var pA2 = imgData.data[index + 1];
                var pA3 = imgData.data[index + 2];
                var pA4 = imgData.data[index + 3];

                var pB1 = imgData.data[index2];
                var pB2 = imgData.data[index2 + 1];
                var pB3 = imgData.data[index2 + 2];
                var pB4 = imgData.data[index2 + 3];

                imgData.data[index] = pB1;
                imgData.data[index + 1] = pB2;
                imgData.data[index + 2] = pB3;
                imgData.data[index + 3] = pB4;

                imgData.data[index2] = pA1;
                imgData.data[index2 + 1] = pA2;
                imgData.data[index2 + 2] = pA3;
                imgData.data[index2 + 3] = pA4;
            }
        }
    }

    context.putImageData(imgData, dX, dY);
}
