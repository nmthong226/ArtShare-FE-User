import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Button, TextField } from "@mui/material";

type Subject = {
  label: string;
  description?: string;
  examples?: string[];
};

const allSubjects: Subject[] = [
  {
    "label": "Abstract",
    "description": "Artwork that does not attempt to represent a visual reality but focuses on shapes, colors, and forms.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/155/thumb/paulina-brzozowska-3d-rzezba-6-jpg-3.jpg?1587389656",
      "https://cdna.artstation.com/p/categories/example_images/000/000/156/thumb/lea-rocton-test-xgen.jpg?1587389660",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/157/thumb/tomas-muir-8x.jpg?1587389666",
      "https://cdna.artstation.com/p/categories/example_images/000/000/160/thumb/zhang-chenxi-01-1400.jpg?1587390611"
    ]
  },
  {
    "label": "Anatomy",
    "description": "Anatomical studies of humans and animals.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/142/thumb/maria-panfilova-g-off-muscles2.jpg?1587387331",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/143/thumb/anatomy-for-sculptors-49947434-599866003777729-9035303016760082432-n.jpg?1587387473",
      "https://cdna.artstation.com/p/categories/example_images/000/000/144/thumb/carl-gonzalez-frontoptim.jpg?1587387527",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/145/thumb/anatomy-for-sculptors-rokas-muskuli-01.jpg?1587387531"
    ]
  },
  {
    "label": "Animals & Wildlife",
    "description": "Artwork where the focus is on animals and wildlife, paleoart, zoology, and insects. \n\nEmphasis is on real animals (dinosaurs were once real too). Imaginary creatures should go in “Creatures &amp; Monsters”. \n",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/147/thumb/sam-nassour-catonafence.jpg?1587387961",
      "https://cdna.artstation.com/p/categories/example_images/000/000/148/thumb/ruslan-suleimanov-hyena-7.jpg?1587387965",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/149/thumb/damien-guimoneau-third3.jpg?1587387971",
      "https://cdna.artstation.com/p/categories/example_images/000/000/150/thumb/kurt-papstein-12819359-10153491427194352-2094886883490220099-o-2.jpg?1587388048"
    ]
  },
  {
    "label": "Anime & Manga",
    "description": "Anime and manga styled artworks and productions.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/151/thumb/pierre-marie-albert-goku-vs-nappa-04.jpg?1587388334",
      "https://cdna.artstation.com/p/categories/example_images/000/000/152/thumb/maciej-kuciara-sideview-010.jpg?1587388339",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/153/thumb/ross-tran-zero-two-web.jpg?1587388344",
      "https://cdna.artstation.com/p/categories/example_images/000/000/154/thumb/lorenzo-lanfranconi-a-secret-meeting-a.jpg?1587388405"
    ]
  },
  {
    "label": "Architectural Concepts",
    "description": "Conceptual artwork that explores structures, buildings, and architectural environments.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/018/thumb/darryl-he-mosque-final.jpg?1586450448",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/019/thumb/-15.jpg?1586450456",
      "https://cdna.artstation.com/p/categories/example_images/000/000/020/thumb/jonathan-blessin-house2.jpg?1586450464",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/021/thumb/yurt-taslama-shot-1-v004.jpg?1586450473"
    ]
  },
  {
    "label": "Architectural Visualization",
    "description": "3D visualizations of architectural projects typically focused on photo-realism used to visualize and market construction projects.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/009/thumb/anas-asghar-indoor-wood-post.jpg?1586448595",
      "https://cdna.artstation.com/p/categories/example_images/000/000/010/thumb/anja-groeger-links.jpg?1586448601",
      "https://cdna.artstation.com/p/categories/example_images/000/000/012/thumb/redgoingblue-visuals-rgb-metroid-happy-plaza-final-lowfix.jpg?1586448672",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/013/thumb/nita-stefan-6.jpg?1586448715"
    ]
  },
  {
    "label": "Automotive",
    "description": "Artwork related to the design, development, rendering, or simulation of automotive vehicles.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/301/thumb/desmond-walsh-inside-09.jpg?1600873988",
      "https://cdna.artstation.com/p/categories/example_images/000/000/302/thumb/giacomo-geroldi-visuals-ford-gt-31.jpg?1600873992",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/303/thumb/khyzyl-saleem-counterzo-edit-web.jpg?1600873998",
      "https://cdna.artstation.com/p/categories/example_images/000/000/304/thumb/sungwoo-lee-screenshot00006.jpg?1600874001"
    ]
  },
  {
    "label": "Board & Card Game Art",
    "description": "Art and design work specific to card or board games. Includes cover art, figurines, etc.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/170/thumb/damien-mammoliti-dungeon-crusade-bravely-the-knight.jpg?1587417339",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/171/thumb/filipe-pagliuso-final-sif406.jpg?1587417342",
      "https://cdna.artstation.com/p/categories/example_images/000/000/172/thumb/jerry-mascho-card-back-master.jpg?1587417347",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/173/thumb/gustavo-zampieri-41622019-266110074012175-4327493903671361536-o.jpg?1587417363"
    ]
  },
  {
    "label": "Book Illustration",
    "description": "Illustrative artwork intended to be published in books. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/180/thumb/sophie-li-screen-shot-2018-11-11-at-1-52-11-am.jpg?1587418229",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/181/thumb/jean-baptiste-monge-little-weasel.jpg?1587418246",
      "https://cdna.artstation.com/p/categories/example_images/000/000/182/thumb/elena-bespalova-kari01.jpg?1587418265",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/183/thumb/marco-bucci-1.jpg?1587418348"
    ]
  },
  {
    "label": "Character Animation",
    "description": "Artwork specialized in the area of bringing a character to life through animation.  It should include a video of the character's movement or expressions. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/207/thumb/abdelwahab-essam-sdf.jpg?1587671427",
      "https://cdna.artstation.com/p/categories/example_images/000/000/208/thumb/frankie-derosa-odyssey-screen-011.jpg?1587671464",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/211/thumb/Screen%20Shot%202020-04-23%20at%203.54.41%20PM.png?1587671703",
      "https://cdna.artstation.com/p/categories/example_images/000/000/212/thumb/Screen%20Shot%202020-04-23%20at%203.52.49%20PM.png?1587671736"
    ]
  },
  {
    "label": "Character Design",
    "description": "Concept art and visual development focused on original character design. \n<p><br>\nIf your project is a sculpt of a likeness or concept by another artist, please categorize it in Character Modeling.</p>",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/194/thumb/jason-nguyen-villiansknightfinal-jasonnguyen.jpg?1587663685",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/195/thumb/alessandro-pizzi-lineup.jpg?1587663689",
      "https://cdna.artstation.com/p/categories/example_images/000/000/196/thumb/mauro-belfiore-cybalt.jpg?1587663693",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/197/thumb/samuel-youn-image.jpg?1587663696"
    ]
  },
  {
    "label": "Character Modeling",
    "description": "Artwork with a focus on the modeling and sculpting of characters.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/198/thumb/raf-grassetti-kr.jpg?1587663852",
      "https://cdna.artstation.com/p/categories/example_images/000/000/200/thumb/katie-humes-render01.jpg?1587664001",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/201/thumb/marat-latypov-rey-beautyshot.jpg?1587664052",
      "https://cdna.artstation.com/p/categories/example_images/000/000/202/thumb/nils-wadensten-close-2.jpg?1587664188"
    ]
  },
  {
    "label": "Children's Art",
    "description": "Artwork meant for media to be consumed by children including children’s books, animation, games, and apps.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/026/thumb/lynn-chen-asset.jpg?1586451269",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/027/thumb/puffy-puffpuff-momushi-pink-2-00000.jpg?1586451274",
      "https://cdna.artstation.com/p/categories/example_images/000/000/028/thumb/jean-baptiste-monge-jean-baptiste-monge-home-sweet-home.jpg?1586451284",
      "https://cdna.artstation.com/p/categories/example_images/000/000/030/thumb/Screen%20Shot%202020-04-09%20at%2012.56.23%20PM.png?1586451397"
    ]
  },
  {
    "label": "Comic Art",
    "description": "Artwork styled or relating to comics and graphic novels.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/001/thumb/bruno-furlani-spider-man-vs-green-goblin.jpg?1586446816",
      "https://cdna.artstation.com/p/categories/example_images/000/000/002/thumb/kael-ngu-02.jpg?1586446872",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/003/thumb/hicham-habchi-moi2.jpg?1586447113",
      "https://cdna.artstation.com/p/categories/example_images/000/000/004/thumb/michael-broussard-vhd-artstation2.jpg?1586447251"
    ]
  },
  {
    "label": "Concept Art",
    "description": "Artwork used to convey explorations of ideas, (usually for film, games, or other media) before the final product is rendered. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/005/thumb/bastien-grivet-spiderman-itsv-artwork-p1wardenlight-03.jpg?1586448005",
      "https://cdna.artstation.com/p/categories/example_images/000/000/006/thumb/bryan-sola-main-character-design.jpg?1586448013",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/007/thumb/pablo-carpio-xmendarkphoenix.jpg?1586448026",
      "https://cdna.artstation.com/p/categories/example_images/000/000/008/thumb/sylvain-sarrailh-mariolostworld1.jpg?1586448127"
    ]
  },
  {
    "label": "Cover Art",
    "description": "Artworks created specifically for the covers of products such as books, albums, games, magazines, movies, box art, etc. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/261/thumb/bayard-wu-21.jpg?1587683700",
      "https://cdna.artstation.com/p/categories/example_images/000/000/262/thumb/hicham-habchi-spawn275-cvr.jpg?1587683704",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/263/thumb/wojtek-fus-swbfii-key-art-pqbq.jpg?1587683712",
      "https://cdna.artstation.com/p/categories/example_images/000/000/264/thumb/kory-hubbell-brutality-boxart-final-web.jpg?1587683722"
    ]
  },
  {
    "label": "Creatures",
    "description": "Artwork depicting imaginary creatures or monsters. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/031/thumb/juho-laitila-redraw-7-4-2020.jpg?1586451697",
      "https://cdna.artstation.com/p/categories/example_images/000/000/032/thumb/sam-rowan-alien-bug-a-frame1-v002-copy.jpg?1586451704",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/033/thumb/justin-gerard-justin-gerard-motm052-goo-72web.jpg?1586451733",
      "https://cdna.artstation.com/p/categories/example_images/000/000/034/thumb/nils-hamm-troll-night-s.jpg?1586451809"
    ]
  },
  {
    "label": "Editorial Illustration",
    "description": "Artworks created to accompany written text such as magazine articles, newspapers, and online publications. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/265/thumb/michal-dziekan-18-wo-industry.jpg?1587683891",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/267/thumb/tomas-muller-02.jpg?1587684118",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/269/thumb/aleksey-baydakov-art4.jpg?1587684247",
      "https://cdna.artstation.com/p/categories/example_images/000/000/296/thumb/gaelle-seguillon-natgeo-leaflet-web.jpg?1587688064"
    ]
  },
  {
    "label": "Environmental Concept Art & Design",
    "description": "Artwork with a focus on the design or illustration of an environment. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/035/thumb/anna-kharlamova-fantasy-interior9.jpg?1586452189",
      "https://cdna.artstation.com/p/categories/example_images/000/000/036/thumb/eugene-korolev-day-2-pondis.jpg?1586452197",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/037/thumb/adam-williamson-winterfell-shot-1.jpg?1586452205",
      "https://cdna.artstation.com/p/categories/example_images/000/000/038/thumb/pixel-cat-2020-02-20-3-2.jpg?1586452211"
    ]
  },
  {
    "label": "Fan Art",
    "description": "Artworks based on existing properties. Remember to credit the copyright owner in your description and do not include their company or franchise logos on your artwork.\n\n",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/175/thumb/lois-van-baarle-ariel.jpg?1587417724",
      "https://cdna.artstation.com/p/categories/example_images/000/000/176/thumb/toni-infante-ocarina.jpg?1587417730",
      "https://cdna.artstation.com/p/categories/example_images/000/000/178/thumb/ozani-ferreira-venom-rd0003-ozani-ferreira.jpg?1587417810",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/179/thumb/borislav-mitkov-batman.jpg?1587417862"
    ]
  },
  {
    "label": "Fantasy",
    "description": "Artwork based on mythological, supernatural or magical themes often set in the past and/or in a far off unknown place. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/039/thumb/grzegorz-rutkowski-wizard-overlord-final-4-1920.jpg?1586452955",
      "https://cdna.artstation.com/p/categories/example_images/000/000/040/thumb/fanny-vergne-fannyvergne-03.jpg?1586452960",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/041/thumb/mike-mishkin-mmishkin-molten-br-ffinal.jpg?1586453061",
      "https://cdna.artstation.com/p/categories/example_images/000/000/042/thumb/daniel-wearing-fantasy-forest-props.jpg?1586453227"
    ]
  },
  {
    "label": "Fashion & Costume Design",
    "description": "Artwork focused on the clothing, armor, and appearance of characters. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/188/thumb/marianna-yakimova-1.jpg?1587419655",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/189/thumb/ian-joyner-am-001.jpg?1587419683",
      "https://cdna.artstation.com/p/categories/example_images/000/000/192/thumb/ryan-meinerding-46.jpg?1587419832",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/193/thumb/max-schulz-zusammenstellung-small.jpg?1587420063"
    ]
  },
  {
    "label": "Game Art",
    "description": "Artwork created for games including splash illustrations, game concept art, and game production art. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/048/thumb/mike-deas-mikedeas-merc-props2.jpg?1586551960",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/043/thumb/andrew-averkin-league-of-legends-07.jpg?1586458390",
      "https://cdna.artstation.com/p/categories/example_images/000/000/044/thumb/fanny-vergne-soulengine.jpg?1586458410",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/045/thumb/raf-grassetti-kratosingame-01.jpg?1586458434"
    ]
  },
  {
    "label": "Gameplay & Level Design",
    "description": "Projects focused on game interaction and level design for games, covering 2D and 3D artwork. This field showcases the design of player interaction rather than aesthetics.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/244/thumb/victoria-zavhorodnia-corepunk-alpha-6.jpg?1587681823",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/245/thumb/Screen%20Shot%202020-04-23%20at%206.42.11%20PM.png?1587681830",
      "https://cdna.artstation.com/p/categories/example_images/000/000/246/thumb/matthew-wood-sidewinder-butte01.jpg?1587681948",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/247/thumb/minjeong-kim-3.jpg?1587681953"
    ]
  },
  {
    "label": "Games and Real-Time 3D Environment Art",
    "description": "Projects focused on the creation of real-time 3D environment art, predominantly for games. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/248/thumb/otto-ostera-otto-ostera-age-of-kings-08.jpg?1587682169",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/249/thumb/cherlin-mao-finalllllllwow66666.jpg?1587682196",
      "https://cdna.artstation.com/p/categories/example_images/000/000/250/thumb/ATL_Environment06.jpg?1587682478",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/251/thumb/final_e04.jpg?1587682588"
    ]
  },
  {
    "label": "Graphic Design",
    "description": "Graphic design projects including logos, icon designs, fonts, decals, and graphical elements.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/298/thumb/dima-goryainov-faction-rally.jpg?1588773102",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/297/thumb/dima-goryainov-destiny-forsaken-25-2.jpg?1588773096",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/299/thumb/jonas-ronnegard-artstation001.jpg?1588773105",
      "https://cdna.artstation.com/p/categories/example_images/000/000/300/thumb/colin-geller-colin-geller-props-posters-collection2.jpg?1588773109"
    ]
  },
  {
    "label": "Hard Surface",
    "description": "Projects with a focus on hard surface design &amp; modeling.\n",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/257/thumb/munkhjin-otgonbayar-029.jpg?1587683100",
      "https://cdna.artstation.com/p/categories/example_images/000/000/258/thumb/laurent-wauquier-4.jpg?1587683163",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/259/thumb/vitaly-bulgarov-100alphas-release-pic-02.jpg?1587683172",
      "https://cdna.artstation.com/p/categories/example_images/000/000/260/thumb/andrew.png?1587683326"
    ]
  },
  {
    "label": "Horror",
    "description": "Artwork and productions in the horror genre, intending to frighten, scare, disgust, and startle viewers.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/252/thumb/logan-preshaw-daytime-horror-1-2048.jpg?1587682813",
      "https://cdna.artstation.com/p/categories/example_images/000/000/254/thumb/jason-chan-pyke-illustration-web-large.jpg?1587682826",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/255/thumb/jodie-muir-smalls-webby.jpg?1587682866",
      "https://cdna.artstation.com/p/categories/example_images/000/000/256/thumb/yuri-hill-mars102-6.jpg?1587682938"
    ]
  },
  {
    "label": "Illustration",
    "description": "Artwork that is designed to be published and created as an interpretation, decoration or visual representation of a text or concept. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/124/thumb/iain-mccaig-alice-resized.jpg?1586718971",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/125/thumb/lynn-chen-asset.jpg?1586719034",
      "https://cdna.artstation.com/p/categories/example_images/000/000/132/thumb/jennifer-wuestling-tdsenna-final1600.jpg?1586719428",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/133/thumb/lorenzo-lanfranconi-6.jpg?1586719472"
    ]
  },
  {
    "label": "Industrial & Product Design",
    "description": "Designs for physical products meant to be industrially manufactured. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/138/thumb/alberto-petronio-pininfarina-e-voluzione.jpg?1586720266",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/139/thumb/robert-laszlo-kiss-atila-asztal-design.jpg?1586720277",
      "https://cdna.artstation.com/p/categories/example_images/000/000/140/thumb/jason-song-05.jpg?1586720372",
      "https://cdna.artstation.com/p/categories/example_images/000/000/174/thumb/djordje-jovanovic-001.jpg?1587417525"
    ]
  },
  {
    "label": "Lighting",
    "description": "Artwork that showcases and models the behavior of light.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/184/thumb/jama-jurabaev-cinematic-interiors-1.jpg?1587418798",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/185/thumb/harley-wilson-lightstudies-bankoffice-b.jpg?1587418815",
      "https://cdna.artstation.com/p/categories/example_images/000/000/186/thumb/jakub-kazmierczak-horizontal.jpg?1587418845",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/187/thumb/enver.png?1587419057"
    ]
  },
  {
    "label": "Matte Painting",
    "description": "Painted representations of a landscape, set, or distant location used to create the illusion of an environment.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/106/thumb/alexander-dudar-shot-1-symmetry-1.jpg?1586716863",
      "https://cdna.artstation.com/p/categories/example_images/000/000/108/thumb/david-edwards-kenden-001.jpg?1586716873",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/109/thumb/steven-cormann-3suns.jpg?1586716883",
      "https://cdna.artstation.com/p/categories/example_images/000/000/110/thumb/nick-hiatt-201-40-11-hr.jpg?1586716892"
    ]
  },
  {
    "label": "Mecha",
    "description": "Artwork with a focus on the design, illustration or rendering of robots or machines (mechs). ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/067/thumb/ben-erdt-comp-1.jpg?1586554757",
      "https://cdna.artstation.com/p/categories/example_images/000/000/068/thumb/brian-sum-builder-bot.jpg?1586554765",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/069/thumb/paul-braddock-dsc06334-cc.jpg?1586554771",
      "https://cdna.artstation.com/p/categories/example_images/000/000/070/thumb/jakub-rozalski-der-werwolf-1920-ihs.jpg?1586554777"
    ]
  },
  {
    "label": "Mechanical Design",
    "description": "Concept designs that showcase systems, parts, or components of mechanical nature.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/280/thumb/captoon-lee-insu-main-arm.jpg?1587685904",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/281/thumb/alex-senechal-white-articulated.jpg?1587685930",
      "https://cdna.artstation.com/p/categories/example_images/000/000/282/thumb/lee-souder-vray-left-top-color-01.jpg?1587685972",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/283/thumb/cyril-lavanant-leg-final-0001.jpg?1587686005"
    ]
  },
  {
    "label": "Motion Graphics",
    "description": "Artwork with a focus on animated graphics or text.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/134/thumb/fabian-vazquez-storyboard.jpg?1586719728",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/135/thumb/mike-howie-planetsidearena-logo-concepts-colour.jpg?1586719740",
      "https://cdna.artstation.com/p/categories/example_images/000/000/136/thumb/daniel-lugo-azuluz-3.jpg?1586719763",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/137/thumb/Screen%20Shot%202020-04-12%20at%203.30.39%20PM.png?1586719850"
    ]
  },
  {
    "label": "Photogrammetry & 3D Scanning",
    "description": "Projects that involve 3D scanning or software that uses photographs to map and reconstruct the shape of an object. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/276/thumb/daniel-thiger-woodbark-a-render-scene-a.jpg?1587685329",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/277/thumb/james-busby-torso-colour.jpg?1587685332",
      "https://cdna.artstation.com/p/categories/example_images/000/000/278/thumb/edd-mcdermott-screenshot062.jpg?1587685342",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/279/thumb/james-busby-mw60-00.jpg?1587685405"
    ]
  },
  {
    "label": "Pixel and Voxel Art",
    "description": "Artwork with a low-res or retro look, including but not limited to pixel art using 8 or 16-bit color palettes, modern pixel sprites, and voxel art.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/203/thumb/john-kearney-cityscape-poster-artstation-update.jpg?1587665007",
      "https://cdna.artstation.com/p/categories/example_images/000/000/204/thumb/andrei-mishanin-d1.jpg?1587665251",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/205/thumb/victor-calleja-783-timelapse-01.jpg?1587665254",
      "https://cdna.artstation.com/p/categories/example_images/000/000/206/thumb/autumn-rain-turkel-doorway-01.jpg?1587665261"
    ]
  },
  {
    "label": "Portraits",
    "description": "Artistic representations of a character's face or expression. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/240/thumb/toko-suzuki-img-16924-1.jpg?1587681324",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/241/thumb/eldar-zakirov-eldar-zakirov-2014-the-hermitage-court-chamber-herald-cat-2015.jpg?1587681556",
      "https://cdna.artstation.com/p/categories/example_images/000/000/242/thumb/ross-tran-dragon-girl-web.jpg?1587681561",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/243/thumb/ian-spriggs-portrait-of-cassidy-2k.jpg?1587681566"
    ]
  },
  {
    "label": "Props",
    "description": "Artwork that contains an illustration, rendering or design of an object to be used for interaction within a scene.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/111/thumb/miguel-gallardo-shot1.jpg?1586717265",
      "https://cdna.artstation.com/p/categories/example_images/000/000/112/thumb/angelo-hurtado-screenshot026.jpg?1586717281",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/113/thumb/phillip-stoltz-render.jpg?1586717285",
      "https://cdna.artstation.com/p/categories/example_images/000/000/114/thumb/fernando-quinn-barberchair1.jpg?1586717362"
    ]
  },
  {
    "label": "Realism",
    "description": "Artwork that pushes a realistic style and attempts to depict true-to-life proportions, shapes, and forms. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/235/thumb/ian-spriggs-portrait-of-scotteaton-2k.jpg?1587680899",
      "https://cdna.artstation.com/p/categories/example_images/000/000/236/thumb/dongbiao-lu-medieval-castle-complete.jpg?1587681054",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/237/thumb/joe-seabuhr-screenshot002.jpg?1587681060",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/239/thumb/toko-suzuki-p1130641-as-smart-object-1-copy.jpg?1587681294"
    ]
  },
  {
    "label": "Science Fiction",
    "description": "Genre depicting imagined future and scientific or technological advances often portraying space, time travel and alien life.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/101/thumb/nivanh-chanthara-test-252.jpg?1586716471",
      "https://cdna.artstation.com/p/categories/example_images/000/000/102/thumb/wiktor-ohman-1.jpg?1586716475",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/103/thumb/sean-tay-samusmsol.jpg?1586716487",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/105/thumb/daniel-mckay-scifi-corridor-still-05.jpg?1586716559"
    ]
  },
  {
    "label": "Scientific Illustration & Visualization",
    "description": "Artwork that visually communicates information of a scientific nature. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/270/thumb/gabriel-ugueto-hadrosauridaeplate2.jpg?1587684640",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/273/thumb/olena-shmahalo-broken-glass-dna-2880x1620.jpg?1587684835",
      "https://cdna.artstation.com/p/categories/example_images/000/000/274/thumb/samuele-f-zanchi-highresscreenshot00035.jpg?1587684848",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/275/thumb/antoine-collignon-2.jpg?1587684862"
    ]
  },
  {
    "label": "Scripts & Tools",
    "description": "Showcasing software tools focused on enhancing art workflows. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/284/thumb/Screen%20Shot%202020-04-23%20at%208.02.40%20PM.png?1587686572",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/285/thumb/Screen%20Shot%202020-04-23%20at%208.02.03%20PM.png?1587686577",
      "https://cdna.artstation.com/p/categories/example_images/000/000/286/thumb/tor-frick-kitbash02.jpg?1587686588",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/287/thumb/Screen%20Shot%202020-04-23%20at%208.01.36%20PM.png?1587686595"
    ]
  },
  {
    "label": "Sketches",
    "description": "Rough or unfinished artwork that captures and explores ideas.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/161/thumb/dela-longfish-troll-01.jpg?1587415208",
      "https://cdna.artstation.com/p/categories/example_images/000/000/162/thumb/paperblue-net-sketch-ca-a.jpg?1587415212",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/163/thumb/mauro-belfiore-moleskine5032018.jpg?1587415221",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/165/thumb/tb-choi-33237641-1323974567737365-6023962675141148672-o.jpg?1587416354"
    ]
  },
  {
    "label": "Still Life",
    "description": "Scenes depicting natural or man-made inanimate objects.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/097/thumb/guilherme-henrique-grapes-cropped.jpg?1586715955",
      "https://cdna.artstation.com/p/categories/example_images/000/000/098/thumb/lekso-tiger-3.jpg?1586715989",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/099/thumb/dennis-iversholt-morningcoffee-1920.jpg?1586716154",
      "https://cdna.artstation.com/p/categories/example_images/000/000/100/thumb/thorsten-denk-vanitas.jpg?1586716159"
    ]
  },
  {
    "label": "Storyboards",
    "description": "A sequence of drawings representing the shots planned for a production.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/062/thumb/olga-andriyenko-icecream-allpanels-3.jpg?1586554303",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/063/thumb/matt-rhodes-storyboard-coronation.jpg?1586554308",
      "https://cdna.artstation.com/p/categories/example_images/000/000/064/thumb/saby-menyhei-vo-storyboard-01-smenyhei-resize.jpg?1586554314",
      "https://cdna.artstation.com/p/categories/example_images/000/000/066/thumb/dan-milligan-boards02.jpg?1586554328"
    ]
  },
  {
    "label": "Stylized",
    "description": "Artwork that pushes a stylized look, often with unrealistic proportions and shapes. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/230/thumb/john-teodoro-secondshot.jpg?1587680258",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/231/thumb/julio-nicoletti-daggers2.jpg?1587680273",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/233/thumb/serge-birault-37716486-10204603390000326-2671506878298587136-n.jpg?1587680391",
      "https://cdna.artstation.com/p/categories/example_images/000/000/234/thumb/lip-comarella-vp-crop.jpg?1587680472"
    ]
  },
  {
    "label": "Technical Art",
    "description": "Projects with a focus on showcasing the technical aspect of creating production art. Includes rigging, skinning, simulations, shading, effects, and other technical art topics.",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/215/thumb/Screen%20Shot%202020-04-23%20at%204.07.57%20PM%20copy.png?1587672530",
      "https://cdna.artstation.com/p/categories/example_images/000/000/216/thumb/artur-tarnowski-girl-prev-131-hair.jpg?1587672643",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/217/thumb/matt-ziegeler-wireframe.jpg?1587672745",
      "https://cdna.artstation.com/p/categories/example_images/000/000/218/thumb/Screen%20Shot%202020-04-23%20at%204.03.44%20PM.png?1587672758"
    ]
  },
  {
    "label": "Textures & Materials",
    "description": "Texture and materials to be applied to a 3D object, environment or character. This covers both real-time and offline rendered materials.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/088/thumb/daniel-thiger-spagetthi-sphere-b.jpg?1586715311",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/089/thumb/jonathan-benainous-render-02.jpg?1586715318",
      "https://cdna.artstation.com/p/categories/example_images/000/000/090/thumb/jarrod-hasenjager-shaderdev-gold-studio-v03.jpg?1586715320",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/091/thumb/eric-wiley-ballrender01.jpg?1586715325"
    ]
  },
  {
    "label": "Toys & Collectibles",
    "description": "Objects artistically fabricated to be physical toys or collectibles. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/219/thumb/eduardo-silva-comp-2.jpg?1587673165",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/223/thumb/shane-olson-avg-antman-altpose.jpg?1587673402",
      "https://cdna.artstation.com/p/categories/example_images/000/000/224/thumb/thomas-lishman-ban-as.jpg?1587673545",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/225/thumb/pascal-blanche-img-0029-friday-nov-29th-2019-3pm-et-reveal-all-x-media-platforms-edited.jpg?1587673550"
    ]
  },
  {
    "label": "Tutorials",
    "description": "Projects that include images or videos that demonstrate a process, intended for education. ",
    "examples": [
      "https://cdnb.artstation.com/p/categories/example_images/000/000/071/thumb/daniel-thiger-product-card-fund01.jpg?1586555210",
      "https://cdna.artstation.com/p/categories/example_images/000/000/072/thumb/arthur-gimaldinov-screen-shot-2017-11-27-at-16-12-21.jpg?1586555214",
      "https://cdna.artstation.com/p/categories/example_images/000/000/074/thumb/-1.jpg?1586555295",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/075/thumb/valentina-remenar-how-to-male-torso-anatomy-by-valentina-remenar.jpg?1586555339"
    ]
  },
  {
    "label": "User Interface (UI) Art",
    "description": "Projects focusing on the art of user interfaces such as game UI and in-game/movie UI screens.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/084/thumb/davison-carvalho-seer-device-01-2560px-v2.jpg?1586714335",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/085/thumb/istvan-danyi-my-character-page-2000.jpg?1586714343",
      "https://cdna.artstation.com/p/categories/example_images/000/000/086/thumb/oleg-bercea-36682151-2073794845967044-1172185678469922816-n.jpg?1586714347",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/087/thumb/mariusz-becker-251115-no2.jpg?1586714405"
    ]
  },
  {
    "label": "Vehicles",
    "description": "Representations of vehicles used for transportation, real or imagined.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/080/thumb/khyzyl-saleem-cybertrucksee2.jpg?1586714027",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/081/thumb/paul-pepera-thumper-cockpit-f.jpg?1586714040",
      "https://cdna.artstation.com/p/categories/example_images/000/000/082/thumb/jake-woodruff-flyingtug-01.jpg?1586714045",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/083/thumb/kael-ngu-01.jpg?1586714125"
    ]
  },
  {
    "label": "VFX for Film, TV & Animation",
    "description": "Rendered visual effects for film &amp; television, animation, and cinematics for both live-action and animation. Includes set extensions, simulations, explosions, crowds, etc. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/292/thumb/cosmin-hrincu-guardiansgalaxy-cgfloor-a01.jpg?1587687772",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/293/thumb/gaelle-seguillon-gaelle-seguillon-amasiaearthreborn.jpg?1587687777",
      "https://cdna.artstation.com/p/categories/example_images/000/000/294/thumb/paul-h-paulino-49896972-2310412318993119-220238286487027712-o.jpg?1587687805",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/295/thumb/gerard-pasqual-shot-gerard.jpg?1587688010"
    ]
  },
  {
    "label": "VFX for Real-Time & Games",
    "description": "Real-time and in-game visual effects. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/288/thumb/Screen%20Shot%202020-04-23%20at%208.13.36%20PM.png?1587687280",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/289/thumb/Screen%20Shot%202020-04-23%20at%208.15.41%20PM.png?1587687372",
      "https://cdna.artstation.com/p/categories/example_images/000/000/290/thumb/kevin-leroy-screenshot-876.jpg?1587687383",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/291/thumb/Screen%20Shot%202020-04-23%20at%208.15.31%20PM.png?1587687391"
    ]
  },
  {
    "label": "Virtual and Augmented Reality",
    "description": "Projects or assets created for virtual or augmented experiences. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/076/thumb/mark-van-haitsma-hands-final-back.jpg?1586713483",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/077/thumb/pat-goodwin-rear-02.jpg?1586713486",
      "https://cdna.artstation.com/p/categories/example_images/000/000/078/thumb/jody-sargent-glimpseshot2.jpg?1586713595",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/079/thumb/cho-yonghee-panorama-mecha-on-grid.jpg?1586713707"
    ]
  },
  {
    "label": "Visual Development",
    "description": "Creative work used to develop visuals in animation, typically for movies, TV shows, and cinematics. ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/226/thumb/cory-loftis-waterfall2.jpg?1587677217",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/227/thumb/lip-comarella-bildschirmfoto-2016-03-10-um-17-46-25.jpg?1587677223",
      "https://cdna.artstation.com/p/categories/example_images/000/000/228/thumb/ryan-lang-tefiti-006.jpg?1587677227",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/229/thumb/jason-scheier-0bmigos-neighborhood-early-concept.jpg?1587677234"
    ]
  },
  {
    "label": "Weapons",
    "description": "Artwork with a focus on the design, illustration or rendering of an object that is meant to cause injury or damage.",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/054/thumb/betty-jiang-dagger.jpg?1586553227",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/055/thumb/vitaly-ishkov-back-front.jpg?1586553231",
      "https://cdna.artstation.com/p/categories/example_images/000/000/056/thumb/denis-g-screenshot012.jpg?1586553235",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/057/thumb/julio-nicoletti-daggers4.jpg?1586553241"
    ]
  },
  {
    "label": "Web and App Design",
    "description": "Designs for web and apps, with a focus on the UI art direction.  ",
    "examples": [
      "https://cdna.artstation.com/p/categories/example_images/000/000/166/thumb/ravneet-kaur-final.jpg?1587416854",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/167/thumb/dmytro-hryshyn-metin2-fusion-demo.jpg?1587416867",
      "https://cdna.artstation.com/p/categories/example_images/000/000/168/thumb/rosie-phillips-interior-wood.jpg?1587416918",
      "https://cdnb.artstation.com/p/categories/example_images/000/000/169/thumb/harish-khatarkar-login03.jpg?1587416952"
    ]
  }
];

