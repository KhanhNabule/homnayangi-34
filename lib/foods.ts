import { priceRarity } from './case-mechanics';
export type Food={name:string;sub:string;price:number;rarity:number;image:number;veg?:boolean;quip:string};
// Approximate lunch portion prices in thousands of VND, not restaurant quotes.
export const foods:Food[]=[
  {
    "name": "Cơm tấm",
    "sub": "Sườn bì chả • Việt Nam",
    "price": 45,
    "image": 0,
    "quip": "Sườn có thể gãy. Kèo này thì không."
  },
  {
    "name": "Phở bò",
    "sub": "Tái nạm • Việt Nam",
    "price": 55,
    "image": 1,
    "quip": "Đời có thể nhạt. Nước phở thì không."
  },
  {
    "name": "Bánh mì",
    "sub": "Thịt nướng • Việt Nam",
    "price": 25,
    "image": 2,
    "quip": "Vũ khí cận chiến của dân văn phòng."
  },
  {
    "name": "Bún chả",
    "sub": "Chả nướng • Việt Nam",
    "price": 50,
    "image": 3,
    "quip": "Một pha gắp chả đi vào lòng người."
  },
  {
    "name": "Sushi cá hồi",
    "sub": "Cá hồi • Nhật Bản",
    "price": 150,
    "image": 4,
    "quip": "Legendary drop. Ví bạn vừa disconnect."
  },
  {
    "name": "Pizza",
    "sub": "Phô mai • Ý",
    "price": 100,
    "image": 5,
    "quip": "Một miếng cho bạn. Phần còn lại cũng vậy."
  },
  {
    "name": "Gà rán",
    "sub": "Giòn cay • Quốc tế",
    "price": 65,
    "image": 6,
    "quip": "Winner winner, chicken lunch."
  },
  {
    "name": "Cơm chay",
    "sub": "Đậu hũ & rau • Việt Nam",
    "price": 35,
    "image": 7,
    "veg": true,
    "quip": "Ăn chay nhưng chiến hết mình."
  },
  {
    "name": "Bibimbap",
    "sub": "Cơm trộn • Hàn Quốc",
    "price": 85,
    "image": 8,
    "quip": "Trộn cơm. Đừng trộn deadline."
  },
  {
    "name": "Cơm gà Hội An",
    "sub": "Món ăn trưa",
    "price": 45,
    "image": 9,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bún bò Huế",
    "sub": "Món ăn trưa",
    "price": 50,
    "image": 10,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Hủ tiếu",
    "sub": "Món ăn trưa",
    "price": 40,
    "image": 11,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Mì Quảng",
    "sub": "Món ăn trưa",
    "price": 45,
    "image": 12,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bún thịt nướng",
    "sub": "Món ăn trưa",
    "price": 40,
    "image": 13,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bánh cuốn",
    "sub": "Món ăn trưa",
    "price": 35,
    "image": 14,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bún đậu mắm tôm",
    "sub": "Món ăn trưa",
    "price": 55,
    "image": 15,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Cơm rang dưa bò",
    "sub": "Món ăn trưa",
    "price": 50,
    "image": 16,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bò lúc lắc",
    "sub": "Món ăn trưa",
    "price": 85,
    "image": 17,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bánh xèo",
    "sub": "Món ăn trưa",
    "price": 50,
    "image": 18,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bánh đa cua",
    "sub": "Món ăn trưa",
    "price": 45,
    "image": 19,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Mì xào bò",
    "sub": "Món ăn trưa",
    "price": 45,
    "image": 20,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Bún cá",
    "sub": "Món ăn trưa",
    "price": 40,
    "image": 21,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Gỏi cuốn",
    "sub": "Món ăn trưa",
    "price": 35,
    "image": 22,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Cháo sườn",
    "sub": "Món ăn trưa",
    "price": 25,
    "image": 23,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Ramen",
    "sub": "Món ăn trưa",
    "price": 100,
    "image": 24,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Udon",
    "sub": "Món ăn trưa",
    "price": 85,
    "image": 25,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Cơm cà ri Nhật",
    "sub": "Món ăn trưa",
    "price": 90,
    "image": 26,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Tteokbokki",
    "sub": "Món ăn trưa",
    "price": 65,
    "image": 27,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Burger",
    "sub": "Món ăn trưa",
    "price": 65,
    "image": 28,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Mì Ý bò bằm",
    "sub": "Món ăn trưa",
    "price": 80,
    "image": 29,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Pad Thai",
    "sub": "Món ăn trưa",
    "price": 75,
    "image": 30,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Mì Tom Yum",
    "sub": "Món ăn trưa",
    "price": 80,
    "image": 31,
    "veg": false,
    "quip": ""
  },
  {
    "name": "Lẩu nấm chay",
    "sub": "Chay",
    "price": 120,
    "image": 32,
    "veg": true,
    "quip": ""
  },
  {
    "name": "Mì nấm chay",
    "sub": "Chay",
    "price": 40,
    "image": 33,
    "veg": true,
    "quip": ""
  },
  {
    "name": "Bánh mì chay",
    "sub": "Chay",
    "price": 25,
    "image": 34,
    "veg": true,
    "quip": ""
  },
  {
    "name": "Gỏi cuốn chay",
    "sub": "Chay",
    "price": 35,
    "image": 35,
    "veg": true,
    "quip": ""
  },
  {
    "name": "Cơm thịt kho trứng",
    "price": 40,
    "image": 36,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm cá kho",
    "price": 40,
    "image": 37,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm đậu hũ sốt cà chua",
    "price": 35,
    "image": 38,
    "veg": true,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm gà xối mỡ",
    "price": 55,
    "image": 39,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm sườn nướng",
    "price": 55,
    "image": 40,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm bò xào",
    "price": 60,
    "image": 41,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Bún riêu",
    "price": 45,
    "image": 42,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Bánh canh cua",
    "price": 60,
    "image": 43,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Bò né",
    "price": 75,
    "image": 44,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm gà teriyaki",
    "price": 85,
    "image": 45,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm heo chiên xù",
    "price": 95,
    "image": 46,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm chiên hải sản",
    "price": 85,
    "image": 47,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Mì vịt tiềm",
    "price": 95,
    "image": 48,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Kimbap",
    "price": 70,
    "image": 49,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Mì trộn Hàn Quốc",
    "price": 75,
    "image": 50,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Salad ức gà",
    "price": 85,
    "image": 51,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Mì Ý sốt kem bacon",
    "price": 115,
    "image": 52,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Lasagna bò",
    "price": 125,
    "image": 53,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Burger bò phô mai & khoai tây",
    "price": 120,
    "image": 54,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Pizza pepperoni",
    "price": 120,
    "image": 55,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm bò gyudon",
    "price": 110,
    "image": 56,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm cá saba nướng",
    "price": 110,
    "image": 57,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Mì soba Nhật",
    "price": 110,
    "image": 58,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm cà ri Thái",
    "price": 110,
    "image": 59,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Salad cá ngừ",
    "price": 110,
    "image": 60,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Salad quinoa đậu gà",
    "price": 115,
    "image": 61,
    "veg": true,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Bò bít tết",
    "price": 180,
    "image": 62,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cá hồi áp chảo",
    "price": 190,
    "image": 63,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm lươn Nhật",
    "price": 180,
    "image": 64,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm bò nướng Hàn",
    "price": 150,
    "image": 65,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Cơm cá hồi teriyaki",
    "price": 150,
    "image": 66,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Poke cá hồi",
    "price": 160,
    "image": 67,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Sườn BBQ ăn kèm cơm",
    "price": 170,
    "image": 68,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Pizza hải sản",
    "price": 160,
    "image": 69,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Mì Ý hải sản",
    "price": 160,
    "image": 70,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  },
  {
    "name": "Lẩu bò cá nhân",
    "price": 160,
    "image": 71,
    "sub": "Phần ăn trưa / người",
    "quip": ""
  }
].map(food=>({...food,rarity:priceRarity(food.price)}));
