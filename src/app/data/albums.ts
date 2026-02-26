export interface Photo {
  id: string;
  url: string;
  name: string;
  description?: string;
  location?: string;
  uploadDate: Date;
}

export interface Album {
  id: string;
  title: string;
  displayTitle: string;
  description: string;
  createdAt: Date;
  photos: Photo[];
}

const STORAGE_KEY = 'photoGallery_albums';
const STORAGE_VERSION_KEY = 'photoGallery_version';
const CURRENT_VERSION = '6'; // Increment when data structure changes

export const initialAlbums: Album[] = [
  {
    id: "zms9o7p8t",
    title: "Life.",
    displayTitle: "life.",
    description: "Random things...",
    createdAt: new Date("2026-02-23"),
    photos: [
      {
        id: "r30tmhbnz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947196/photo-gallery/zms9o7p8t/IMG_4667_hoqgbr.jpg",
        name: "IMG_4667",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "3y2ahf15s",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947198/photo-gallery/zms9o7p8t/IMG_4606_zy48yy.jpg",
        name: "IMG_4606",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "mzzlk2klq",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118405/photo-gallery/zms9o7p8t/IMG_4834_p3jsty.jpg",
        name: "IMG_4834",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "cikct0uw8",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947200/photo-gallery/zms9o7p8t/IMG_4563_nejspw.jpg",
        name: "IMG_4563",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "pbzt8e0az",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947201/photo-gallery/zms9o7p8t/IMG_4346_cejh53.jpg",
        name: "IMG_4346",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "0h59hrx5p",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035078/photo-gallery/5r9k8nfz5/red_light_irlaq3.jpg",
        name: "red light",
        uploadDate: new Date("2026-02-25")
      },
      {
        id: "unz308wil",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947203/photo-gallery/zms9o7p8t/IMG_4273_crxszg.jpg",
        name: "IMG_4273",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "t34xt6ob9",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947204/photo-gallery/zms9o7p8t/IMG_3777_jpkoat.jpg",
        name: "IMG_3777",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "lhi0iwnoz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947211/photo-gallery/zms9o7p8t/IMG_1941_na7lom.jpg",
        name: "IMG_1941",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "nzhln0bh5",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947212/photo-gallery/zms9o7p8t/BE8B52C2-EF22-43E8-B8DD-8E289AF62220_ju8qxg.jpg",
        name: "BE8B52C2-EF22-43E8-B8DD-8E289AF62220",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "yr3v6dvvk",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118403/photo-gallery/zms9o7p8t/990FA0ED-2E5B-4BA8-ACFB-A243C444B519_mmiuus.jpg",
        name: "990FA0ED-2E5B-4BA8-ACFB-A243C444B519",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "231q4suux",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118397/photo-gallery/zms9o7p8t/IMG_7661_tnesea.jpg",
        name: "IMG_7661",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "0j5jorub0",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118399/photo-gallery/zms9o7p8t/IMG_7272_f51e6w.jpg",
        name: "IMG_7272",
        uploadDate: new Date("2026-02-26")
      }
    ]
  },
  {
    id: "3",
    title: "Nature Scenes",
    displayTitle: "nature",
    description: "Beautiful landscapes and natural wonders.",
    createdAt: new Date("2024-03-10"),
    photos: [
      {
        id: "wa0ly5x8r",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836623/photo-gallery/3/bysea_zzdmer.jpg",
        name: "bysea",
        description: "Between the sea breeze and their unhurried words, the years no longer feel like distance, but like a long, shared horizon stretching calmly before them.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "x5240opa2",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836604/photo-gallery/3/forest_vbatw4.jpg",
        name: "forest",
        description: "Between the rustling leaves and the patient earth, the sign stands still in the golden light, as if reminding us that guidance is gentle, but the journey is always ours.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "84q34i7q7",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947409/photo-gallery/3/IMG_4745_b4gzfq.jpg",
        name: "IMG_4745",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "jn4dh7n71",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947411/photo-gallery/3/IMG_4719_gwlqyy.jpg",
        name: "IMG_4719",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "r98gdwp37",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947413/photo-gallery/3/IMG_4708_q1ew1m.jpg",
        name: "IMG_4708",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "3ovm25qgm",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947414/photo-gallery/3/IMG_3632_hz5dz1.jpg",
        name: "IMG_3632",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "ws3mncd6b",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947415/photo-gallery/3/8236cf2e1d92c7ba062f9aa0db7b45e1_ckhkuj.jpg",
        name: "8236cf2e1d92c7ba062f9aa0db7b45e1",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "26ck0c6n9",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771808193/photo-gallery/3/P1160703_ahkwfi.jpg",
        name: "P1160703",
        description: "Find the line between roots.",
        location: "Wuhan, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "2fzk14j2t",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118455/photo-gallery/3/E8674085-1987-4F26-AD5F-46EB1E087649_a5odrx.jpg",
        name: "E8674085-1987-4F26-AD5F-46EB1E087649",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "xc2wzdsgy",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118457/photo-gallery/3/283A8EFE-CA1F-48A1-8841-B6F2AD619FE3_kgiaxv.jpg",
        name: "283A8EFE-CA1F-48A1-8841-B6F2AD619FE3",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "5ik7eniya",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118458/photo-gallery/3/IMG_6797_g3qiaa.jpg",
        name: "IMG_6797",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "fqp8phzwd",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118460/photo-gallery/3/IMG_6119_zscn5n.jpg",
        name: "IMG_6119",
        uploadDate: new Date("2026-02-26")
      }
    ]
  },
  {
    id: "5r9k8nfz5",
    title: "Palimpsest",
    displayTitle: "palimpsest",
    description: "Museum or something observed...",
    createdAt: new Date("2026-02-24"),
    photos: [
      {
        id: "lyzyygfiw",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836708/photo-gallery/zms9o7p8t/vangogh_dmjhud.jpg",
        name: "vangogh",
        description: "As they stand before the gaze of Vincent van Gogh, they are not merely looking at a portrait—they are meeting a soul that once burned too brightly for its own time. In the quiet exchange between their eyes and his painted stare, the centuries collapse, and we realize that to be seen by art is sometimes more unsettling than to see it.",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "zj04k33rr",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035245/photo-gallery/5r9k8nfz5/vangogh1_r6vo0m.jpg",
        name: "vangogh1",
        uploadDate: new Date("2026-02-25")
      },
      {
        id: "gubysxwlo",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117996/photo-gallery/5r9k8nfz5/IMG_6988_tuqgsb.jpg",
        name: "IMG_6988",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "f0u5i7zpx",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117993/photo-gallery/5r9k8nfz5/IMG_9353_h8opry.jpg",
        name: "IMG_9353",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "j6bf7kr8y",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836728/photo-gallery/zms9o7p8t/book_and_lake_sotziz.jpg",
        name: "book and lake",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "q1ab7ghhz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836720/photo-gallery/zms9o7p8t/sunflower_omeysp.jpg",
        name: "sunflower",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "47bj7qv5v",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836714/photo-gallery/zms9o7p8t/statue_o4kanj.jpg",
        name: "statue",
        description: "Here, light and horizon conspire to dissolve the boundary between nature and creation, so that walking through art feels like a meditation on the infinite possibilities of seeing and being seen.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "omy0r7qui",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117992/photo-gallery/5r9k8nfz5/IMG_9362_rdcg5n.jpg",
        name: "IMG_9362",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "k5cwwu9qq",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117995/photo-gallery/5r9k8nfz5/IMG_9337_dzsit7.jpg",
        name: "IMG_9337",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "yztppjvb5",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117997/photo-gallery/5r9k8nfz5/IMG_6980_iwh3bq.jpg",
        name: "IMG_6980",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "atkpojmdy",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117998/photo-gallery/5r9k8nfz5/IMG_6929_gsmrjq.jpg",
        name: "IMG_6929",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "3u68dgbgg",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772117999/photo-gallery/5r9k8nfz5/IMG_6404_pxv3nw.jpg",
        name: "IMG_6404",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "rps873c35",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118540/photo-gallery/5r9k8nfz5/IMG_9084_jsj2he.jpg",
        name: "IMG_9084",
        uploadDate: new Date("2026-02-26")
      }
    ]
  },
  {
    id: "1",
    title: "Wildlife",
    displayTitle: "wildlife",
    description: "A curated collection of wildlife moments captured in nature.",
    createdAt: new Date("2024-01-15"),
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Panda Bamboo",
        description: "The Panda in grayscale.",
        location: "Chengdu, China",
        uploadDate: new Date("2024-01-15")
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1574068774810-a5ccb01f9620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        name: "Magical Horse",
        location: "Iceland",
        uploadDate: new Date("2024-01-15")
      },
      {
        id: "p8ll48ix5",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771808159/photo-gallery/1/P1160683_xclraw.jpg",
        name: "P1160683",
        description: "Old Man and the Fish.",
        location: "Wuhan, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "6vh3g3lpu",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771846458/photo-gallery/1/P1160758_bgzpkg.jpg",
        name: "P1160758",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "jqo5c5qln",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771846466/photo-gallery/1/P1160775_spfrti.jpg",
        name: "P1160775",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "6urd11725",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772035252/photo-gallery/1/dear1_upc5qq.jpg",
        name: "dear1",
        uploadDate: new Date("2026-02-25")
      },
      {
        id: "olssxrm4u",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118060/photo-gallery/1/IMG_3975_pqqgbi.jpg",
        name: "IMG_3975",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "nkjnilzcw",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118062/photo-gallery/1/IMG_6117_txnryg.jpg",
        name: "IMG_6117",
        uploadDate: new Date("2026-02-26")
      }
    ]
  },
  {
    id: "vpilj9fcm",
    title: "Stone & Time",
    displayTitle: "stone&time",
    description: "Buildings...",
    createdAt: new Date("2026-02-23"),
    photos: [
      {
        id: "s5fsruwqg",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771851323/photo-gallery/vpilj9fcm/P1160032_nwccci.jpg",
        name: "P1160032",
        location: "Xiamen, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "wm149z8is",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771851345/photo-gallery/vpilj9fcm/P1160253_wu4043.jpg",
        name: "P1160253",
        location: "Xiamen, China",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "95k8tb4m6",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836698/photo-gallery/zms9o7p8t/church_bxliym.jpg",
        name: "church",
        description: "Beneath the towering pipes of Grundtvig's Church, silence feels architectural—as if sound itself were waiting to be born from stone and breath.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "iu6tx46bf",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947535/photo-gallery/vpilj9fcm/IMG_4357_kwqynx.jpg",
        name: "IMG_4357",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "k4rajsayv",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118166/photo-gallery/vpilj9fcm/IMG_4906_laikts.jpg",
        name: "IMG_4906",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "3f3ylo3dc",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836587/photo-gallery/2/copen_sihtxc.jpg",
        name: "copen",
        description: "Along the bright facades of Nyhavn in Copenhagen, the houses stand like painted memories, while laughter and clinking glasses turn the harbor into a living canvas. Between the stillness of color and the warmth of shared meals, the moment feels like a quiet agreement between architecture and appetite—proof that beauty is best tasted slowly.",
        location: "Copenhagen, Denmark",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "qv7bcvso2",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118132/photo-gallery/vpilj9fcm/8338524C-76FE-4ACD-A116-328EF2D62CAA_wdals8.jpg",
        name: "8338524C-76FE-4ACD-A116-328EF2D62CAA",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "mf3umydmc",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118159/photo-gallery/vpilj9fcm/IMG_6795_j2nrjm.jpg",
        name: "IMG_6795",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "5gyax6dxl",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118153/photo-gallery/vpilj9fcm/IMG_7417_uvrpaq.jpg",
        name: "IMG_7417",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "ugzcdhs7m",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118155/photo-gallery/vpilj9fcm/384967A0-412B-4842-B097-A80550832566_ppbcwg.jpg",
        name: "384967A0-412B-4842-B097-A80550832566",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "7j4elrq2l",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118158/photo-gallery/vpilj9fcm/IMG_6686_jrfydy.jpg",
        name: "IMG_6686",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "gmb5hytcs",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118172/photo-gallery/vpilj9fcm/IMG_4257_yvceqq.jpg",
        name: "IMG_4257",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "fjlkktiha",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118161/photo-gallery/vpilj9fcm/8B581C4C-4A6A-4037-BB8C-F5620CD3BDC0_cqy9oe.jpg",
        name: "8B581C4C-4A6A-4037-BB8C-F5620CD3BDC0",
        uploadDate: new Date("2026-02-26")
      }
    ]
  },
  {
    id: "2",
    title: "Urban Moments",
    displayTitle: "urban",
    description: "Streets and people from cities around the world.",
    createdAt: new Date("2024-02-20"),
    photos: [
      {
        id: "nlbh8wl0b",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947331/photo-gallery/2/IMG_4674_it6mkb.jpg",
        name: "IMG_4674",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "novve5b1w",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836593/photo-gallery/2/theweeknd_glr4pv.jpg",
        name: "theweeknd",
        description: "The Weeknd concert",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "xwsvqoyoz",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771836598/photo-gallery/2/maroon5_us9rd6.jpg",
        name: "maroon5",
        description: "Maroon 5 concert",
        location: "Amsterdam, Netherlands",
        uploadDate: new Date("2026-02-23")
      },
      {
        id: "vznnncb3z",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947299/photo-gallery/2/IMG_1703_qzuhnr.jpg",
        name: "IMG_1703",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "21vnw8g8q",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118341/photo-gallery/2/B6627993-B810-4F35-A4F3-3AB80FAEC26A_nuojhg.jpg",
        name: "B6627993-B810-4F35-A4F3-3AB80FAEC26A",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "u4ctr58ko",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1771947332/photo-gallery/2/ECBD7E89-24C8-41C0-995C-8AD79AD36776_bpb6xh.jpg",
        name: "ECBD7E89-24C8-41C0-995C-8AD79AD36776",
        uploadDate: new Date("2026-02-24")
      },
      {
        id: "wo0ey7dzn",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118289/photo-gallery/2/IMG_9599_pm4kwg.jpg",
        name: "IMG_9599",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "d7or5tr2n",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118325/photo-gallery/2/IMG_8961_wmfxoj.jpg",
        name: "IMG_8961",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "h443sdm4t",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118328/photo-gallery/2/B0470FE5-2E55-46ED-B075-96413B394ECE_q39ptb.jpg",
        name: "B0470FE5-2E55-46ED-B075-96413B394ECE",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "83tyr3crw",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118330/photo-gallery/2/IMG_8157_mvdgjk.jpg",
        name: "IMG_8157",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "iwsy3zxnv",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118338/photo-gallery/2/28941EC9-2087-4920-8447-088374309660_kplzik.jpg",
        name: "28941EC9-2087-4920-8447-088374309660",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "wsdo1usfu",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118333/photo-gallery/2/IMG_7754_lmmtze.jpg",
        name: "IMG_7754",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "vjjz1ezyx",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118348/photo-gallery/2/55B540DE-A25D-4ABF-BAD0-8C5FCEAF3A73_supkj6.jpg",
        name: "55B540DE-A25D-4ABF-BAD0-8C5FCEAF3A73",
        uploadDate: new Date("2026-02-26")
      },
      {
        id: "v5kpli8ul",
        url: "https://res.cloudinary.com/di43jfzx7/image/upload/v1772118345/photo-gallery/2/F1BA48D6-C1E6-4321-851D-B8AE732C781D_lytppl.jpg",
        name: "F1BA48D6-C1E6-4321-851D-B8AE732C781D",
        uploadDate: new Date("2026-02-26")
      }
    ]
  }
];