export default function SubjectSelector() {
  const [selected, setSelected] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<Subject>(allSubjects[0]);

  const toggleSubject = (subject: Subject) => {
    const exists = selected.some((s) => s.label === subject.label);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.label !== subject.label));
      setSearch("");
    } else {
      if (selected.length < 3) {
        setSelected((prev) => [...prev, subject]);
        setSearch("");
      }
    }
  };

  const isSelected = (subject: Subject) =>
    selected.some((s) => s.label === subject.label);

  const remainingSlots = 3 - selected.length;

  return (
    <div className="dark:bg-mountain-900 font-sans text-black dark:text-white">
      <p className="mb-1 text-gray-800 dark:text-mountain-200 text-base">
        How would you categorize this work? (Choose up to 3)
      </p>
      {/* Top Selection Bar */}
      <div
        className={`flex items-center gap-2 flex-wrap dark:bg-mountain-900 min-h-[52px] bg-gray-100 text-left mb-6 transition-colors duration-200 ${
          selected.length > 0 ? "px-2 py-0.5" : ""
        }`}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#e7e7e7"; // mountain-100 hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#9ca3af"; // revert to default
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#a5b4fc"; // primary.main
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#9ca3af";
        }}
        tabIndex={-1}
      >
        {selected.map((subject) => (
          <div
            key={subject.label}
            className="flex items-center gap-2 bg-gray-200 dark:bg-mountain-1000 px-2 py-1 rounded h-full text-sm"
          >
            <span>{subject.label}</span>
            <Button
              onClick={() => toggleSubject(subject)}
              variant="text"
              className="ml-1 !min-w-0"
              component="label"
              size="small"
              sx={{
                backgroundColor: "transparent",
                color: "inherit",
                padding: "0px",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <CloseIcon fontSize="small" className="text-inherit" />
            </Button>
          </div>
        ))}
        <TextField
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Choose art type"}
          className=""
          sx={{
            flex: 1,
            backgroundColor: "transparent",
            ".MuiOutlinedInput-notchedOutline": {
              border: "2px solid",
              borderColor: "#9ca3af", // mountain-400 default
              borderRadius: "6px",
            },
          }}
        />
      </div>

      {/* Main layout */}
      <div className="flex gap-2">
        {/* Left column */}
        <div className="flex flex-col pr-4 border-gray-300 dark:border-gray-700 w-1/2 h-72">
          <p className="mb-3 py-1.5 text-gray-700 dark:text-gray-400 text-sm">
            CHOOSE ANOTHER {remainingSlots} ART TYPE
            {remainingSlots !== 1 ? "S" : ""}
          </p>
          <ul className="flex-1 space-y-2 pr-1 overflow-y-auto custom-scroll">
            {allSubjects.map((subject) => {
              if (
                search &&
                !subject.label.toLowerCase().includes(search.toLowerCase())
              )
                return null;
              const selectedStatus = isSelected(subject);
              return (
                <li
                  key={subject.label}
                  className="flex justify-between items-center gap-2 hover:bg-gray-100 dark:hover:bg-mountain-800 px-2 py-2 rounded text-sm transition cursor-pointer"
                  onMouseEnter={() => setHovered(subject)}
                >
                  <span className="max-w-[60%] truncate">{subject.label}</span>
                  <Button
                    onClick={() => toggleSubject(subject)}
                    className={`${selected.length >= 3 && !selectedStatus ? "dark:text-mountain-500 text-gray-400" : "dark:text-white text-black"} flex justify-center items-center gap-1 bg-white hover:bg-gray-100 dark:bg-mountain-950 dark:hover:bg-mountain-900 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded min-w-[110px] text-black  text-sm`}
                    sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                    disabled={!selectedStatus && selected.length >= 3}
                  >
                    {!selectedStatus ? (
                      <>
                        <AddIcon fontSize="small" className="text-indigo-500" />
                        <span className="text-sm">Add</span>
                      </>
                    ) : (
                      <>
                        <CloseIcon fontSize="small" className="text-red-400" />
                        <span className="text-sm">Remove</span>
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right preview panel */}
        <div className="flex-1 w-1/2 overflow-hidden">
          <div className="bg-gray-100 dark:bg-mountain-950 p-5 border border-indigo-300 rounded-lg h-full">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold text-xl">{hovered.label}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {hovered.description}
                </p>
              </div>
            </div>
            {hovered.examples && (
              <>
                <p className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                  Examples
                </p>
                <div className="flex gap-3 overflow-x-auto">
                  {hovered.examples.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Example ${idx}`}
                      className="rounded w-40 h-40 object-cover"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
