import { EmotionTag, GoalType, MBTIType } from '../types';

export const EMOTION_TAGS: EmotionTag[] = [
  {
    id: 'shaking',
    labelTh: 'ตื่นเต้น',
    labelEn: 'Nervous',
    emoji: '',
    color: '#FA8C3D', // Sunshade warm accent
    weightDescription: '',
    recommendedOption: 'A', // The Somatic Absorption (rubbing warms cold shaking hands)
  },
  {
    id: 'forgetting',
    labelTh: 'ว่างเปล่า',
    labelEn: 'Empty',
    emoji: '',
    color: '#F26E6E', // Flamingo
    weightDescription: '',
    recommendedOption: 'A', // Somatic Absorption / Blessing Sigil
  },
  {
    id: 'pressure',
    labelTh: 'กดดัน',
    labelEn: 'Pressure',
    emoji: '',
    color: '#3B82F6', // Accent Blue
    weightDescription: '',
    recommendedOption: 'B', // The Victory Sip (Vagal Maneuver)
  },
  {
    id: 'freeze',
    labelTh: 'สมองตื้อ',
    labelEn: 'Freeze',
    emoji: '',
    color: '#60A5FA',
    weightDescription: '',
    recommendedOption: 'C', // Kinetic Tension Shaker (discharge)
  },
  {
    id: 'burnout',
    labelTh: 'หมดไฟ',
    labelEn: 'Burnout',
    emoji: '',
    color: '#00C4B3', // Brand turquoise
    weightDescription: '',
    recommendedOption: 'D', // Pre-Generated Studio Audio Matrix
  },
  {
    id: 'anxious',
    labelTh: 'กังวล',
    labelEn: 'Anxious',
    emoji: '',
    color: '#F59E0B', // Warm Amber
    weightDescription: '',
    recommendedOption: 'A',
  },
  {
    id: 'overthinking',
    labelTh: 'คิดมาก',
    labelEn: 'Overthinking',
    emoji: '',
    color: '#8B5CF6', // Soft Purple
    weightDescription: '',
    recommendedOption: 'B',
  },
  {
    id: 'lonely',
    labelTh: 'โดดเดี่ยว',
    labelEn: 'Lonely',
    emoji: '',
    color: '#0284C7', // Gentle Sky Blue
    weightDescription: '',
    recommendedOption: 'D',
  },
  {
    id: 'confused',
    labelTh: 'สับสน',
    labelEn: 'Confused',
    emoji: '',
    color: '#10B981', // Mint Emerald
    weightDescription: '',
    recommendedOption: 'C',
  },
  {
    id: 'custom',
    labelTh: 'บอก Mooca...',
    labelEn: 'Tell Mooca...',
    emoji: '',
    color: '#EC4899', // Soft Rose Heart
    weightDescription: 'Personal heart message directly to Mooca',
    recommendedOption: 'A',
  },
];

export const CONTEXT_LOCATIONS = [
  { id: 'exam', labelTh: 'สนามสอบ / ห้องเรียน', labelEn: 'Exam Hall / School', icon: 'GraduationCap' },
  { id: 'office', labelTh: 'ออฟฟิศ / หน้าคอมพิวเตอร์', labelEn: 'Office / Workstation', icon: 'Briefcase' },
  { id: 'stage', labelTh: 'หลังเวที / ก่อนพรีเซนต์', labelEn: 'Backstage / Presentation', icon: 'Mic' },
  { id: 'transit', labelTh: 'ระหว่างเดินทาง / รถไฟฟ้า', labelEn: 'Transit / Commute', icon: 'Navigation' },
];

export interface ReframingInsight {
  reflectionTh: string;
  reflectionEn: string;
  microActionTh: string;
  microActionEn: string;
  biologyFactTh: string;
  biologyFactEn: string;
}

