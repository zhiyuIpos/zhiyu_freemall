create table product(
    pid INT PRIMARY KEY AUTO_INCREMENT,
    img varchar(100) NOT NULL,
    title varchar(100) NOT NULL,
    sub_title varchar(100) NOT NULL,
    price decimal(7,2) NOT NULL,
    herf varchar(100) NOT NULL,
    carefull int,
    brand int 
)DEFAULT CHARSET=utf8;

insert into product values
(1,"images/g1.jpg","坚果 3 前屏钢化玻璃保护膜","超强透光率、耐刮花、防指纹",49,"detail.html?lid=1",1,null),
(2,"images/g2.jpg","坚果 3 绒布国旗保护套","质感精良、完美贴合、周到防护",79,"detail.html?lid=2",2,null),
(3,"images/g3.jpg","坚果 3 TPU 软胶透明保护套","轻薄透明、完美贴合、TPU 环保材质",29,"detail.html?lid=3",3,null),
(4,"images/g4.jpg","Smartisan 半入耳式耳机","经典配色、专业调音、高品质麦克风",89,"detail.html?lid=4",4,null),
(5,"images/g5.jpg","坚果 3 TPU 软胶保护套","TPU 环保材质、完美贴合、周到防护",49,"detail.html?lid=5",5,null),
(6,"images/g6.jpg","坚果 3 '足迹'背贴 乐高创始人出生","1891 年 4 月 7 日",99,"detail.html?lid=6",6,null),
(7,"images/g.jpg","坚果 3 三面无边框","漂亮得不像实力派",1299,"detail.html?lid=7",7,null),
(8,"images/z1.jpg","Smartisan 帆布鞋","一双踏实、舒适的帆布鞋",199,"detail.html?lid=11",null,11),
(9,"images/z2.jpg","Smartisan T恤 伍迪·艾伦出生","一件内外兼修的舒适T恤",149,"detail.html?lid=12",null,12),
(10,"images/z3.jpg","Smartisan T恤 任天堂发售“红白机”","100% 美国 SUPIMA 棉、舒适拉绒质地",149,"detail.html?lid=13",null,13),
(11,"images/z4.jpg","Smartisan 牛津纺衬衫","一件无拘无束的舒适衬衫",199,"detail.html?lid=14",null,14),
(12,"images/z5.jpg","Smartisan Polo衫 经典款","一件表里如一的舒适 POLO 衫",249,"detail.html?lid=15",null,15),
(13,"images/z6.jpg","Smartisan 明信片","优质卡纸、包装精致、色彩饱满",9.9,"detail.html?lid=16",null,16),
(14,"images/z.jpg","Smartisan 周边上新","舒适又适用",1099,"detail.html?lid=17",null,17)


  