export const generateId = () => Math.random().toString(36).substr(2, 9);

const fallbackPhoto: Photo = {
  id: "fallback",
  url: "https://images.unsplash.com/photo-1628889923625-e3b33f73d780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  name: "Fallback Photo",
  uploadDate: new Date()
};

export const getAllPhotos = (albums: Album[]): Photo[] => {
  const photos = albums.flatMap(album => album.photos);
  return photos.length > 0 ? photos : [fallbackPhoto];
};

export const getPhotoByIdFromAlbums = (albums: Album[], photoId: string): Photo => {
  for (const album of albums) {
    const photo = album.photos.find(p => p.id === photoId);
    if (photo) return photo;
  }
  return getAllPhotos(albums)[0];
};

export const getPhotoIndexInAlbums = (albums: Album[], photoId: string): number => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  return index >= 0 ? index + 1 : 1;
};

export const getPrevPhotoInAlbums = (albums: Album[], photoId: string): Photo => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  if (index <= 0) return allPhotos[allPhotos.length - 1];
  return allPhotos[index - 1];
};

export const getNextPhotoInAlbums = (albums: Album[], photoId: string): Photo => {
  const allPhotos = getAllPhotos(albums);
  const index = allPhotos.findIndex(p => p.id === photoId);
  if (index === -1 || index === allPhotos.length - 1) return allPhotos[0];
  return allPhotos[index + 1];
};

export const saveAlbumsToStorage = (albums: Album[]) => {
  try {
    const serialized = albums.map(album => ({
      ...album,
      createdAt: album.createdAt.toISOString(),
      photos: album.photos.map(photo => ({
        ...photo,
        uploadDate: photo.uploadDate.toISOString()
      }))
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save albums to storage:', error);
  }
};

export const loadAlbumsFromStorage = (): Album[] => {
  try {
    // Check version - if mismatched, clear storage and use initial data
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return initialAlbums;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialAlbums;
    
    const parsed = JSON.parse(stored);
    return parsed.map((album: any) => ({
      ...album,
      createdAt: new Date(album.createdAt),
      photos: album.photos.map((photo: any) => ({
        ...photo,
        uploadDate: new Date(photo.uploadDate),
        location: photo.location
      }))
    }));
  } catch (error) {
    console.error('Failed to load albums from storage:', error);
    return initialAlbums;
  }
};