export const REFRAMING_INSIGHTS: Record<GoalType, ReframingInsight> = {
  exam: {
    reflectionTh: 'หัวใจที่เต้นเร็วและมือที่สั่นในตอนนี้ ไม่ใช่สัญญาณว่าคุณจะทำข้อสอบไม่ได้ แต่คือร่างกายกำลังสูบฉีดอะดรีนาลีนเพื่อเตรียมสมองให้พร้อมสู้และตื่นตัวสูงสุด',
    reflectionEn: 'Your racing heart and cold fingers are not signs of failure—they are your body releasing adrenaline to flood your brain with oxygen and prime peak focus.',
    microActionTh: 'สูดหายใจลึก 1 ครั้ง วางมือถือลง แล้วเดินเข้าห้องสอบด้วยความสงบ',
    microActionEn: 'Take 1 deep grounding breath, put your device aside, and walk into the examination room.',
    biologyFactTh: 'การไหลเวียนเลือดกลับสู่สมองส่วนหน้าทำให้ความจำระยะยาวพร้อมถูกดึงมาใช้งาน',
    biologyFactEn: 'Restored prefrontal cortex perfusion unlocks crystallized long-term recall.',
  },
  work: {
    reflectionTh: 'วันนี้คุณนั่งหน้าจอติดต่อกันเกินขีดจำกัด การที่สมองตื้อตันเป็นกลไกป้องกันตัวทางชีววิทยา ไม่ใช่เพราะคุณทำงานไม่เก่งหรือขาดวินัย',
    reflectionEn: 'You have been in uninterrupted hyperfocus. Cognitive freeze is your biology protecting itself, not a lack of talent or willpower.',
    microActionTh: 'ลุกไปล้างมือด้วยน้ำเย็นจัด 20 วินาที เพื่อกระตุ้นระบบประสาทให้ตาสว่าง',
    microActionEn: 'Stand up and rinse both hands with cold water for 20 seconds to reset nervous pathways.',
    biologyFactTh: 'การสัมผัสน้ำเย็นกระตุ้น Mammalian Dive Reflex ช่วยชะลอความเหนื่อยล้าลงทันที',
    biologyFactEn: 'Cold water contact activates the Mammalian Dive Reflex to instantly lower nervous strain.',
  },
  stage: {
    reflectionTh: 'ความตื่นเต้นบนเวทีคือหลักฐานว่าคุณให้เกียรติและแคร์ผู้ฟัง เปลี่ยนความสั่นไหวนี้ให้กลายเป็นพลังความอบอุ่นที่ส่งตรงถึงสายตาทุกคู่',
    reflectionEn: 'Stage butterflies prove that you care deeply about your audience. Channel this kinetic energy into genuine warmth and connection.',
    microActionTh: 'หลับตาลง ทอดสายตามองไปที่จุดไกลที่สุด 30 วินาที แล้วยิ้มให้ตัวเอง',
    microActionEn: 'Soften your gaze toward the farthest horizon for 30 seconds and anchor your posture.',
    biologyFactTh: 'การผ่อนสายตา (Panoramic Vision) ส่งสัญญาณตรงสู่สมองว่าไม่มีภัยคุกคาม',
    biologyFactEn: 'Panoramic peripheral vision instantly deactivates acute amygdala alert signals.',
  },
  burnout: {
    reflectionTh: 'พลังงานของคุณเป็นทรัพยากรที่มีขอบเขต การหยุดนิ่ง 2 นาทีนี้คือการชาร์จแบตเตอรี่ที่มีค่าที่สุด เพื่อให้คุณก้าวต่อไปได้อย่างยั่งยืน',
    reflectionEn: 'Your energy is a precious finite vessel. Pausing for these 2 minutes is not lost time; it is your highest-yield restoration investment.',
    microActionTh: 'ดื่มน้ำอุณหภูมิห้อง 1 แก้ว แล้วคลายหัวไหล่ลงให้สุด',
    microActionEn: 'Drink a glass of fresh water and consciously drop both shoulders away from your ears.',
    biologyFactTh: 'การยืดเหยียดคอบ่าช่วยคลายการกดทับของเส้นประสาท Vagus Nerve',
    biologyFactEn: 'Releasing trapezius tension immediately frees vagal nerve transmission.',
  },
};

export function getMBTIArchetype(mbti: MBTIType): 'analytical' | 'empathetic' | 'action' {
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(mbti)) return 'analytical';
  if (['INFP', 'ISFJ', 'INFJ', 'ENFP'].includes(mbti)) return 'empathetic';
  return 'action';
}

export const MBTI_SANCTUARY_SCRIPTS: Record<'analytical' | 'empathetic' | 'action', { th: string; en: string }> = {
  analytical: {
    th: 'ความเหนื่อยล้าตอนนี้คือข้อจำกัดทางกายภาพตามธรรมชาติ ไม่ใช่ความล้มเหลวของการวางแผน ข้อมูลและองค์ความรู้ทั้งหมดของคุณยังคงอยู่ครบถ้วนในสมองอย่างมั่นคง หายใจเข้าลึกๆ แล้วดำเนินการตามระบบที่คุณเตรียมมา',
    en: 'This physical surge is your natural fight-or-flight energy activating. It is not an error in your preparation; your mental architecture is solid. Breathe deeply and trust your methodology.',
  },
  empathetic: {
    th: 'วางภาระและความคาดหวังของทุกคนลงก่อน ในวินาทีนี้ พื้นที่ตรงนี้ปลอดภัยสำหรับคุณเสมอ คุณได้พยายามอย่างเต็มที่แล้ว และตัวตนของคุณมีคุณค่ามากกว่าผลลัพธ์ใดๆ ในโลกภายนอก',
    en: 'Gently set down the weight of other people’s expectations. In this very second, this sanctuary is safe for you. You have done your best, and your worth is beyond any external score.',
  },
  action: {
    th: 'ตัดเสียงรบกวนรอบตัวทิ้งไปทั้งหมด โฟกัสเฉพาะวินาทีตรงหน้านี้เท่านั้น กล้ามเนื้อและสัญชาตญาณของคุณพร้อมแล้ว ก้าวเข้าไปทำให้เต็มที่อย่างเด็ดเดี่ยว',
    en: 'Cut through all the ambient noise. Anchor your focus strictly to this present breath. Your muscle memory and instincts are ready. Step forward with total conviction.',
  },
};
