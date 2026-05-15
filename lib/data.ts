import { Category } from './types'

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'อาหาร',
    emoji: '🍜',
    pairs: [
      ['ข้าวผัด', 'ผัดไทย'],
      ['ต้มยำกุ้ง', 'แกงเขียวหวาน'],
      ['ส้มตำ', 'ลาบหมู'],
      ['ข้าวมันไก่', 'ข้าวหมูแดง'],
      ['กระเพราหมูสับ', 'ข้าวไข่ดาว'],
    ],
  },
  {
    id: 'fruit',
    name: 'ผลไม้',
    emoji: '🍑',
    pairs: [
      ['มะม่วง', 'ทุเรียน'],
      ['สับปะรด', 'มังคุด'],
      ['กล้วย', 'ลำไย'],
      ['แตงโม', 'มะละกอ'],
      ['เงาะ', 'ลิ้นจี่'],
    ],
  },
  {
    id: 'animals',
    name: 'สัตว์โลก',
    emoji: '🐯',
    pairs: [
      ['สิงโต', 'เสือ'],
      ['ช้าง', 'ม้า'],
      ['แมว', 'หมา'],
      ['นก', 'ปลา'],
      ['หมู', 'วัว'],
    ],
  },
  {
    id: 'things',
    name: 'สิ่งของ',
    emoji: '💎',
    pairs: [
      ['บ้านในฝัน', 'เงินสด 3 ล้านบาท'],
      ['รถหรู', 'ท่องเที่ยวรอบโลก'],
      ['โทรศัพท์รุ่นใหม่', 'เสื้อผ้าแบรนด์เนม'],
      ['นาฬิกาแพง', 'กระเป๋าแบรนด์'],
      ['คอนโดกลางเมือง', 'บ้านชานเมือง'],
    ],
  },
  {
    id: 'sports',
    name: 'กีฬา',
    emoji: '⚽',
    pairs: [
      ['ฟุตบอล', 'บาสเกตบอล'],
      ['ว่ายน้ำ', 'วิ่งมาราธอน'],
      ['เทนนิส', 'แบดมินตัน'],
      ['มวยไทย', 'ยูโด'],
      ['ขี่จักรยาน', 'เล่นกอล์ฟ'],
    ],
  },
  {
    id: 'activities',
    name: 'กิจกรรม',
    emoji: '🎮',
    pairs: [
      ['ดูหนัง', 'เล่นเกม'],
      ['ร้องเพลง', 'เต้น'],
      ['ท่องเที่ยว', 'อยู่บ้าน'],
      ['อ่านหนังสือ', 'ฟังเพลง'],
      ['ทำอาหาร', 'กินข้าวนอกบ้าน'],
    ],
  },
]

// Maps Thai item names to English seeds for picsum.photos
// picsum gives a consistent image per seed — custom items fall back to encoded Thai text as seed
const ITEM_SEEDS: Record<string, string> = {
  // อาหาร
  'ข้าวผัด': 'fried-rice',
  'ผัดไทย': 'noodles-thai',
  'ต้มยำกุ้ง': 'soup-shrimp',
  'แกงเขียวหวาน': 'green-curry',
  'ส้มตำ': 'papaya-salad',
  'ลาบหมู': 'meat-salad',
  'ข้าวมันไก่': 'chicken-rice',
  'ข้าวหมูแดง': 'roast-pork',
  'กระเพราหมูสับ': 'stir-fry-basil',
  'ข้าวไข่ดาว': 'fried-egg',
  // ผลไม้
  'มะม่วง': 'mango',
  'ทุเรียน': 'tropical-fruit',
  'สับปะรด': 'pineapple',
  'มังคุด': 'purple-fruit',
  'กล้วย': 'banana',
  'ลำไย': 'berries-round',
  'แตงโม': 'watermelon',
  'มะละกอ': 'papaya-orange',
  'เงาะ': 'red-fruit-spiky',
  'ลิ้นจี่': 'lychee',
  // สัตว์โลก
  'สิงโต': 'lion',
  'เสือ': 'tiger',
  'ช้าง': 'elephant',
  'ม้า': 'horse',
  'แมว': 'cat',
  'หมา': 'dog',
  'นก': 'bird',
  'ปลา': 'fish',
  'หมู': 'pig',
  'วัว': 'cow',
  // สิ่งของ
  'บ้านในฝัน': 'luxury-villa',
  'เงินสด 3 ล้านบาท': 'money-cash',
  'รถหรู': 'luxury-car',
  'ท่องเที่ยวรอบโลก': 'travel-world',
  'โทรศัพท์รุ่นใหม่': 'smartphone',
  'เสื้อผ้าแบรนด์เนม': 'fashion',
  'นาฬิกาแพง': 'luxury-watch',
  'กระเป๋าแบรนด์': 'handbag',
  'คอนโดกลางเมือง': 'city-apartment',
  'บ้านชานเมือง': 'suburban-house',
  // กีฬา
  'ฟุตบอล': 'football',
  'บาสเกตบอล': 'basketball',
  'ว่ายน้ำ': 'swimming',
  'วิ่งมาราธอน': 'running',
  'เทนนิส': 'tennis',
  'แบดมินตัน': 'badminton',
  'มวยไทย': 'boxing',
  'ยูโด': 'martial-arts',
  'ขี่จักรยาน': 'cycling',
  'เล่นกอล์ฟ': 'golf',
  // กิจกรรม
  'ดูหนัง': 'cinema',
  'เล่นเกม': 'gaming',
  'ร้องเพลง': 'singing',
  'เต้น': 'dancing',
  'ท่องเที่ยว': 'travel',
  'อยู่บ้าน': 'cozy-home',
  'อ่านหนังสือ': 'reading',
  'ฟังเพลง': 'headphones-music',
  'ทำอาหาร': 'cooking',
  'กินข้าวนอกบ้าน': 'restaurant',
}

export const getItemImage = (item: string, overrides?: Record<string, string>): string => {
  if (overrides?.[item]) return overrides[item]
  const seed = ITEM_SEEDS[item] ?? encodeURIComponent(item)
  return `https://picsum.photos/seed/${seed}/400/600`
}
