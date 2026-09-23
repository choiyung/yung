window.FRAME_PRESETS = {
  fullscreen:{bleed:true,desktopWidth:"100vw",desktopMaxHeight:"100dvh",mobileHeight:"64dvh",mobileMaxWidth:"100vw",mobileRatio:"1 / 1",mobileFit:"crop"},
  portrait:{desktopWidth:"40vw",desktopMaxHeight:"87dvh",mobileHeight:"70dvh",mobileMaxWidth:"88vw"},
  portraitLarge:{desktopWidth:"48vw",desktopMaxHeight:"84dvh",mobileHeight:"72dvh",mobileMaxWidth:"92vw"},
  square:{desktopWidth:"43vw",desktopMaxHeight:"80dvh",mobileHeight:"62dvh",mobileMaxWidth:"90vw"},
  wide:{desktopWidth:"52vw",desktopMaxHeight:"83dvh",mobileHeight:"64dvh",mobileMaxWidth:"96vw"}
};

window.ARCHIVE_ENTRIES = [
  {
    id:"hamish-fulton-nepal",
    date:"1977-01-01",
    title:"Hamish Fulton, Nepal",
    description:"Exhibition Catalog / 1977",
    project:"Archive",
    type:"Publication",
    cover:"./스크린샷 2026-09-10 173342.png",
    landing:{show:true,order:1},
    frames:[
      {image:"./스크린샷 2026-09-10 173342.png",alt:"Hamish Fulton, Nepal",frame:"portraitLarge"},
      {image:"./a607d743-2389-4681-a003-0a283ea042ac.jpg",alt:"Spatial Object 04",frame:"wide"}
    ]
  },
  {
    id:"spatial-object-04",
    date:"1982-01-01",
    title:"Spatial Object 04",
    description:"Berlin Archive Series / 1982",
    project:"Archive",
    type:"Object",
    cover:"./a607d743-2389-4681-a003-0a283ea042ac.jpg",
    landing:{show:true,order:2},
    frames:[
      {image:"./a607d743-2389-4681-a003-0a283ea042ac.jpg",alt:"Spatial Object 04",frame:"wide"},
      {image:"./e0dc8bc0-86a5-4ab2-b70d-4a70de870af7123.jpg",alt:"Edition Vercors",frame:"wide"}
    ]
  },
  {
    id:"edition-vercors",
    date:"1991-01-01",
    title:"Edition Vercors",
    description:"Original Print Series / 1991",
    project:"Archive",
    type:"Print",
    cover:"./e0dc8bc0-86a5-4ab2-b70d-4a70de870af7123.jpg",
    landing:{show:true,order:3},
    frames:[
      {image:"./e0dc8bc0-86a5-4ab2-b70d-4a70de870af7123.jpg",alt:"Edition Vercors",frame:"wide"}
    ]
  },
  {
    id:"mountain-walk-series",
    date:"1996-01-01",
    title:"Mountain Walk Series",
    description:"Le Musée de Valence / 1996",
    project:"Archive",
    type:"Exhibition",
    cover:"./f3e58f7e85ba2f17ed524f05d38c850e.jpg",
    landing:{show:false,order:4},
    frames:[
      {image:"./f3e58f7e85ba2f17ed524f05d38c850e.jpg",alt:"Mountain Walk Series",frame:"portraitLarge"}
    ]
  },
  {
    id:"winter-horizon",
    date:"1999-01-01",
    title:"Winter Horizon",
    description:"Nordic Art Foundation / 1999",
    project:"Archive",
    type:"Photography",
    cover:"./639a6bc5427e9555a56979ce2d955074.jpg",
    landing:{show:false,order:5},
    frames:[
      {image:"./639a6bc5427e9555a56979ce2d955074.jpg",alt:"Winter Horizon",frame:"portrait"}
    ]
  }
];
