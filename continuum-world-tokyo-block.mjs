// Art is concentrated on the two playable shopfronts. New solid props remain
// behind their existing facade colliders; doorways and pedestrian routes stay clear.
export function dressTokyoBlock(meshes, group, {width, depth, height, id}) {
  const {shape, surface, sign, contact} = meshes;
  const cafe = id === 'tokyo_cafe', face = depth / 2;
  const metal = surface('metal', 1, 0x7b8586);
  const grout = surface('concrete', [width / 1.5, 1], 0xaaa89e);
  const dark = 0x36474b;
  group.userData.tokyoDetailBlock = true;
  // Recessed tiled plinth, drainage joints and individual vertical facade ribs.
  for (const side of [-1, 1]) {
    const center = side * (width / 4 + .55), bay = width / 2 - 1.5;
    shape(group, 'box', grout, [center, .31, face + .015], [bay, .6, .07]);
    for (let x = -bay / 2; x < bay / 2; x += .24)
      shape(group, 'box', cafe ? 0x6e7770 : 0xc4cdc5, [center+x+.1, .31, face+.06], [.205,.55,.025]);
    // Closed upper-floor aluminium frames with a deep sill and irregular blinds.
    for (let j=0; j<2; j++) {
      const x = center + (j-.5)*2.1, y = Math.min(height-1.3, 5.7);
      shape(group,'box',dark,[x,y,face+.13],[1.8,1.2,.06]);
      shape(group,'box',0x6f8b92,[x,y,face+.17],[1.68,1.08,.025]);
      shape(group,'box',metal,[x,y,face+.2],[.036,1.12,.045]);
      shape(group,'box',metal,[x,y-.63,face+.29],[1.92,.08,.36]);
      for(let slat=0; slat<6; slat++)
        shape(group,'box',cafe?0xc1bca9:0xaaa99d,[x,y+.42-slat*.13,face+.22],[1.58,.085,.015]);
    }
    // Condenser, fan grille, mounting brackets and insulated service pipe.
    const x = side*(width/2-1.7), y=4.58;
    shape(group,'box',0xaab0aa,[x,y,face+.3],[1.15,.7,.48]);
    const fan=shape(group,'cylinder',dark,[x-.18,y,face+.56],[.23,.035,.23]);
    fan.rotation.x=Math.PI/2;
    for(let j=-3;j<=3;j++)
      shape(group,'box',metal,[x-.18+j*.065,y,face+.59],[.016,.45,.016]);
    for(const dx of [-.42,.42]) shape(group,'box',dark,[x+dx,y-.4,face+.24],[.045,.12,.5]);
    shape(group,'cylinder',0xc4c0ab,[x+.59,3.5,face+.14],[.035,2.15,.035]);
    contact(group, x, face-.2, 2.1, .8);
  }
  // A white fascia and slim illuminated bands read as a Japanese convenience
  // store without borrowing any chain's branding or trademarks.
  if (!cafe) {
    shape(group,'box',0xe3e6db,[0,3.65,face+.31],[width-.5,1.25,.1]);
    shape(group,'box',0x238574,[0,4.31,face+.33],[width-.4,.085,.12]);
    shape(group,'box',0x527998,[0,2.99,face+.33],[width-.4,.065,.12]);
    sign(group,'ほしマート',[0,3.65,face+.38],5,'#e4e8de','#24554b');
    sign(group,'24時間営業',[5.5,3.7,face+.38],2.4,'#e4e8de','#24554b');
    sign(group,'ATM・コピー',[-5.3,3.7,face+.38],2.8,'#e4e8de','#24554b');
    sign(group,'ATM ・ コピー ・ 公共料金',[width*.28,2.54,face+.12],3.7,'#eef0de','#33554b');
    sign(group,'おにぎり 150円  /  お弁当 580円',[-width*.27,2.54,face+.12],3.8,'#ede4cb','#6c4335');
  } else {
    // Separate noren panels and a recessed menu give a human-scale entrance.
    for(const x of [-.53,0,.53]) {
      shape(group,'box',0x3c5448,[x,2.65,face+.13],[.48,.54,.025]);
      sign(group,x<0?'珈':x>0?'処':'琲',[x,2.65,face+.16],1.1,'#00000000','#e6ddbf').scale.y=.4;
    }
    sign(group,'自家焙煎  /  喫茶・軽食',[-width*.27,2.45,face+.11],3.5,'#e2dbc6','#33453a');
    sign(group,'COFFEE 450円  /  本日のケーキ',[width*.27,2.45,face+.11],3.7,'#304038','#e9dfc4');
  }
  sign(group,'東京 ・ こもれび通り',[width/2-.5,1.8,face+.13],.75,'#315e68','#edf0de').scale.y=.6;
  // An accessible route stays in the middle; all notices are on the facade.
  sign(group,'営業中',[.82,1.72,face+.15],.28,'#ede2c7','#46533f').scale.y=.4;
  for(const side of [-1,1]) {
    const x=side*(width/2-.18);
    shape(group,'cylinder',metal,[x,3.3,face+.18],[.038,6.45,.038]);
    for(let y=.6;y<6.5;y+=1.1)shape(group,'box',dark,[x,y,face+.18],[.13,.035,.09]);
    shape(group,'box',0x687674,[x,1,face-.17],[.25,.5,.2]);
  }
  // Upper tenant signage and shallow wire conduits break the perfectly clean box.
  const tenant = sign(group,cafe?'2F  語学教室 ・ 受付':'2F  歯科 ・ 予約受付',[0,Math.min(height-.4,6.6),face+.17],5.5,cafe?'#465e6a':'#737b65','#f0ead7');
  tenant.scale.y=.3;
  const columnX=width/2-.25;
  shape(group,'box',0xe7e2d1,[columnX,6,face+.5],[.55,2.2,.15]);
  for(const [i,glyph] of (cafe?['自','家','焙','煎']:['食','品','雑','貨']).entries()) {
    const panel=sign(group,glyph,[columnX,6.7-i*.45,face+.59],1.5,'#00000000','#344647');
    panel.scale.y=.38;
  }
  shape(group,'box',dark,[0,4.08,face+.17],[width-.25,.035,.06]);
}

export function makeTokyoRoadMarkings(meshes, root) {
  const {shape, sign}=meshes;
  // Flush paint: geometry adds no new obstruction to movement.
  for(const [i,letter] of ['止','ま','れ'].entries()) {
    const mark=sign(root,letter,[2.1,.076,8.5+i*.85],3,'#00000000','#e4e0ca');
    mark.scale.y=.72;
    mark.rotation.x=-Math.PI/2;
    mark.castShadow=false;
  }
  // Stop line, a worn lane guide and the edge of the commercial street.
  shape(root,'box',0xe2dfcf,[2,.072,7.5],[3.15,.008,.18]).castShadow=false;
  for(const x of [-28,-24,-20,-16,-12,12,16,20,24,28]) {
    shape(root,'box',0x353f42,[x,.073,-5.8],[.54,.018,.28]).castShadow=false;
    for(let n=0;n<5;n++)shape(root,'box',0x89918e,[x-.2+n*.1,.085,-5.8],[.025,.008,.22]).castShadow=false;
  }
  // Service cables above the shop block, never in the player's movement volume.
  for(const z of [-6.2,-6.45]) {
    for(let i=0;i<8;i++) {
      const x=-8.75+i*2.5, sag=Math.sin((i/7)*Math.PI)*.28;
      shape(root,'box',0x3b4548,[x,5.45-sag,z],[2.52,.017,.017]);
    }
  }
}
